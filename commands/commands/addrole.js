const { SlashCommandBuilder } = require('discord.js');
const DB = require('st.db');
const db = new DB({ path: './Json-db/reactionDB.json' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('إضافة رول إلى نظام الرولات للمجتمع (guild)')
    .addRoleOption(opt => opt.setName('message').setDescription('اختر الرول').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('النص الظاهر على الزر (اختياري)'))
    .addStringOption(opt => opt.setName('message').setDescription('الإيموجي أو الأيقونة (مثال: 🎮)'))
    .addBooleanOption(opt => opt.setName('message').setDescription('هل تريد أن يضاف كرأكشن أيضاً؟').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({ content: '❌ تحتاج صلاحية Manage Roles لاستخدام هذا الأمر.', ephemeral: true });
    }

    const guildId = interaction.guildId;
    const role = interaction.options.getRole('role');
    const label = interaction.options.getString('label') || role.name;
    const emoji = interaction.options.getString('emoji') || null;
    const asReaction = interaction.options.getBoolean('asreaction') || false;

    const guildData = db.get(guildId) || { roles: [], message: null, channelId: null, type: 'buttons' };
    if (guildData.roles.find(r => r.roleId === role.id)) {
      return interaction.reply({ content: '⚠️ هذا الرول مضاف مسبقاً.', ephemeral: true });
    }

    guildData.roles.push({ roleId: role.id, label, emoji, asReaction });
    db.set(guildId, guildData);

    const client = interaction.client;
    try {
      const channel = await client.channels.fetch(guildData.channelId);
      const msg = await channel.messages.fetch(guildData.message);
      const { buildComponents } = require('../utils/buildComponents');
      const comps = buildComponents(guildData.roles, guildData.type);
      await msg.edit({ components: comps });
      if (asReaction && emoji) {
        await msg.react(emoji).catch(()=>{});
      }
    } catch (err) { console.error(err); }

    return interaction.reply({ content: `✅ تم إضافة الرول ${role.name}`, ephemeral: true });
  }
};
