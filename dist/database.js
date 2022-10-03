"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseCode = exports.hasUserAccess = exports.addNewTester = void 0;
const init_1 = require("./init");
const USERSLIST = 'testers';
async function addNewTester(tgId, code) {
    const newCode = String(tgId).slice(3, 9);
    try {
        await init_1.client.decr(code);
        await init_1.client.lPush(USERSLIST, String(tgId));
        await init_1.client.set(newCode, 3);
        return true;
    }
    catch (e) {
        console.error('[REDIS] (DECR&SET)');
        return false;
    }
}
exports.addNewTester = addNewTester;
async function hasUserAccess(tgId) {
    try {
        const users = await init_1.client.lRange(USERSLIST, 0, 999);
        if (users.includes(String(tgId)))
            return true;
    }
    catch (e) {
        console.error('[REDIS] (LRANGE)', e);
    }
    return false;
}
exports.hasUserAccess = hasUserAccess;
async function canUseCode(code) {
    try {
        const limit = Number(await init_1.client.get(code));
        if (limit > 0)
            return true;
    }
    catch (e) {
        console.error('[REDIS] (GET)', e);
    }
    return false;
}
exports.canUseCode = canUseCode;
