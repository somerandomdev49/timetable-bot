import { Bot, webhookCallback } from 'grammy';
import 'dotenv/config';
import { createClient } from 'redis';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import app from './server';
import CustomContext from './types/CustomContext';

const TOKEN: string = process.env.BOT_TOKEN || '';
if (!TOKEN) throw new Error('BOT_TOKEN must be provided');

const secretPath = String(process.env.BOT_TOKEN);

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
if (!GOOGLE_CLIENT_EMAIL)
  throw new Error('GOOGLE_CLIENT_EMAIL must be provided');

const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
if (!GOOGLE_PRIVATE_KEY) throw new Error('GOOGLE_PRIVATE_KEY must be provided');

// * [MARKETING MODULE]
const REDIS_URL = process.env.REDIS_URL ?? '';
if (!REDIS_URL) throw new Error('REDIS_URL must be provided');

// init redis
const client = createClient({
  url: REDIS_URL,
});
client.on('error', (err) => console.log('Redis Client Error', err));
const clientStart = async () => client.connect();
clientStart();

// init bot
const bot = new Bot<CustomContext>(TOKEN);
bot.catch(async (e) => {
  console.log(e);
  await client.disconnect();
});

// init google drive
const auth = new GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: `-----BEGIN PRIVATE KEY-----\n${GOOGLE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

// start express server
app.use(`/${secretPath}`, webhookCallback(bot, 'express'));
app.listen(Number(process.env.PORT), async () => {
  console.log(
    `The web server succesfully starts up and listens on port ${process.env.PORT}!`
  );
});

export { bot, app, drive, client };
