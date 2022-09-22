import express, { Request, Response, Application } from 'express';
import { webhookCallback } from 'grammy';
import bot from './new_bot';
import 'dotenv/config';

const secretPath = String(process.env.BOT_TOKEN);

const app: Application = express();

app.use(express.json());
app.use(`/${secretPath}`, webhookCallback(bot, 'express'));

app.get('/time', (req: Request, res: Response): void => {
  const date: Date = new Date();
  res.send(
    `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  );
});

app.listen(Number(process.env.PORT), async () => {
  console.log(
    `The web server succesfully starts up and listens on port ${process.env.PORT}!`
  );
});
