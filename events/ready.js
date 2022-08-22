/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

module.exports = async (bot) => {
    try {
        // inject slash command structure to old and new guilds
        bot.tools.discord.updateSlashCommands(bot, false);
        bot.tools.discord.startupGuildCheck(bot);
    } catch (err) {}

    try {
        bot.tools.twitter.setup(bot);
    } catch (err) {}

    // update random status each x random minutes
    bot.tools.discord.updateStatus(bot);
    bot.tools.javascript.randomInterval(120000, 300000, () => bot.tools.discord.updateStatus(bot));

    if (process.env.DEBUG == true) {
        let customs = await bot.db.queryAsync('customcommand', {});
        customs.map((cmd) => delete cmd._id);

        //Log all custom commands
        console.log(`Custom commands: %o`, customs);
    }

    console.log('[BOT LOGGED IN] » no critical problems could be detected...');
};
