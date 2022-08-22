/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

// append process.env object by some system variables ( ./.env )
require('dotenv').config();

// imports
const fs = require('node:fs');
const path = require('node:path');
const enmap = require('enmap');

const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');

const cachePath = process.cwd() + '/cache.json';
if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, JSON.stringify({ verifyUsers: {} }));
}

// create the Discord Client
const bot = new Client({
    intents: 3276799,
    restRequestTimeout: 10000
});

// enable module caching by adding a new global require function
bot.modules = {};
global.moduleRequire = (mod) => {
    if (bot.modules[mod]) return bot.modules[mod];
    bot.modules[mod] = require(mod);
    return bot.modules[mod];
};

// Declare new main Bot Variables
bot.configs = {};
bot.commands = new enmap();
bot.interactions = new enmap();
bot.slash_commands = new enmap();

// init mongodb handle
require('./modules/database').setupDatabaseHandler(bot);
// require tools
bot.tools = moduleRequire('./tools');

// require configs
fs.readdir('./configs/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.json')) return;
            if (file.startsWith('_')) return;
            const config = require(`./configs/${file}`);
            let configName = file.split('.')[0];
            bot.configs[configName] = config;
            console.log(`[CONFIG LOADED] » configs.${configName}...`);
        } catch (error) {
            console.error(error);
        }
    });
});

// load bot events
fs.readdir('./events/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            const event = require(`./events/${file}`);
            let eventName = file.split('.')[0];
            console.log(`[BOT EVENT LOADED] » events.${eventName}...`);
            bot.on(eventName, event.bind(null, bot));
        } catch (error) {
            console.error(error);
        }
    });
});

bot.aliases = [];
bot.commandKeys = [];
// load commands
fs.readdir('./commands/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./commands/${file}`);
            if (props.active == true) {
                let commandName = file.split('.')[0];
                props.isCommand = true;
                bot.commands.set(commandName, props);
                if (props.similarityCheck == true) bot.commandKeys.push(commandName);
                if (props.aliases != null) {
                    for (let alias of props.aliases) {
                        if (!bot.aliases.includes(alias)) {
                            props.isCommand = false;
                            if (props.similarityCheck == true) bot.commandKeys.push(alias);
                            bot.aliases.push(alias);
                            bot.commands.set(alias, props);
                        } else {
                            console.log('Could not add alias ' + alias + ' for command ' + commandName);
                        }
                    }
                }
                console.log(
                    `[COMMAND LOADED] >> ${commandName}... ${props.aliases != null && props.aliases.length > 0 ? 'Aliases: ' + props.aliases.join(', ') : 'Aliases: none'}`
                );
            }
        } catch (error) {
            bot.error(error);
        }
    });
});

// load interaction commands
fs.readdir('./interactions/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./interactions/${file}`);
            if (props.active == true) {
                let commandName = file.split('.')[0];
                bot.interactions.set(commandName, props);
                console.log(`[INTERACTION COMMAND LOADED] >> interactions.${commandName}`);
            }
        } catch (error) {
            console.error(error);
        }
    });
});

// load interaction commands
fs.readdir('./slash_commands/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./slash_commands/${file}`);
            if (props.active == true) {
                let commandName = file.split('.')[0];
                bot.slash_commands.set(commandName, props);
                console.log(`[SLASH COMMAND LOADED] >> slash_commands.${commandName}`);
            }
        } catch (error) {
            console.error(error);
        }
    });
});

// handler/client for slash commands things
bot.restClient = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// finally login bot
bot.login(process.env.BOT_TOKEN);
