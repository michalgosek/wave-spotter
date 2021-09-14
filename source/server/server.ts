import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import router from '../api/router';

function setMiddlewares(app: Express) {
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
}

function setCORS(app: Express) {
    app.use((req, res, next) => {
        // set the CORS policy
        res.header('Access-Control-Allow-Origin', '*');
        // set the CORS headers
        res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
        // set the CORS method headers
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
            return res.status(200).json({});
        }
        next();
    });
}

function setGlobalErrHandler(app: Express) {
    app.use((req, res, next) => {
        const error = new Error('not found');
        return res.status(404).json({
            message: error.message
        });
    })
}

function run() {
    const app: Express = express();
    app.use('/', router);

    setMiddlewares(app);
    setCORS(app);
    setGlobalErrHandler(app)

    /** Server */
    const srv = http.createServer(app);
    const PORT: any = process.env.PORT ?? 6060;
    srv.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
}

run();

