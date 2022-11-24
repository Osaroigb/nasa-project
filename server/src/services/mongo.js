import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGO_URL = `mongodb+srv://osaroigb:${process.env.PASSWORD}@nasacluster.5akr0pj.mongodb.net/nasa?retryWrites=true&w=majority`;

mongoose.connection.once('open', () => console.info('MongoDB connection ready!'));
mongoose.connection.on('error', (err) => console.error(err));

export async function mongoConnect() { await mongoose.connect(MONGO_URL) }
export async function mongoDisconnect() { await mongoose.disconnect() }
