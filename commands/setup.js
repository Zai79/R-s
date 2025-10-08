const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const DB = require('st.db');
const db = new DB({ path: './Json-db/reactionDB.json' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('إنشاء رسالة رولات تفاعلية في القناة الحالية')
    .addStringOption(opt => opt.setName('message').setDescription('نص الرسالة التي ستعرض فوق الأزرار').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('اختر النظام: buttons أو reactions أو both').setRequired(true)
      .addChoices(
        { name: 'buttons', value: 'buttons' },
        { name: 'reactions', value: 'reactions' },
        { name: 'both', value: 'both' }
      )),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({ content: '❌ تحتاج صلاحية Manage Roles لاستخدام هذا الأمر.', ephemeral: true });
    }

    const guildId = interaction.guildId;
    const messageText = interaction.options.getString('message');
    const type = interaction.options.getString('type');

    const guildData = db.get(guildId) || { roles: [], message: null, channelId: null, type: 'buttons' };

    const row = new ActionRowBuilder();
    row.addComponents(new ButtonBuilder().setCustomId('rr_placeholder').setLabel('لا يوجد رولات بعد').setStyle(ButtonStyle.Secondary).setDisabled(true));

    const sent = await interaction.channel.send({ content: messageText, components: [row] });
    guildData.message = sent.id;
    guildData.channelId = sent.channelId;
    guildData.type = type;
    db.set(guildId, guildData);

    return interaction.reply({ content: '✅ تم إنشاء رسالة الرولات. استخدم /addrole لإضافة رولات.', ephemeral: true });
  }
};
