// تحميل المتغيرات من ملف .env
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

// إنشاء العميل (Client)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// إعداد الأوامر
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// تحميل كل الأوامر
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[تحذير] لم يتم تحميل الأمر ${file} لأنه ناقص data أو execute`);
  }
}

// عند تشغيل البوت
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// التعامل مع الأوامر (Slash Commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('❌ خطأ في تنفيذ الأمر:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '⚠️ حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
    } else {
      await interaction.reply({ content: '⚠️ حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
    }
  }
});

// تشغيل البوت
client.login(process.env.TOKEN);
