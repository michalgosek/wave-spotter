const spotifyWebAPI = require('spotify-web-api-node')

const
    clientID = 'YOUR_ID',
    clientSecret = 'YOUR_SECRET'; //todo: place it as env variables 

// Create the api object with the credentials
const spotifyAPI = new spotifyWebAPI({ clientId: clientID, clientSecret: clientSecret });

// Retrieve an access token.
spotifyAPI.clientCredentialsGrant().then(
    function (data: any) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        spotifyAPI.setAccessToken(data.body['access_token']);
    },
    function (err: Error) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

export = spotifyAPI;