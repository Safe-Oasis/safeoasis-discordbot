/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const Discord = moduleRequire('discord.js');

module.exports.run = async (bot, message, label, args, prefix) => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            console.error('Error in CMD Command.', error);
            return resolve(false);
        }
        return resolve(true);
    });
};

module.exports.active = false;
module.exports.similarityCheck = false;
module.exports.aliases = [];
