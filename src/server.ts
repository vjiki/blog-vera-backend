import http from 'http';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';
import multer from "multer";
import cors from "cors";
import fs from "fs";

import userRoutes from './routes/user';
import blogRoutes from './routes/blog';

const router = express();

const storage = multer.diskStorage({
    destination: (_, _name, cb) => {
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }
      cb(null, "uploads");
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage });

/** Server Handling */
const httpServer = http.createServer(router);

/** Connect to Firebase */
// let serviceAccount = require('./config/serviceAccountKey.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert('./src/config/serviceAccountKey.json')
});

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info('Mongo Connected');
    })
    .catch((error) => {
        logging.error(error);
    });

/** Log the request */
router.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(cors());
router.use("/uploads", express.static("uploads"));

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.post("/upload", upload.single("image"), (req: any, res: any) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
});

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

/** Listen */
httpServer.listen(process.env.PORT || config.server.port, () => logging.info(`Server is running ${config.server.host}:${config.server.port}`));