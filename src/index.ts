import { webhookCallback } from 'grammy';
import 'dotenv/config';
import app from './server';
import { bot } from './init';
import { startup } from './bot';

const TOKEN: string = process.env.BOT_TOKEN || '';
if (!TOKEN) throw new Error('BOT_TOKEN must be provided');

const secretPath = String(process.env.BOT_TOKEN);

// start bot
startup();

// start express server
app.use(`/${secretPath}`, webhookCallback(bot, 'express'));
app.listen(Number(process.env.PORT), async () => {
  console.log(
    `The web server succesfully starts up and listens on port ${process.env.PORT}!`
  );
});
