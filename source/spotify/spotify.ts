const spotifyWebAPI = require('spotify-web-api-node')

const
  CLIENT_ID = 'ID',
  CLIENT_SECRET = 'SECRET'; //todo: place it as env variables 

// Create the api object with the credentials
const spotifyAPI = new spotifyWebAPI({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

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

const codes: string[] =
  [
    "PL",
    // "AE",
    // "AF",
    // "AG",
    // "AI",
    // "AL",
    // "AM",
    // "AO",
    // "AQ",
    // "AR",
    // "AS",
    // "AT",
    // "AU",
    // "AW",
    // "AZ"
  ]

async function GetData() {
  // try {
  //   const res = await spotifyAPI.getAvailableGenreSeeds();
  //   if (res.statusCode != 200) {
  //     return
  //   }
  //   const genres = res.body.genres;
  //   const playlistCategories: any[] = [];
  //   codes.forEach((countryCode: string) => {
  //     genres.forEach((genre: string) => {
  //       playlistCategories.push(spotifyAPI.getPlaylistsForCategory(genre, { country: countryCode })
  //         .then((data: any) => { return data.body })
  //         .catch((err: Error) => console.log(err.message))
  //       );
  //     });
  //   });

  //   const filtered = (await Promise.allSettled(playlistCategories)).filter(p => p.status != 'rejected' && p.value != undefined);

  //   const genrePlaylists: any[] = []
  //   filtered.forEach((element: any) => genrePlaylists.push(element.value.playlists));

  //   const genrePlaylistItems: any[] = [];
  //   genrePlaylists.forEach((playlist: any) => genrePlaylistItems.push(playlist.items));

  //   const genrePlaylistItemIDs: string[] = [];
  //   genrePlaylistItems.forEach((items: any[]) => items.forEach((item: any) => genrePlaylistItemIDs.push(item.id)));

  //   genrePlaylistItemIDs.forEach((ID: string) => {
  //     spotifyAPI.getPlaylist(ID).then((data: any) => console.log(data)).catch((err: Error) => console.log(err));
  //   })

 

  // } catch (err) {
  //   console.log(err);
  // }

 
  await spotifyAPI.getAvailableGenreSeeds()
    .then(async (data: any) => {
      const genres: string[] = data.body.genres;
      const artistsLookup = new Map(); 

      codes.forEach((countryCode: string) => {
        genres.forEach(async (genre: string) => {
          await spotifyAPI.getPlaylistsForCategory(genre, { country: countryCode })
            .then((data: any) => {
              const playlistItems: any[] = data.body.playlists.items;
              const playlistIDs: string[] = [];
              playlistItems.forEach((item: any) => {
                playlistIDs.push(item.id)
              })
              playlistIDs.forEach(async (ID: string) => {
                await spotifyAPI.getPlaylist(ID)
                .then((data: any) => {
                  const trackItems: any[] = data.body.tracks.items;
                  trackItems.forEach((item: any) => {
                      const artists : any[] = item.track.album.artists
                      artists.forEach((artist: any) => {
                          artistsLookup.set(artist.name, artist.id);
                      })
                      console.log(artistsLookup);
                  })
                })
                .catch((err: Error) => {
                  console.log(`Something wnet wrong during getting playlist: ${ID} info`);
                  console.log('Reason:', err.message);
                })
              })
            })
            .catch((err: Error) => {
              console.log(`Something wnet wrong during getting playlist for category: ${genre}, country_code: ${countryCode}`);
              console.log('Reason:', err.message);
            })
        });
      });
    })
    .catch((err: Error) => {
      console.log(`Something wnet wrong during getting getAvailableGenreSeeds`);
      console.log('Reason:', err.message);
    });
}

export = {
  GetData
};