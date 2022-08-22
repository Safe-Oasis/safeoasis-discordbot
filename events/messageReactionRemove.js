/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

module.exports = async (bot, reaction, user) => {
    if (user.bot) return;

    function equals(idShouldBe, idIs) {
        return idShouldBe == idIs;
    }

    let idIs = reaction.message.id;

    // if (!equals("...", idIs)) return;

    function addRole(role, member) {
        reaction.message.guild.roles
            .fetch(role)
            .then((r) => {
                let m = reaction.message.guild.members.cache.get(member);
                m.roles.add(r);
            })
            .catch(console.error);
    }

    function removeRole(role, member) {
        reaction.message.guild.roles
            .fetch(role)
            .then((r) => {
                let m = reaction.message.guild.members.cache.get(member);
                m.roles.remove(r);
            })
            .catch(console.error);
    }

    function addRoleAndRemoveOther(role, member, otherRoles) {
        for (let role of otherRoles) {
            removeRole(role, member);
        }
        addRole(role, member);
    }
};
