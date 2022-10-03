"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
function log(msg) {
    console.log((0, util_1.format)(msg).replaceAll('\n', '').replaceAll(/[ ]+/gm, ' '));
}
exports.default = log;
