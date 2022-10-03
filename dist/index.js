"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
require("dotenv/config");
const server_1 = __importDefault(require("./server"));
const init_1 = require("./init");
const bot_1 = require("./bot");
const TOKEN = process.env.BOT_TOKEN || '';
if (!TOKEN)
    throw new Error('BOT_TOKEN must be provided');
const secretPath = String(process.env.BOT_TOKEN);
(0, bot_1.startup)();
server_1.default.use(`/${secretPath}`, (0, grammy_1.webhookCallback)(init_1.bot, 'express'));
server_1.default.listen(Number(process.env.PORT), async () => {
    console.log(`The web server succesfully starts up and listens on port ${process.env.PORT}!`);
});
