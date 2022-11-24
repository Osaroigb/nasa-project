import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import express from 'express';
import api from './routes/api.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.FRONT_END_CLIENT 
}));

app.use(morgan('combined'));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public'))); // user interface layer
app.use('/v1', api);

app.get("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); // user interface layer
});

export default app;
