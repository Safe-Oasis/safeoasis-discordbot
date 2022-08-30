/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const Discord = moduleRequire('discord.js');
const { ChannelType } = Discord;

var commandLastPost = {};
var messageTriple = {};

module.exports = async (bot, message) => {
    // dont react to bots and dms
    if (message.author.bot) return;
    if (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GroupDM) return;
    // dont react to empty messages
    if (!message.content) return;

    // repeat last 3 messages id authors different and the text to lowercase is the same :D
    if (!messageTriple[message.channel.id] || messageTriple[message.channel.id].content.toLowerCase() != message.content.toLowerCase()) {
        messageTriple[message.channel.id] = { content: message.content, authors: [message.author.id] };
    }
    if (!messageTriple[message.channel.id].authors.includes(message.author.id)) messageTriple[message.channel.id].authors.push(message.author.id);
    if (messageTriple[message.channel.id].authors.length >= 3) {
        message.channel.send(message.content);
        messageTriple[message.channel.id] = { content: '', authors: [] };
    }

    // send prefix at just mention
    if (message.mentions.users) {
        let mentioned = message.mentions.users.first() == bot.user.id;
        if (mentioned) {
            message.reply({
                embeds: [
                    await bot.tools.discord.generateEmbed({
                        title: 'Slash Commands',
                        description: "If you want to use my commands please use discord's slash command feature.",
                        thumbnail: message.guild.iconURL()
                    })
                ]
            });
            return;
        }
    }

    var prefix = bot.configs.general.default_prefix;
    var prefixes = bot.configs.general.other_prefixes;

    // detect if an optional prefix was used
    for (let p of prefixes) {
        if (message.content.startsWith(p)) {
            prefix = p;
            break;
        }
    }

    // ignore messages without prefix at the beginning
    if (message.content.indexOf(prefix) !== 0) {
        if (message.guild.id !== bot.configs.general.guild_id) return;

        let user = message.author.id;
        let levelData = await client.db.queryAsync('levels', {
            user: user
        });
        if (!levelData[0]) {
            levelData = [
                {
                    user: user,
                    level: 0,
                    exp: 0,
                    needed: 100,
                    boost: 0,
                    lastUpdate: 0
                }
            ];
            await client.db.insertAsync('levels', levelData[0]);
        }
        levelData = levelData[0];
        delete levelData._id;
        delete levelData.user;

        if (Date.now() - levelData.lastUpdate > 60000 /* 1min */) {
            levelData.exp = levelData.exp + Math.floor(Math.random() * 11);
            levelData.lastUpdate = Date.now();
            bot.emit('debug', `Added Timeout ${message.author.username}`);

            if (levelData.exp >= levelData.needed) {
                levelData.level = levelData.level + 1;
                levelData.exp = 0;
                levelData.needed = levelData.needed + Math.floor(Math.random() * 100) + 100;

                // TODO: add roles and send message on level up
            }

            await client.db.updateAsync(
                'levels',
                {
                    user: user
                },
                levelData
            );
        }

        return;
    }

    // argument declaration
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // grab custom command
    let customC = await bot.db.queryAsync('customcommand', {
        name: command
    });

    if (customC.length > 0) {
        let reply = customC[0].reply;
        let deleteTrigger = customC[0].deleteTrigger;

        try {
            let jsonData = JSON.parse(reply);
            message.channel.send({ embeds: [await bot.tools.discord.generateEmbed(jsonData)] });
            // TODO: better convert methods
        } catch (error) {
            console.log(error);
            message.channel.send(reply);
        }

        if (deleteTrigger == true) {
            message.delete().catch(() => {});
        }

        return;
    }

    // grab command of the command nap
    var cmd = bot.commands.get(command);

    // check if a similar command is available
    if (!cmd) {
        try {
            // cmd = bot.commands.get(bot.tools.discord.getSimilarCommand(bot, command) || '');
            var similar = bot.tools.discord.getSimilarCommand(bot, command);
            if (similar != null && similar != '') {
                return message.reply({
                    embeds: [
                        await bot.tools.discord.generateEmbed({
                            title: 'Command Proposal',
                            thumbnail: message.guild.iconURL(),
                            description: `
Your command \`${command}\` was similar to \`${similar}\`
Did you mean
\`\`\`
${prefix}${similar} ${args.join(' ')}
\`\`\`
                        `
                        })
                    ]
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // do nothing if command doesn't exist
    if (!cmd) return;

    // anti commandspam
    var ts = Date.now();
    if (commandLastPost[message.author.id] != null) {
        if (ts - commandLastPost[message.author.id] < 3000) {
            if (!message.member.permissions.has('ManageMessages')) return message.reply(':x: Please do not spam commands! :x:');
        }
    }
    commandLastPost[message.author.id] = ts;

    // finally run the command
    try {
        var commandResult = await cmd.run(bot, message, command, args, prefix);
        // TODO: better error handling
        // if (commandResult) message.react('✅').catch((err) => {});
        // else message.react(':x:').catch((err) => {});
    } catch (error) {
        message.react(':x:').catch((err) => {});
    }
};
