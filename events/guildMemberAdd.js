/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

module.exports = async (bot, member) => {
    if (member.guild.id != bot.configs.general.guild_id) return;
    try {
        if (member.partial) member = await member.fetch();
    } catch (error) {
        bot.catch(error);
    }
};
