/**
 * This example refreshes an access token. Refreshing access tokens is only possible access tokens received using the
 * Authorization Code flow, documented here: https://developer.spotify.com/spotify-web-api/authorization-guide/#authorization_code_flow
 */

/* Retrieve an authorization code as documented here:
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 * or in the Authorization section of the README.
 *
 * Codes are given for a set of scopes. For this example, the scopes are user-read-private and user-read-email.
 * Scopes are documented here:
 * https://developer.spotify.com/documentation/general/guides/scopes/
 */
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const myConfig = require('./config');

// instantiate spotifyWebApi with client credentials
const spotifyApi = new SpotifyWebApi({
    clientId: myConfig.env.spotifyClientId,
    clientSecret: myConfig.env.spotifyClientSecret,
    redirectUri: myConfig.spotify.redirectUri
});

// instantiate express 
const app = express();

// declare variables
const scopes = myConfig.spotify.scopes; // the list of permissions that we need from the user to run the app
const state = 'okzKhiRHRQvqyjPdfej'; // a random string that we have to generate ourselves bc of oauth security reasons

// redirect to the authorization url so that the user can give access to our app
app.get('/login', (req, res) => {
    let authorizationURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.redirect(authorizationURL);
});

// after the app has been authorized, we'll get a code param in the url link
app.get('/callback', (req, res) => {
    // get the code and error params from the callback link
    const error = req.query.error;
    const code = req.query.code;
    console.log('code=' + code + '\n');

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    // get the accecss token using the code. it should last for 60mins from creation
    spotifyApi.authorizationCodeGrant(code).then(
        data => {
            // get access token for first time
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            console.log('access_token:', access_token + '\n');
            console.log('refresh_token:', refresh_token + '\n');

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            )

            res.send('Success! You can now close the window.');

            // refersh auth token after it expires in 60mins
            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        },
        error => {
            console.log('Unable to get access key');
            console.error(error);
            return;
        }
    );
});

// creates a server at port number 8888
app.listen(8888, () =>
    console.log(
        `HTTP Server up. Now go to http://localhost:8888/login in your browser.\n`
    )
);