const { SlashCommandBuilder } = require('discord.js');
const DB = require('st.db');
const db = new DB({ path: './Json-db/reactionDB.json' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editrole')
    .setDescription('تعديل رول موجود في نظام الرولات')
    .addRoleOption(opt => opt.setName('message').setDescription('اختر الرول').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('النص الظاهر على الزر (اختياري)'))
    .addStringOption(opt => opt.setName('message').setDescription('الإيموجي أو الأيقونة (مثال: 🎮)'))
    .addBooleanOption(opt => opt.setName('message').setDescription('اجعله رياكشن؟')), 
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({ content: '❌ تحتاج صلاحية Manage Roles لاستخدام هذا الأمر.', ephemeral: true });
    }

    const guildId = interaction.guildId;
    const role = interaction.options.getRole('role');
    const label = interaction.options.getString('label');
    const emoji = interaction.options.getString('emoji');
    const asReaction = interaction.options.getBoolean('asreaction');

    const guildData = db.get(guildId);
    if (!guildData) return interaction.reply({ content: '❌ لم يتم ضبط رسالة الرولات بعد. استخدم /setup', ephemeral: true });

    const r = guildData.roles.find(x => x.roleId === role.id);
    if (!r) return interaction.reply({ content: '❌ هذا الرول غير موجود في النظام.', ephemeral: true });

    if (label) r.label = label;
    if (emoji !== null) r.emoji = emoji;
    if (typeof asReaction === 'boolean') r.asReaction = asReaction;
    db.set(guildId, guildData);

    const client = interaction.client;
    try {
      const channel = await client.channels.fetch(guildData.channelId);
      const msg = await channel.messages.fetch(guildData.message);
      const { buildComponents } = require('../utils/buildComponents');
      const comps = buildComponents(guildData.roles, guildData.type);
      await msg.edit({ components: comps });
    } catch (err) { console.error(err); }

    return interaction.reply({ content: `✅ تم تحديث إعدادات الرول ${role.name}`, ephemeral: true });
  }
};
