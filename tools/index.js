/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const jsTools = require('./javascript');
const dcTools = require('./discord');
const twTools = require('./twitter');

module.exports = {
    discord: dcTools,
    js: jsTools,
    javascript: jsTools,
    twitter: twTools
};
