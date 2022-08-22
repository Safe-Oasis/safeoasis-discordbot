/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

module.exports = async (bot, interaction) => {
    if (interaction.isCommand()) {
        var command = bot.slash_commands.get(interaction.commandName);
        if (!command) return;
        try {
            command.run(bot, interaction);
        } catch (err) {
            console.error('Unhandled Error in SlashCommand', err);
        }
        return;
    } else {
        if (!interaction.customId) return;
        var command = bot.interactions.get(interaction.customId);
        if (!command) return;
        try {
            command.run(bot, interaction);
        } catch (err) {
            console.error('Unhandled Error in Interaction with CustomID', err);
        }
    }
};
