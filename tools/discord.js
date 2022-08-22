/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const similarity = moduleRequire('string-similarity');
const Discord = moduleRequire('discord.js');
const { EmbedBuilder } = Discord;
const isDomain = moduleRequire('is-valid-domain');
const { Routes } = moduleRequire('discord-api-types/v10');

module.exports = () => null;

// set a new bot status ( let the bot pick a random string of an array )
module.exports.setStatus = async (botInstance, activities_list) => {
    var index = Math.floor(Math.random() * activities_list.length);
    if (index < 0) index = 0;
    if (index >= activities_list.length) index = activities_list.length - 1;
    var txt = activities_list[index][0];
    var amount = 0;
    if (activities_list[index][1] != 'STREAMING') {
        botInstance.user.setActivity(txt, {
            type: activities_list[index][1] || 'PLAYING'
        });
    } else {
        botInstance.user.setActivity(txt, {
            type: 'STREAMING',
            url: activities_list[index][2] || 'https://google.com'
        });
    }
};

// set a new bot Status
module.exports.setBotStatus = async (botInstance, status, type) => {
    botInstance.user.setActivity(status || 'Leerer Status gesetzt', {
        type: type || 'PLAYING'
    });
};

// updateStatus is actually called each 2 min. in ready.js
module.exports.updateStatus = async (botInstance) => {
    botInstance.tools.discord.setStatus(botInstance, botInstance.configs.status);
};

module.exports.generateEmbed = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            let embed = new EmbedBuilder();
            if (data.timestamp) embed.setTimestamp(data.timestamp);
            else if (data.timestamp != false) embed.setTimestamp();
            if (data.title) embed.setTitle(data.title);
            if (data.description) embed.setDescription(data.description);
            if (data.color) embed.setColor(data.color);
            else embed.setColor(process.env.ACCENT_COLOR);
            if (data.author) {
                if (typeof data.author == 'object') {
                    embed.setAuthor({
                        name: data.author.text || data.author.name,
                        iconURL: data.author.image || data.author.image_url || data.author.icon_url,
                        url: data.author.url
                    });
                } else {
                    embed.setAuthor({
                        name: data.author
                    });
                }
            }
            if (data.thumbnail) {
                if (typeof data.thumbnail == 'object') {
                    embed.setThumbnail(data.thumbnail.url || data.thumbnail.image_url || data.thumbnail.image);
                } else {
                    embed.setThumbnail(data.thumbnail);
                }
            }
            if (data.image) {
                if (typeof data.image == 'object') {
                    embed.setImage(data.image.image || data.image.image_url || data.image.url);
                } else {
                    embed.setImage(data.image);
                }
            }
            if (data.footer) {
                if (typeof data.footer == 'object') {
                    embed.setFooter({
                        text: data.footer.text || data.footer.name,
                        iconURL: data.footer.image || data.footer.image_url || data.footer.icon_url
                    });
                } else {
                    embed.setFooter({
                        text: data.footer
                    });
                }
            } else
                embed.setFooter({
                    text: process.env.BOT_NAME
                });
            if (data.fields) {
                for (let field of data.fields) {
                    if (field.name != '' && field.value != '') {
                        embed.addField(field.name, field.value, field.inline);
                    }
                }
            }
            if (data.url) embed.setURL(data.url);
            return resolve(embed);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.isMemberPremium = (member) => {
    return member.premiumSince != null;
};

module.exports.emojis = {
    // emoji export ( reactions/whatever )
    ZERO: '0️⃣',
    ONE: '1️⃣',
    TWO: '2️⃣',
    THREE: '3️⃣',
    FOUR: '4️⃣',
    FIVE: '5️⃣',
    SIX: '6️⃣',
    SEVEN: '7️⃣',
    EIGHT: '8️⃣',
    NINE: '9️⃣',
    TEN: '🔟',
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    10: '🔟',
    OK: '✅',
    A: ':regional_indicator_a:',
    B: ':regional_indicator_b:',
    C: ':regional_indicator_c:',
    D: ':regional_indicator_d:',
    E: ':regional_indicator_e:',
    F: ':regional_indicator_f:',
    G: ':regional_indicator_g:',
    H: ':regional_indicator_h:',
    I: ':regional_indicator_i:',
    J: ':regional_indicator_j:',
    K: ':regional_indicator_k:',
    L: ':regional_indicator_l:',
    M: ':regional_indicator_m:',
    N: ':regional_indicator_n:',
    O: ':regional_indicator_o:',
    P: ':regional_indicator_p:',
    Q: ':regional_indicator_q:',
    R: ':regional_indicator_r:',
    S: ':regional_indicator_s:',
    T: ':regional_indicator_t:',
    U: ':regional_indicator_u:',
    V: ':regional_indicator_v:',
    W: ':regional_indicator_w:',
    X: ':regional_indicator_x:',
    Y: ':regional_indicator_y:',
    Z: ':regional_indicator_z:',
    Ä: ':regional_indicator_a::regional_indicator_e:',
    Ö: ':regional_indicator_o::regional_indicator_e:',
    Ü: ':regional_indicator_u::regional_indicator_e:',
    SS: ':regional_indicator_s::regional_indicator_s:',
    '!': ':grey_exclamation:',
    '?': ':grey_question:'
};

module.exports.updateSlashCommands = async (bot, guildRefresh) => {
    var slashCommands = [];

    if (!guildRefresh) {
        try {
            console.log('Started refreshing application (/) commands.');
            var guildObjects = await bot.db.queryAsync('guilds', {});
            guildObjects.forEach(async (guildObject) => {
                for (let slash_command of bot.slash_commands.array()) {
                    slashCommands.push(slash_command.data(bot, guildObject.language));
                }
                await bot.restClient.put(Routes.applicationGuildCommands(bot.user.id, guildObject.id), { body: slashCommands }).catch(console.error);
            });
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    } else {
        bot.db.queryAsync('guilds', { id: guildRefresh.id }).then(async (guildObject) => {
            if (!guildObject || guildObject.length < 1) {
                guildObject = [
                    {
                        id: guildRefresh.id,
                        language: 'de_de'
                    }
                ];
            }
            for (let slash_command of bot.slash_commands.array()) {
                slashCommands.push(slash_command.data(bot, guildObject[0].language));
            }
            await bot.restClient.put(Routes.applicationGuildCommands(bot.user.id, guildRefresh.id), { body: slashCommands }).catch(console.error);
            console.log('Successfully reloaded application (/) commands. GUILD: ' + guildRefresh.id);
        });
    }
};

module.exports.startupGuildCheck = async (bot) => {
    bot.guilds.cache.each(async (guild) => {
        var guildData = await bot.db.queryAsync('guilds', { id: guild.id });
        if (!guildData || guildData.length <= 0) {
            await bot.db.insertAsync('guilds', { id: guild.id, language: 'de_de' });
            bot.tools.discord.updateSlashCommands(bot, guild);
        }
    });
};
