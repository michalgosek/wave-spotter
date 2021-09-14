import { Request, Response, NextFunction } from 'express';
import spotifyAPI from '../spotify/spotify';

async function dummyHandler(req: Request, res: Response, next: NextFunction) {
    spotifyAPI.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
        function (data: any) {
            console.log('Artist albums', data.body);
        },
        function (err: Error) {
            console.error(err);
        }
    );
    return res.status(200).json({ message: "Dummy" })
};

export default {
    dummyHandler
};