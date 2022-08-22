/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const Discord = moduleRequire('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = async (bot, interaction) => {
    try {
    } catch (error) {
        console.error('Error in Slash Command CommandName', error);
    }
};

module.exports.active = true;

module.exports.data = (bot) => {
    var slashCommandData = new SlashCommandBuilder().setName('commandName').setDescription('command description');
    return slashCommandData.toJSON();
};
