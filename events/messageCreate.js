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
            let embed = await bot.tools.discord.generateEmbed({
                title: 'Slash Commands',
                description: "If you want to use my commands please use discord's slash command feature."
            });
            message.reply({ embeds: [embed] });
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
    if (message.content.indexOf(prefix) !== 0) return;

    // argument declaration
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // grab custom command
    let customC = await bot.db.queryAsync('customcommand', {
        name: command
    });

    if (customC.length > 0) {
        let reply = customC[0].reply;
        message.channel.send(reply);
        return;
    }
};
