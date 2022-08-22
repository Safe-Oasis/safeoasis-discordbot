/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

module.exports = async (bot) => {
    // inject slash command structure to old and new guilds
    bot.tools.discord.updateSlashCommands(bot, false);
    bot.tools.discord.startupGuildCheck(bot);

    bot.tools.twitter.setup(bot);

    let customs = await bot.db.queryAsync('customcommand', {});
    customs.map((cmd) => delete cmd._id);

    //Log all custom commands
    console.log(`Custom commands: %o`, customs);

    console.log('[BOT LOGGED IN] » no critical problems could be detected...');
};
