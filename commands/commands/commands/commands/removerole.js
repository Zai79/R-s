const { SlashCommandBuilder } = require('discord.js');
const DB = require('st.db');
const db = new DB({ path: './Json-db/reactionDB.json' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('إزالة رول من نظام الرولات')
    .addRoleOption(opt => opt.setName('message').setDescription('اختر الرول').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({ content: '❌ تحتاج صلاحية Manage Roles لاستخدام هذا الأمر.', ephemeral: true });
    }

    const guildId = interaction.guildId;
    const role = interaction.options.getRole('role');
    const guildData = db.get(guildId);
    if (!guildData) return interaction.reply({ content: '❌ لم يتم ضبط رسالة الرولات بعد. استخدم /setup', ephemeral: true });

    const idx = guildData.roles.findIndex(r => r.roleId === role.id);
    if (idx === -1) return interaction.reply({ content: '❌ هذا الرول غير موجود.', ephemeral: true });

    const removed = guildData.roles.splice(idx, 1);
    db.set(guildId, guildData);

    const client = interaction.client;
    try {
      const channel = await client.channels.fetch(guildData.channelId);
      const msg = await channel.messages.fetch(guildData.message);
      const { buildComponents } = require('../utils/buildComponents');
      const comps = buildComponents(guildData.roles, guildData.type);
      await msg.edit({ components: comps });
      if (removed[0].asReaction && removed[0].emoji) {
        try { await msg.reactions.cache.get(removed[0].emoji)?.users.remove(client.user.id); } catch(e) {}
      }
    } catch (err) { console.error(err); }

    return interaction.reply({ content: `✅ تم حذف الرول ${role.name}`, ephemeral: true });
  }
};
