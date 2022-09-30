import express, { Application } from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';

const app: Application = express();

app.use(express.json());

app.get('/time', (req: Request, res: Response): void => {
  const date: Date = new Date();
  res.send(
    `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  );
});

export default app;
