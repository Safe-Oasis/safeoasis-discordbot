/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

const { PermissionFlagsBits, ChannelType } = moduleRequire('discord.js');

// event when the botsession gets invalid
module.exports = async (bot, oldState, newState) => {
    if (oldState?.guild?.id == null || oldState?.guild?.id != bot.configs.general.guild_id) return;
    let selfMember = await oldState.guild.members.fetch(bot.user.id);
    if (!selfMember.permissions.has('MANAGE_CHANNELS')) return;

    // var lobby = bot.configs.general.channels.tempvoice_lobby;
    // var category = bot.configs.general.channels.tempvoice_category;

    // if (bot.configs.general.channels.tempvoice_ignore.includes(oldState?.channel?.id)) return;
    // if (bot.configs.general.channels.tempvoice_ignore.includes(newState?.channel?.id)) return;

    // if (newState.channel && newState.channel.parent) {
    //     if (newState.channel.id != lobby) return;
    //     if (newState.channel.parent.id != category) return;

    //     let channel = await newState.member.guild.channels.create({
    //         name: newState.member.displayName,
    //         reason: 'new tempvoice channels',
    //         type: ChannelType.GuildVoice,
    //         permissionOverwrites: [
    //             {
    //                 id: newState.member.id,
    //                 allow: [PermissionFlagsBits.ManageChannels]
    //             }
    //         ]
    //     });

    //     channel.setParent(category);
    //     channel.setUserLimit(6);
    //     newState.member.voice.setChannel(channel);
    //     bot.db.insertAsync('temp_voice', { channel: channel.id, owner: newState.member.id, updates: 0 });
    //     return;
    // }
    // if (oldState.channel.parent.id != category) return;
    // bot.channels.cache.get(category).children.cache.forEach((channel) => {
    //     if (bot.configs.channels.tempvoice_ignore.includes(channel?.id)) return;
    //     if (channel.type == ChannelType.GuildVoice) {
    //         if (channel.id != lobby) {
    //             if (channel.members.size < 1) {
    //                 channel.delete('making room for new tempvoice channels');
    //                 bot.db.deleteAsync('temp_voice', { channel: channel.id });
    //             }
    //         }
    //     }
    // });
};
