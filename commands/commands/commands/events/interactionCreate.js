const DB = require('st.db');
const db = new DB({ path: './Json-db/reactionDB.json' });

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isButton()) {
        const id = interaction.customId;
        if (!id.startsWith('rr_')) return;
        const roleId = id.split('rr_')[1];
        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) return interaction.reply({ content: '❌ الرول غير موجود.', ephemeral: true });

        if (member.roles.cache.has(roleId)) {
          await member.roles.remove(roleId);
          return interaction.reply({ content: `🗑️ تمت إزالة ${role.name}`, ephemeral: true });
        } else {
          await member.roles.add(roleId);
          return interaction.reply({ content: `✅ تمت إضافة ${role.name}`, ephemeral: true });
        }
      }

      if (interaction.isStringSelectMenu()) {
        if (interaction.customId !== 'rr_select_menu') return;
        const values = interaction.values;
        const member = interaction.member;
        for (const roleId of values) {
          const role = interaction.guild.roles.cache.get(roleId);
          if (!role) continue;
          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
          } else {
            await member.roles.add(roleId);
          }
        }
        return interaction.reply({ content: '✅ تم تحديث رولاتك.', ephemeral: true });
      }
    } catch (err) {
      console.error('Button interaction error', err);
    }
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      if (user.bot) return;
      if (reaction.partial) await reaction.fetch();
      const msg = reaction.message;
      const guildId = msg.guildId;
      const guildData = db.get(guildId);
      if (!guildData) return;
      if (msg.id !== guildData.message) return;
      const roleObj = guildData.roles.find(r => r.asReaction && r.emoji === reaction.emoji.name);
      if (!roleObj) return;
      const member = await msg.guild.members.fetch(user.id);
      const role = msg.guild.roles.cache.get(roleObj.roleId);
      if (!role) return;
      if (!member.roles.cache.has(role.id)) await member.roles.add(role.id);
    } catch (e) { console.error(e); }
  });

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      if (user.bot) return;
      if (reaction.partial) await reaction.fetch();
      const msg = reaction.message;
      const guildId = msg.guildId;
      const guildData = db.get(guildId);
      if (!guildData) return;
      if (msg.id !== guildData.message) return;
      const roleObj = guildData.roles.find(r => r.asReaction && r.emoji === reaction.emoji.name);
      if (!roleObj) return;
      const member = await msg.guild.members.fetch(user.id);
      const role = msg.guild.roles.cache.get(roleObj.roleId);
      if (!role) return;
      if (member.roles.cache.has(role.id)) await member.roles.remove(role.id);
    } catch (e) { console.error(e); }
  });
};
