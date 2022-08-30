/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const { SlashCommandBuilder } = require('@discordjs/builders');

const commandChannel = process.env.TMP_VOICE_CHANNEL_COMMAND;

module.exports.run = async (bot, interaction) => {
    const Discord = moduleRequire('discord.js');

    try {
        var member = interaction.member;
        if (member.partial) member = await member.fetch({ cache: true });

        if (!interaction.channel.id === commandChannel && !interaction.member.permissions.has('ManageChannels')) {
            return interaction.reply({ content: `This is not the command channel please use <#${commandChannel}>`, ephemeral: true });
        }

        var currentChannel = member.voice?.channel;

        if (!currentChannel) {
            return interaction.reply({ content: 'You are not in a temp voice channel', ephemeral: true });
        }

        var channelObject = await bot.db.queryAsync('temp_voice', { channel: currentChannel.id }).catch((err) => {});

        if (!channelObject && channelObject.length < 1) return interaction.reply({ content: 'This is not a temp voice channel.', ephemeral: true });

        channelObject = channelObject[0];

        if (!member.permissions.has('ManageChannels') && !bot.fullAccess.includes(message.author.id) && member.id != channelObject.owner) {
            return interaction.reply({ content: 'You dont have the permission to edit this channel.', ephemeral: true });
        }

        var subCommand = interaction.options.getSubcommand(true);

        switch (subCommand) {
            case 'name': {
                var updates = 0;
                if (channelObject?.updates != null) updates = 0 + channelObject.updates;
                if (updates >= 1) {
                    return interaction.reply({ content: 'The name can only be changed once.', ephemeral: true });
                }
                var name = interaction.options.getString('name');
                if (!name || name == '') {
                    return interaction.reply({ content: 'Could not validate channel as a temp voice channel.', ephemeral: true });
                }
                await bot.db.updateAsync('temp_voice', { channel: currentChannel.id }, { updates: updates + 1 });
                await currentChannel.edit({
                    name: name.slice(0, 20)
                });
                return interaction.reply({ content: 'Channel name set to `' + name.slice(0, 20) + '`.', ephemeral: true });
            }

            case 'ban': {
                var toBan = interaction.options.getMember('target');
                if (!toBan || toBan.permissions.has('ManageMessages')) return interaction.reply({ content: 'You cant remove this user.', ephemeral: true });
                if (toBan.voice?.channel != null) {
                    toBan.voice?.disconnect('Was banned from channel!');
                }
                await currentChannel.permissionOverwrites.edit(toBan.id, {
                    CONNECT: false
                });
                return interaction.reply({ content: 'The user was banned.', ephemeral: true });
            }

            case 'limit': {
                var limit = interaction.options.getNumber('limit');
                if (!limit || limit < 2 || limit > 99) {
                    limit = 6;
                }
                await currentChannel.edit({
                    userLimit: limit
                });
                return interaction.reply({ content: 'The size of your channel was set to `' + limit + '` users.', ephemeral: true });
            }

            case 'lock': {
                await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                    CONNECT: false
                });
                return interaction.reply({ content: 'The channel was locked.', ephemeral: true });
            }

            case 'unlock': {
                await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                    CONNECT: true
                });
                return interaction.reply({ content: 'The channel was unlocked.', ephemeral: true });
            }

            default:
                interaction.reply({ content: 'Invalid Subcommand', ephemeral: true });
                return;
        }
    } catch (error) {
        bot.error('Error in Slash Command VC', error);
    }
};

module.exports.data = (bot, language) => {
    var slashCommandData = new SlashCommandBuilder()
        .setName('vc')
        .setDescription('With this command you can edit your temp voice channel!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('ban')
                .setDescription('Ban a user from your channel!')
                .addUserOption((option) => option.setName('target').setDescription('@user mention - the user you want to remove from your channel').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('name')
                .setDescription('With this command you can change the name of your channel.')
                .addStringOption((option) => option.setName('name').setDescription('New name of your channel').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('limit')
                .setDescription('With this command you can change your channel limit.!')
                .addNumberOption((option) => option.setName('limit').setDescription('Count of free slots ( 2-99 )').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('lock').setDescription('With this command you can lock your channel!'))
        .addSubcommand((subcommand) => subcommand.setName('unlock').setDescription('With this command you can unlock your channel!'));
    return slashCommandData.toJSON();
};

module.exports.active = true;
