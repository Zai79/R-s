const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

function buildComponents(roles, type='buttons') {
  const rows = [];
  let currentRow = new ActionRowBuilder();
  let count = 0;
  for (const r of roles) {
    if (type === 'reactions') break;
    const btn = new ButtonBuilder()
      .setCustomId('rr_' + r.roleId)
      .setLabel(r.label || 'role')
      .setStyle(ButtonStyle.Primary);
    if (r.emoji) {
      try { btn.setEmoji(r.emoji); } catch (e) { /* ignore invalid emoji */ }
    }
    currentRow.addComponents(btn);
    count++;
    if (count === 5) {
      rows.push(currentRow);
      currentRow = new ActionRowBuilder();
      count = 0;
    }
  }
  if (count > 0) rows.push(currentRow);

  if ((type === 'both' || type === 'reactions') && roles.length > 0) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('rr_select_menu')
      .setPlaceholder('اختر رول...')
      .setMinValues(1)
      .setMaxValues(roles.length);

    const options = roles.map(r => ({
      label: r.label || 'role',
      value: r.roleId,
      emoji: r.emoji || undefined
    }));
    menu.addOptions(options);
    rows.push(new ActionRowBuilder().addComponents(menu));
  }

  return rows;
}

module.exports = { buildComponents };
