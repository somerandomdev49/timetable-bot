"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const grammy_1 = require("grammy");
const antispam_1 = __importDefault(require("./antispam"));
const mainComposer_1 = __importDefault(require("./composers/mainComposer"));
const scheduleComposer_1 = __importDefault(require("./composers/scheduleComposer"));
const scheduleRouter_1 = __importDefault(require("./routers/scheduleRouter"));
require("dotenv/config");
const serviceComposer_1 = __importDefault(require("./composers/serviceComposer"));
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
const init_1 = require("./init");
function startup() {
    init_1.bot.use((0, grammy_1.session)({
        initial() {
            return {
                route: '',
                user: {
                    name: '',
                    class: 0,
                },
                data: null,
            };
        },
    }));
    init_1.bot.use(antispam_1.default);
    init_1.bot.use(mainComposer_1.default);
    init_1.bot.use(serviceComposer_1.default);
    init_1.bot.use(authMiddleware_1.default);
    init_1.bot.use(scheduleRouter_1.default);
    init_1.bot.use(scheduleComposer_1.default);
}
exports.startup = startup;
