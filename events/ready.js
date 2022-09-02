/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const { ReactionRole } = require('discordjs-reaction-role');

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

    bot.channels
        .fetch('997946074255855706')
        .then((channel) => {
            channel.messages.fetch();
        })
        .catch((err) => {});

    new ReactionRole(bot, [
        {
            messageId: '1001120370264379402',
            reaction: '996496255402397696',
            roleId: '998181157734731806'
        }, // Basic usage
        {
            messageId: '1001120370264379402',
            reaction: '996496275371462767',
            roleId: '998181078403645550'
        }, // Multiple reactions per message!
        {
            messageId: '1001120370264379402',
            reaction: '996496265527439440',
            roleId: '998181056601669672'
        }, // Multiple reactions per message!
        {
            messageId: '1001120370264379402',
            reaction: '996496243201150976',
            roleId: '998181213225365524'
        }, // Multiple reactions per message!
        {
            messageId: '1001120370264379402',
            reaction: '996496267779768451',
            roleId: '1000808891812151297'
        }, // Multiple reactions per message!
        {
            messageId: '1001120370264379402',
            reaction: '999649683762843699',
            roleId: '1001131995209945118'
        }, // Multiple reactions per message!

        //GENDER
        {
            messageId: '1001968636547834057',
            reaction: '1001831675346550984',
            roleId: '996920743562575892'
        },
        {
            messageId: '1001968636547834057',
            reaction: '1001833272965341225',
            roleId: '996864683371921408'
        },
        {
            messageId: '1001968636547834057',
            reaction: '1001833344859910205',
            roleId: '1001833906099716167'
        },
        {
            messageId: '1001968636547834057',
            reaction: '1001833419690496132',
            roleId: '1001833951184302210'
        },
        {
            messageId: '1001968636547834057',
            reaction: '❓',
            roleId: '1001834029605204048'
        },

        //PRNS
        {
            messageId: '1001970901702684773',
            reaction: '1001831675346550984',
            roleId: '996863732485460061'
        },
        {
            messageId: '1001970901702684773',
            reaction: '1001833272965341225',
            roleId: '996863713405579274'
        },
        {
            messageId: '1001970901702684773',
            reaction: '1001833344859910205',
            roleId: '998326578524192768'
        },
        {
            messageId: '1001970901702684773',
            reaction: '❓',
            roleId: '1001834085355888661'
        },

        //Sexuality

        {
            messageId: '1002913354962182305',
            reaction: '1001834025352179722',
            roleId: '996864651457466409'
        },
        {
            messageId: '1002913354962182305',
            reaction: '1001834131304489061',
            roleId: '996919680205848676'
        },
        {
            messageId: '1002913354962182305',
            reaction: '1001834251551002625',
            roleId: '1001834129299619871'
        },
        {
            messageId: '1002913354962182305',
            reaction: '1001834398951424030',
            roleId: '1001834169627848724'
        },
        {
            messageId: '1002913354962182305',
            reaction: '❓',
            roleId: '1001834199222853684'
        },

        //Romantic

        {
            messageId: '1002913757493731328',
            reaction: '1001834025352179722',
            roleId: '1001834280944672768'
        },
        {
            messageId: '1002913757493731328',
            reaction: '1001834131304489061',
            roleId: '1001834332861780020'
        },
        {
            messageId: '1002913757493731328',
            reaction: '1001834251551002625',
            roleId: '1001834364423917569'
        },
        {
            messageId: '1002913757493731328',
            reaction: '1001834398951424030',
            roleId: '1001834426956791820'
        },
        {
            messageId: '1002913757493731328',
            reaction: '❓',
            roleId: '1001834470996979792'
        },

        //Summer 2022
        {
            messageId: '999408493641613312',
            reaction: '☀️',
            roleId: '999404532196982847'
        }
    ]);

    console.log('[BOT LOGGED IN] » no critical problems could be detected...');
};
