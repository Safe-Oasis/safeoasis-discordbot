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
            if (!message.member.permissions.has('Administrator')) return;

            const usage = () => {
                message.reply(`Use: \`${prefix}${label}¸ <add/delete/list> <add:[trigger | reply | deleteTrigger] / remove:[trigger]>\``);
                resolve(false);
            };

            if (!args || args.length < 1) return usage();

            let subCommand = args.shift();
            let content = args.join(' ');

            let customs = await bot.db.queryAsync('customcommand', {});
            customs.map((cmd) => delete cmd._id);

            switch (subCommand.toLowerCase()) {
                case 'add': {
                    if (args.length < 2) return usage();
                    const addArgs = content.split('|');
                    if (addArgs.length < 2) return usage();
                    const trigger = addArgs[0].trim();

                    let exists = customs.filter((custom) => custom.name === trigger);

                    if (exists.length > 0) {
                        message.reply({
                            embeds: [
                                await bot.tools.discord.generateEmbed({
                                    title: 'Custom Command Error',
                                    description: `
This custom command does already exist.
Delete it with:
\`${prefix}${label} delete ${trigger}\`
                            `,
                                    thumbnail: message.guild.iconURL()
                                })
                            ]
                        });
                        return resolve(false);
                    }

                    const reply = addArgs[1].trim();
                    var deleteTrigger = false;
                    if (addArgs[2] && addArgs[2].trim() == 'true') deleteTrigger = true;

                    const commandData = {
                        name: trigger,
                        reply,
                        deleteTrigger
                    };

                    await bot.db.insertAsync('customcommand', commandData);

                    message.reply({
                        embeds: [
                            await bot.tools.discord.generateEmbed({
                                title: 'Custom Command Created',
                                description: `
Created custom command: \`${trigger}\`
With reply:
\`\`\`
${reply}
\`\`\`

On reply the trigger gets ${deleteTrigger ? 'deleted.' : 'not deleted.'}
                            `,
                                thumbnail: message.guild.iconURL()
                            })
                        ]
                    });
                    return resolve(true);
                }
                case 'delete': {
                    if (args.length < 1) return usage();
                    const trigger = args[0].trim();
                    let exists = customs.filter((custom) => custom.name === trigger);

                    if (exists.length <= 0) {
                        message.reply({
                            embeds: [
                                await bot.tools.discord.generateEmbed({
                                    title: 'Custom Command Error',
                                    description: `
This custom command does not exist.
                            `,
                                    thumbnail: message.guild.iconURL()
                                })
                            ]
                        });
                        return resolve(false);
                    }

                    await bot.db.deleteAsync('customcommand', { name: trigger });

                    message.reply({
                        embeds: [
                            await bot.tools.discord.generateEmbed({
                                title: 'Custom Command Deleted',
                                description: `
Custom command with the name \¸${trigger}\¸ was deleted.
                            `,
                                thumbnail: message.guild.iconURL()
                            })
                        ]
                    });
                    return resolve(true);
                }
                case 'list': {
                    message.reply({
                        embeds: [
                            await bot.tools.discord.generateEmbed({
                                title: 'Custom Command List',
                                description: `
Custom Commands:
\`\`\`json
${JSON.stringify(customs, null, 4)}
\`\`\`
                    `,
                                thumbnail: message.guild.iconURL()
                            })
                        ]
                    });
                    return resolve(true);
                }
                default:
                    return usage();
            }
        } catch (error) {
            console.error('Error in CMD Command.', error);
            return resolve(false);
        }
    });
};

module.exports.active = true;
module.exports.similarityCheck = true;
module.exports.aliases = ['cc'];
