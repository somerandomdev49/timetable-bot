"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("./messages"));
let lastResetTime = new Date().getTime();
let accessLog = {};
const banList = {};
function updateAccessLog(id) {
    if (!accessLog[id]) {
        accessLog[id] = 1;
    }
    else {
        accessLog[id] += 1;
    }
}
function checkUser(ctx, next) {
    if (!ctx.from?.id)
        return ctx.reply(messages_1.default.error);
    const { id } = ctx.from;
    const time = new Date().getTime();
    updateAccessLog(id);
    if (banList[id] < time) {
        delete banList[id];
    }
    else if (banList[id]) {
        ctx.reply('бан');
    }
    else if (accessLog[id] > 10) {
        banList[id] = time + 60000;
    }
    if (lastResetTime < time) {
        accessLog = {};
        lastResetTime = time + 10000;
    }
    if (!banList[id])
        next();
    return 0;
}
exports.default = checkUser;
