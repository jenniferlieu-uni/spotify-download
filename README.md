# Spotify Download

## Table of Contents
- [Spotify Download](#spotify-download)
  - [Table of Contents](#table-of-contents)
  - [What it does](#what-it-does)
  - [Usage](#usage)
    - [Example: Downloading playlist with URL](#example-downloading-playlist-with-url)
    - [Example: Downloading playlist with the playlist ID](#example-downloading-playlist-with-the-playlist-id)
    - [Example: Choosing a different download folder](#example-choosing-a-different-download-folder)
  - [Installation](#installation)
  - [Contribution](#contribution)
    - [How to contribute](#how-to-contribute)
    - [End goal for the user](#end-goal-for-the-user)
    - [TODO: Change project name](#todo-change-project-name)
    - [TODO: "Automically" connect to the Spotify API](#todo-automically-connect-to-the-spotify-api)
    - [TODO: Find "worthy" youtube videos](#todo-find-worthy-youtube-videos)
    - [TODO: Download all songs on the playlist](#todo-download-all-songs-on-the-playlist)
    - [TODO: Add metadata to mp3 file](#todo-add-metadata-to-mp3-file)
    - [TODO: Add lyrics from Musixmatch](#todo-add-lyrics-from-musixmatch)
    - [Extra Features](#extra-features)

## What it does
Spotify Download is a node.js command line app that downloads an entire Spotify playlist with metadata and lyrics.

It downloads the songs from YouTube as an mp3 file.

**WARNING, this is a very janky prototype version!**

Right now, 
- Users must manually get the access token in order to use the app for the first time
- Can only download the first song in a playlist
- Incorrect metadata information
- No lyrics

## Usage  
```bash
spotdl <playlist-id> -d <download-folder-path>
```
- (required) playlist-id: The Spotify playlist id or the url to the playlist
- (optional) donwload-folder-path: The full path to the folder you want to have the mp3 files downloaded into. If not specified, the mp3 files will automatically be downloaded into the user's Downloads folder.


### Example: Downloading playlist with URL
```bash
spotdl https://open.spotify.com/playlist/7zw3ARXQIVFZ4lEZXmeye6
```

### Example: Downloading playlist with the playlist ID
```bash
spotdl 7zw3ARXQIVFZ4lEZXmeye6
```

### Example: Choosing a different download folder
```bash
spotdl 7zw3ARXQIVFZ4lEZXmeye6 -d ~/Desktop
```

## Installation
**Requirements:**
   - node
      ```bash
      # if using a mac, use homebrew to install node
      brew install node
      ``` 
   - npm or yarn to install the dependecies
      ```bash
      # if using a mac, use homebrew to install npm and yarn
      brew install npm # I use npm
      brew install yarn
      ``` 
   - ffmpeg
      ```bash
      # if using a mac, you should already have it installed. otherwise, install it using homebrew
      brew install ffmpeg
      ```

**Installation:**
1. Git clone or copy the entire repo to a local folder
   ```bash
   git clone https://github.com/jenniferlieu-uni/spotify-download.git
   ```
2. Use npm to install dependecies
   ```bash
   npm install
   ```
3. Set the .env file api keys to your api keys except for the SPOTIFY_ACCESS_TOKEN
   - **How to get the YouTube API key**
      1. Go to the Google API credentials website: https://console.cloud.google.com/apis/credentials
      2. Sign into a Google account
      3. Click the "create new project" button on the right side of the screen
      4. Pick any name for the project. Then click "create"
      5. Near the top right again, click  the "Create Credentials" button
      6. A dialog will pop-up with the YouTube API key. Copy that key and place it into the config.js file
      7. Activate the YouTube API key by clicking Library on the left side bar.
      8. Then scroll down until you see "YouTube Data API v3" and click it
      9. Click "enable"
   - **How to get the Spotify client id and client secret**
      1. Go to the Spotify Developer Dashboard: https://developer.spotify.com/dashboard and sign into your Spotify account
      2. Click "create new app"
      3. Choose an app name and then agree to the terms and conditions and click "create"
      4. You will immediately see the client id. Copy that and paste it into the config.js file
      5. Click "show client secret" and copy and paste that into the config.js file. Do not share this client secret anywhere, and try not to upload it to the internet
4. **Get the access_token to access the Spotify API**
   1. Run the getSpotifyAccessToken.js file 
    ```bash
    node getSpotifyAccessToken.js
    ```
   2. Go to the link http://localhost:8888/login in your browser
   3. Wait for the website to say "Success! You can now close the window."
   4. Close the website tab
   5. Go back to the console and you will see a long list of almost nonsensical results. Find "access_token" and copy it to the .env file
   6. Stop the server by entering Ctrl+C into the command line
5. Install the command line app
   ```bash
   npm install -g .
   ```
6. Test the app using a [testing playlist](https://open.spotify.com/playlist/7zw3ARXQIVFZ4lEZXmeye6). Check the [Usage](#usage) section for more examples.
   ```bash
   spotdl https://open.spotify.com/playlist/7zw3ARXQIVFZ4lEZXmeye6
   ```
7. Uninstall the spotdl app
   ```bash
   npm uninstall spotdl
   ```

## Contribution
### How to contribute
1. Follow the [installation]((#installation)) instructions to create a local working copy of the app.

Files you need to understand:
1. `config.js`: the API keys live here. this file needs to be manually created by you, the developer, because it's not safe to push these keys onto the internet
2. `getSpotifyAccessToken.js`: this file spins up a server to get the Spotify Access Token
3. `index.js`: the main file and the code that runs the program
   - reads the command line arguments
   - gets a list of all the Spotify playlist tracks
   - searches YouTube
   - downloads YouTube videos
4. `package.json`: an informational file listing all the modules needed to run the app, the app name, the app version, etc.
5. `updateID3Tags.js`: a sample file on how to use the node-id3 module to add metadata to an mp3 file. i need to get this functionality working in the `index.js` file

### End goal for the user
The end goal is to make the app as user friendly as possible. And to complete the app. It's currently incomplete e.g. not user friendly, cannot add metadata, and cannot download an entire playlist.

Example of an easy install and usage:
- User installs the command line app using npm
  ```bash
  npm install -g spotdl
  ```
- User uses the command line to download a Spotify playlist:
  ```bash
  spotdl <playlist-id>
  ```
- User gives authentication access to the app
- All songs are downloaded with metadata and lyrics
- Done.

### TODO: Change project name
**Problem:** There's already a `spotdl` command line app that does the same exact thing, most likely faster and better.

### TODO: "Automically" connect to the Spotify API
**Problem:** Not user friendly. The user must manually copy and paste the access token into the `config.js` file.

**End goal:**
- When already authorized by the user, get Spotify Access Token without opening a web browser
- Automatically update the access token to the config.js file without manually copying and pasting it
- Automatically refresh the access token if it's expired

**Working with:** 
- `getSpotifyAccessToken.js`
- `config.js`
- Spotify API
- [express.js](https://expressjs.com) server
- [spotify-web-api-node module](https://github.com/thelinmichael/spotify-web-api-node)

### TODO: Find "worthy" youtube videos
**Problem:** It will only download the first video found on youtube. The first video may be 1 hour long and contain an entire album worth of songs. Or the video found on youtube may have end credit sounds or songs that are not apart of the song itself.

**End goal:** Each mp3 file will contain only 1 song without any extra sounds or songs.

**Working with:** 
- Youtube API
- Spotify API (maybe)
- [spotify-web-api-node module](https://github.com/thelinmichael/spotify-web-api-node) (maybe)
- [node-fetch](https://github.com/node-fetch/node-fetch) or [axios](https://axios-http.com) for HTTP clients
- Searching through an array

### TODO: Download all songs on the playlist
**Problem:** It can only download one song from the playlist (the first song on the playlist). When the video is in the process of being downloaded, the program will not wait for the download to finish and continue to run the rest of the code anyways.

**Working with:**
- [yt-converter module](https://github.com/RogelioLB/node-yt-converter)
- Threading (maybe)

### TODO: Add metadata to mp3 file
**Problem:** Cannot add metadata to mp3 file because the download isn't complete. 

**End goal:** Add metadata (song title, artist, album) to each mp3 file when it's finished downloading.

**Working with:** 
- [node-id3 module](https://github.com/Zazama/node-id3)
- Threading and processes (maybe)
- Promises (maybe)

### TODO: Add lyrics from Musixmatch 
**Problem:** It currently doesn't add lyrics or get lyrics from any API.

**End goal:** Add lyrics to the mp3 file 

**Working with:**
- Musixmatch API
- [node-id3 module](https://github.com/Zazama/node-id3)

### Extra Features
- Add album art
- Choose which songs in the playlist to download
  - May need to switch a GUI app for easiest user experience e.g. web app or desktop node.js app using Tauri
- Option to delete songs from the playlist that were succesfully downloaded (option can be turned on/off)
- Set default download folder
  - e.g. downloads to iTunes folder so that it's automatically added into iTunes