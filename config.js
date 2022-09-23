require('dotenv').config();

const env = {
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spotifyAccessToken: process.env.SPOTIFY_ACCESS_TOKEN,
    homeDir: process.env.HOME
}

const spotify = {
    redirectUri: 'http://localhost:8888/callback',
    login: 'http://localhost:8888/login',
    scopes: ['playlist-modify-public']
}

const config = { env, spotify };

module.exports = config;