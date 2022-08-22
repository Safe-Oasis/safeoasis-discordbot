/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) safeoasis.xyz <contact@safeoasis.xyz>
 * Copyright (C) safeoasis.xyz team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const { TwitterApi, TweetStream, ETwitterApiError, ETwitterStreamEvent } = require('twitter-api-v2');
const axios = require('axios');

var twitterClient;

const handleTweet = async (tweet) => {
    const twitterUser = tweet.includes.users.filter((user) => user.id === tweet.data.author_id)[0];
    console.log(`Tweet from @${twitterUser.username}`);

    const embeds = [
        {
            content: `[New Tweet :eyes:](https://twitter.com/${twitterUser.id}/status/${tweet.data.id})`,
            username: `@${twitterUser.username}`,
            avatarURL: twitterUser.profile_image_url
        }
    ];

    let payload = JSON.stringify({ embeds });
    let channels = JSON.parse(process.env.TWEET_CHANNELS);

    channels.forEach((webhook) => {
        axios({
            method: 'POST',
            url: webhook,
            headers: { 'Content-Type': 'application/json' },
            data: payload
        });
    });
};

module.exports.setup = async (bot) => {
    let twitterToken = process.env.TWITTER_TOKEN;

    twitterClient = new TwitterApi(twitterToken);

    const stream = await twitterClient.v1.sampleStream();
    // Enable reconnect feature
    stream.autoReconnect = true;
    process.on('exit', () => stream.close());
    process.on('SIGKILL', () => stream.close());
    process.on('SIGTERM', () => stream.close());

    // Awaits for a tweet
    stream.on(ETwitterStreamEvent.ConnectionError, (err) => console.log('Connection error!', err));

    stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        ETwitterStreamEvent.ConnectionClosed,
        () => console.log('Connection has been closed.')
    );

    stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        handleTweet
    );
};
