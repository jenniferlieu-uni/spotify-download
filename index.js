#!/usr/bin/env node

const yargs = require('yargs');
const yt = require("yt-converter");
const SpotifyWebApi = require('spotify-web-api-node');
const fetch = require('node-fetch');
const HOME_DIR = require('os').homedir();
const myConfig = require('./config');

// declare golabl variables
let playlistId;
let fileDestination;
let spotifyApi = new SpotifyWebApi();

// parse command line arguments
const argv = yargs
    .usage('$0 <playlistId>', 'Downloads songs as an mp3 file from a Spotify playlist.\nIf no download folder is specified, the mp3 file download to the user\'s Downloads folder', (yargs) => {
        yargs.positional('playlistId', {
            describe: 'The Spotify playlist url or id',
            demandOption: true,
            type: 'string'
        })
    })
    .option('d', {
        alias: 'destination',
        describe: 'The path of the folder that you want the mp3 file to be downloaded into',
        type: 'string',
        default: `${HOME_DIR}/Downloads`
    })
    .argv;

// parse the playlist id
playlistId = parsePlaylistId(argv.playlistId);
fileDestination = argv.d;

// get spotify playlist tracks
spotifyApi.setAccessToken(myConfig.env.spotifyAccessToken);

spotifyApi.getPlaylistTracks(playlistId).then(
    async function (data) {
        // console.log(data.body.items);
        let title = data.body.items[0].track.name;
        let artist = data.body.items[0].track.artists[0].name;
        let youtubeURL = await searchMp3(`${title} ${artist}`);
        let mp3File = `${fileDestination}/${artist} - ${title}.mp3`;
        console.log(`Downloading \"${title}\" by ${artist} (${youtubeURL}) to ${fileDestination}`);

        // download youtube video as mp3 file
        yt.convertAudio({
            url: youtubeURL,
            itag: 140, // mp3 format
            directoryDownload: fileDestination,
            title: `${artist} - ${title}`
        },
        () => {
            // this callback function is called every time the process is executed (used as a percentage function) until the conversion is complete
            console.log('-');
        }, 
        () => {
            // this callback function is called when conversion is complete
            console.log('Finished!');
        });
    },
    function (error) {
        console.error(error);
    }
);

// ------------------- end program ------------------

// -------------------- functions -------------------
function parsePlaylistId(playlistId) {
    if (playlistId.includes('spotify.com')) {
        let array = playlistId.split('/');
        return array[array.length - 1];
    } else {
        return playlistId
    }
}


async function searchMp3(searchQuery) {
    if (!myConfig.env.youtubeApiKey) {
        throw new Error('No Youtube API key provided');
    }

    // search for the song on youtube
    const searchURL = `https://www.googleapis.com/youtube/v3/search?key=${myConfig.env.youtubeApiKey}&type=video&part=snippet&q=${searchQuery}`;
    const response = await fetch(searchURL);
    const data = await response.json();
    const videoID = data.items[0].id.videoId;

    // get youtube video url
    const youtubeURL = `https://www.youtube.com/watch?v=${videoID}`;
    // console.log(`[In Search Mp3] ${searchQuery} - ${youtubeURL}`);

    return youtubeURL;
}