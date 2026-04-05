const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const AxiosDigestAuth = require('@mhoc/axios-digest-auth').default;
require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MONGO_URI = process.env.MONGO_URI;
const ATLAS_PUBLIC_KEY = process.env.ATLAS_PUBLIC_KEY;
const ATLAS_PRIVATE_KEY = process.env.ATLAS_PRIVATE_KEY;
const ATLAS_PROJECT_ID = process.env.ATLAS_PROJECT_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const digestAuth = new AxiosDigestAuth({
  username: ATLAS_PUBLIC_KEY,
  password: ATLAS_PRIVATE_KEY
});

async function atlasRequest(method, path, data) {
  const res = await digestAuth.request({
    method,
    url: `https://cloud.mongodb.com/api/atlas/v2${path}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.atlas.2023-01-01+json'
    },
    data
  });
  return res.data;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let db;

async function connectDB() {
  const mongo = new MongoClient(MONGO_URI);
  await mongo.connect();
  db = mongo.db('mongodb_bot');
  console.log('✅ Connected to bot DB');
}

async function createCluster(projectId, userId) {
  return atlasRequest('POST', `/groups/${projectId}/clusters`, {
    name: `cluster-${userId.slice(-6)}`,
    clusterType: 'REPLICASET',
    providerSettings: {
      providerName: 'TENANT',
      backingProviderName: 'AWS',
      instanceSizeName: 'M0',
      regionName: 'US_EAST_1'
    }
  });
}

async function waitForCluster(projectId, clusterName) {
  for (let i = 0; i < 30; i++) {
    const res = await atlasRequest('GET', `/groups/${projectId}/clusters/${clusterName}`);
    if (res.stateName === 'IDLE') return res;
    await new Promise(r => setTimeout(r, 10000));
  }
  throw new Error('Cluster timeout');
}

async function createDBUser(projectId, userId) {
  const password = generatePassword();
  const username = `user_${userId.slice(-8)}`;
  await atlasRequest('POST', `/groups/${projectId}/databaseUsers`, {
    databaseName: 'admin',
    username,
    password,
    roles: [{ roleName: 'readWriteAnyDatabase', databaseName: 'admin' }]
  });
  return { username, password };
}

async function allowAllIPs(projectId) {
  await atlasRequest('POST', `/groups/${projectId}/accessList`, [
    { cidrBlock: '0.0.0.0/0', comment: 'Allow all' }
  ]);
}

async function getConnectionString(projectId, clusterName, username, password) {
  const res = await atlasRequest('GET', `/groups/${projectId}/clusters/${clusterName}`);
  const srv = res.connectionStrings?.standardSrv;
  if (!srv) throw new Error('No connection string');
  return srv.replace('mongodb+srv://', `mongodb+srv://${username}:${encodeURIComponent(password)}@`);
}

async function deleteCluster(projectId, clusterName) {
  try {
    await atlasRequest('DELETE', `/groups/${projectId}/clusters/${clusterName}`);
  } catch (e) {
    console.error('Delete cluster error:', e.response?.data || e.message);
  }
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function getButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('create_link').setLabel('Create Link').setStyle(ButtonStyle.Secondary).setEmoji('🪣'),
    new ButtonBuilder().setCustomId('delete_link').setLabel('Delete Link').setStyle(ButtonStyle.Secondary).setEmoji('🗑️'),
    new ButtonBuilder().setCustomId('my_links').setLabel('My Links').setStyle(ButtonStyle.Secondary).setEmoji('🔍')
  );
}

function getMainEmbed() {
  return new EmbedBuilder()
    .setTitle('📊 MongoDB Link Creator')
    .setDescription('نظام إنشاء روابط MongoDB')
    .setColor(0x00ED64)
    .setFooter({ text: 'Last update: just now' });
}

async function setupChannel() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return;

  const saved = await db.collection('config').findOne({ key: 'panel_message' });
  if (saved) {
    try {
      const msg = await channel.messages.fetch(saved.messageId);
      await msg.edit({ embeds: [getMainEmbed()], components: [getButtons()] });
      return;
    } catch { }
  }

  await channel.bulkDelete(10).catch(() => { });
  const msg = await channel.send({ embeds: [getMainEmbed()], components: [getButtons()] });
  await db.collection('config').updateOne({ key: 'panel_message' }, { $set: { messageId: msg.id } }, { upsert: true });
}

async function handleCreateLink(interaction) {
  const userId = interaction.user.id;

  const existing = await db.collection('links').findOne({ userId });
  if (existing) {
    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('⚠️ عندك رابط مسبقاً')
        .setDescription('عندك رابط MongoDB موجود بالفعل!\nاستخدم **My Links** لتشوفه، أو **Delete Link** لتحذفه أولاً.')
        .setColor(0xFF6B35)],
      flags: 64
    });
  }

  await interaction.reply({
    embeds: [new EmbedBuilder()
      .setTitle('⏳ جاري إنشاء قاعدة البيانات...')
      .setDescription('هاد العملية بتاخد 2-3 دقائق، انتظر شوية! ☕')
      .setColor(0xFFA500)],
    flags: 64
  });

  try {
    const projectId = ATLAS_PROJECT_ID;
    const cluster = await createCluster(projectId, userId);
    const clusterName = cluster.name;

    await waitForCluster(projectId, clusterName);

    const { username, password } = await createDBUser(projectId, userId);
    await allowAllIPs(projectId);

    const connectionString = await getConnectionString(projectId, clusterName, username, password);

    await db.collection('links').insertOne({
      userId, projectId, clusterName, connectionString, createdAt: new Date()
    });

    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setTitle('📄 Your MongoDB Link')
        .addFields({ name: 'Link:', value: `\`\`\`${connectionString}\`\`\`` })
        .setColor(0x00ED64)
        .setFooter({ text: 'Only you can see this' })],
      flags: 64
    });

  } catch (err) {
    console.error('Create error:', err.response?.data || err.message);
    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setTitle('❌ حصل خطأ')
        .setDescription('صار خطأ أثناء إنشاء قاعدة البيانات. حاول مرة ثانية.')
        .setColor(0xFF0000)],
      flags: 64
    });
  }
}

async function handleDeleteLink(interaction) {
  const userId = interaction.user.id;
  const link = await db.collection('links').findOne({ userId });

  if (!link) {
    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('❌ ما عندك رابط')
        .setDescription('ما عندك قاعدة بيانات محفوظة.')
        .setColor(0xFF0000)],
      flags: 64
    });
  }

  await interaction.reply({
    embeds: [new EmbedBuilder()
      .setTitle('⏳ جاري الحذف...')
      .setDescription('بتم حذف قاعدة البيانات، انتظر شوية...')
      .setColor(0xFFA500)],
    flags: 64
  });

  try {
    await deleteCluster(link.projectId, link.clusterName);
    await db.collection('links').deleteOne({ userId });

    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setTitle('✅ تم الحذف')
        .setDescription('تم حذف قاعدة البيانات بنجاح!')
        .setColor(0x00ED64)],
      flags: 64
    });
  } catch (err) {
    console.error('Delete error:', err);
    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setTitle('❌ حصل خطأ')
        .setDescription('صار خطأ أثناء الحذف.')
        .setColor(0xFF0000)],
      flags: 64
    });
  }
}

async function handleMyLinks(interaction) {
  const userId = interaction.user.id;
  const link = await db.collection('links').findOne({ userId });

  if (!link) {
    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('📭 ما عندك روابط')
        .setDescription('ما عندك قاعدة بيانات. استخدم **Create Link** لتنشئ وحدة!')
        .setColor(0xFF6B35)],
      flags: 64
    });
  }

  return interaction.reply({
    embeds: [new EmbedBuilder()
      .setTitle('📄 Your MongoDB Link')
      .addFields(
        { name: 'Link:', value: `\`\`\`${link.connectionString}\`\`\`` },
        { name: 'Created At:', value: `<t:${Math.floor(link.createdAt.getTime() / 1000)}:R>` }
      )
      .setColor(0x00ED64)
      .setFooter({ text: 'Only you can see this' })],
    flags: 64
  });
}

client.once('ready', async () => {
  console.log(`✅ Bot ready: ${client.user.tag}`);
  await connectDB();
  await setupChannel();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.channelId !== CHANNEL_ID) return;

  if (interaction.customId === 'create_link') await handleCreateLink(interaction);
  else if (interaction.customId === 'delete_link') await handleDeleteLink(interaction);
  else if (interaction.customId === 'my_links') await handleMyLinks(interaction);
});

client.login(DISCORD_TOKEN);

