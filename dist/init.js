"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.bot = exports.drive = void 0;
const redis_1 = require("redis");
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const grammy_1 = require("grammy");
const TOKEN = process.env.BOT_TOKEN || '';
if (!TOKEN)
    throw new Error('BOT_TOKEN must be provided');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
if (!GOOGLE_CLIENT_EMAIL)
    throw new Error('GOOGLE_CLIENT_EMAIL must be provided');
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
if (!GOOGLE_PRIVATE_KEY)
    throw new Error('GOOGLE_PRIVATE_KEY must be provided');
const REDIS_URL = process.env.REDIS_URL ?? '';
if (!REDIS_URL)
    throw new Error('REDIS_URL must be provided');
const client = (0, redis_1.createClient)({
    url: REDIS_URL,
});
exports.client = client;
client.on('error', (err) => console.log('Redis Client Error', err));
const clientStart = async () => client.connect();
clientStart();
const bot = new grammy_1.Bot(TOKEN);
exports.bot = bot;
const auth = new google_auth_library_1.GoogleAuth({
    credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: `-----BEGIN PRIVATE KEY-----\n${GOOGLE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = googleapis_1.google.drive({ version: 'v3', auth });
exports.drive = drive;
