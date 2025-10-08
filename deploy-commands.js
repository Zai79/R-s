const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // optional for testing
const token = process.env.TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data) commands.push(command.data.toJSON ? command.data.toJSON() : command.data);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Registering ${commands.length} commands...`);
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('Registered commands to guild ' + guildId);
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Registered global commands');
    }
  } catch (err) {
    console.error(err);
  }
})();
