import { Request, Response, NextFunction } from 'express';
import spotifyAPI from '../spotify/spotify';

function dummyHandler(req: Request, res: Response, next: NextFunction) {
    spotifyAPI.GetData()
    res.status(200).json({ message: "Dummy" })
};

export default {
    dummyHandler
};