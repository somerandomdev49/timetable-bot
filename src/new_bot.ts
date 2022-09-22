import { google } from 'googleapis';
import { Bot, session } from 'grammy';
import { createClient } from 'redis';
import { GoogleAuth } from 'google-auth-library';
import checkUser from './antispam';
import mainComposer from './composers/mainComposer';
import scheduleComposer from './composers/scheduleComposer';
import scheduleRouter from './routers/scheduleRouter';
import CustomContext from './types/CustomContext';
import SessionData from './types/SessionData';
// import type { Context, SessionFlavor } from 'grammy'
// import MSGS from './messages'
// import { delay, getClassNumberBtns, getWeekdayBtns, Lesson, State } from './utils/utils'
import 'dotenv/config';
import serviceComposer from './composers/serviceComposer';
import authMiddleware from './authMiddleware';

// TODO: move all main logic to external file and save only bot here

// interface User {
//     name: string,
//     class: number,
// }

// interface Data {
//     files: {
//         [classNumber: number]: string
//     },
//     length: number,
// }

// interface SessionData {
//     route: string,
//     user: User,
//     data: Data | null,
// }

// export interface Lesson {
//     number: number,
//     title: string,
//     group: string,
//     teacher?: string,
//     room: string
// }

// type CustomContext = Context & SessionFlavor<SessionData>

// function getUserFromFolders(data: Data, cls?: number): { name: string, fildeId: string } {
//     return { name: '', fildeId: '' }
// }

// async function getSchedule(query: string): Promise<Lesson[]> {
//     const name: string = query.slice(1, -2)
//     const cls: number = +query.slice(-2)
//     const day: number = +query.slice(0, 1)
//     console.log(name, cls, day)

//     const classFolder = await drive.files.list({
//         q: `'${process.env.FOLDER_ID}' in parents and name = '${cls} класс'`
//     })
//     if (!classFolder?.data?.files?.[0]?.id) {
//         throw new Error('error folder')
//     }

//     const fileId = await drive.files.list({
//         q: `'${classFolder.data.files[0].id}' in parents and name contains '${name}'`
//     })
//     if (!fileId?.data?.files?.[0]?.id) {
//         throw new Error('error file')
//     }

//     let res = await fetch(`https://drive.google.com/uc?id=${fileId.data.files[0].id}&export=download`)
//     let arrayBuffer = await res.arrayBuffer()

//     let array: Uint8Array = new Uint8Array(arrayBuffer)
//     let workbook: WorkBook = xlsx.read(array, { type: 'array' })
//     let sheet: Sheet = workbook.Sheets[workbook.SheetNames[0]]

//     let data: Lesson[] = []

//     for (let rowNum = 2; rowNum <= 11; rowNum++) {
//         const title: string = sheet[xlsx.utils.encode_cell({ r: rowNum+14*(day-1), c: 1 })]?.v
//         const group: string = sheet[xlsx.utils.encode_cell({ r: rowNum+14*(day-1), c: 2 })]?.v // ?.v can be undefined, not string
//         const room: string = sheet[xlsx.utils.encode_cell({ r: rowNum+14*(day-1), c: 4 })]?.v
//         data.push({
//             title: title || 'Окно',
//             group,
//             number: rowNum - 1,
//             room: room ?? '',
//         })
//     }

//     return data
// }

// async function getFiles(name: string): Promise<Data> {
//     let data: Data = {
//         files: {},
//         length: 0
//     }

//     let foldersRes = await drive.files.list({
//         q: `'${process.env.FOLDER_ID}' in parents`
//     })

//     let folders = foldersRes.data.files
//     if (!folders) {
//         throw new Error('why are there no folders here?')
//     }

//     for (let folder of folders) {
//         let fileRes = await drive.files.list({
//             q: `'${folder.id}' in parents and name contains '${name}'`
//         })

//         let files = fileRes.data.files
//         data.length += Number(files?.length)
//         if (files?.length !== 1) {
//             continue
//         }

//         let classNumber = Number(folder.name?.slice(0, folder.name.indexOf('класс')-1))
//         // let name = String(files[0].name?.slice(0, -5))

//         data.files[classNumber] = String(files[0].id) // TODO: make test for undefined
//     }

//     return data
// }

// const composer = new Composer<CustomContext>()

// composer.command('schedule', async ctx => {
//     const name: string = ctx.match
//     let msg = 'send me your name'
//     let payload = {}

//     ctx.session.route = 'schedule-name-input'

//     if (name) {
//         const res: Data = await getFiles(name) // find all files that contain this name
//         ctx.session.data = res
//         console.log(res);

//         if (res.length === 1) {
//             const q: string = name + String(Object.keys(res.files)[0]).padStart(2, '0')
//             const inlineKeyboard = new InlineKeyboard()
//                 .text('Понедельник', `1${q}`).text('Вторник', `2${q}`).row()
//                 .text('Среда', `3${q}`).text('Четверг', `4${q}`).row()
//                 .text('Пятница', `5${q}`).text('Суббота', `6${q}`).row()

//             ctx.session.route = ''

//             msg = 'choice day'
//             payload = { reply_markup: inlineKeyboard }
//         } else if (res.length > 1 && res.length === Object.keys(res.files).length) {
//             ctx.session.user.name = name
//             ctx.session.route = 'schedule-class-select'

//             msg = 'select right class number' // TODO: add btns markup
//         } else {
//             msg = 'send your full name pls again'
//         }
//     }

//     let btns = await ctx.reply(msg, payload)
//     console.log(btns)
//     await bot.api.pinChatMessage(btns.chat.id, btns.message_id)
// })

// composer.on('callback_query', async ctx => {
//     const query = String(ctx.callbackQuery.data)
//     let msg: string = ''
//     let schedule: Lesson[]

//     try {
//         /* note: here is a function that cant throw a special exception with context so i use a normal exception, then catch the exception here and just throw BotError in bot.catch, otherwise the bot cant handle this exception and just stops */
//         schedule = await getSchedule(query)
//     } catch (err: any) {
//         return ctx.reply(err.message)
//     }

//     console.log(ctx.callbackQuery.data, schedule)

//     while (schedule.map(val => val.title).lastIndexOf('Окно') === schedule.length -1 ) {
//         schedule.pop()
//     }

//     const tableItem = ({ title, room }: Lesson): string => title + room.padStart(26-title.length, ' ')

//     for (let item of schedule) {
//         msg += tableItem(item) + '\n'
//     }

//     if (!ctx.update.callback_query.message?.reply_markup) {
//         const q: string = query.slice(1)
//         const keyboard = new InlineKeyboard()
//                 .text('Понедельник', `1${q}`).text('Вторник', `2${q}`).row()
//                 .text('Среда', `3${q}`).text('Четверг', `4${q}`).row()
//                 .text('Пятница', `5${q}`).text('Суббота', `6${q}`).row()

//         return await ctx.reply(
//             `\`\`\`\n${msg}\n\`\`\``,
//             {
//                 parse_mode: 'MarkdownV2',
//                 reply_markup: keyboard
//             }
//         )
//     }

//     await ctx.editMessageText(
//         `\`\`\`\n${msg}\n\`\`\``,
//         {
//             parse_mode: 'MarkdownV2',
//             reply_markup: { ...ctx.update.callback_query.message?.reply_markup }
//         }
//     )
// })

// composer.command('breakschedule', async ctx => {
//     // ctx.session.route = 'breakschedule'
//     // await ctx.reply('send me your class')
//     let match: number = +ctx.match ?? -1
//     let classNumber: number = 0
//     if (match >= 9 && match <= 11) {
//         classNumber = match
//     } else {
//         let inlineBtn:any = await bot.api.getChat(ctx.chat.id).then(chat => chat.pinned_message?.reply_markup?.inline_keyboard[0][0])
//         let query: string = inlineBtn.callback_data.slice(1)
//         classNumber = +query.slice(query.length-2)
//     }
//     ctx.reply('not ok')
// })

// const scheduleRouter = new Router<CustomContext>(ctx => ctx.session.route)
// scheduleRouter.route('schedule-name-input', async ctx => {
//     const name = String(ctx.msg?.text)
//     let msg: string = 'send me your name' // TODO: make convenient typing
//     let payload = {}

//     if (name) {
//         const res: Data = await getFiles(name) // find all files that contain this name
//         ctx.session.data = res
//         console.log(res);

//         if (res.length === 1) {
//             const q: string = name + String(Object.keys(res.files)[0]).padStart(2, '0')
//             const inlineKeyboard = new InlineKeyboard()
//                 .text('Понедельник', `1${q}`).text('Вторник', `2${q}`).row()
//                 .text('Среда', `3${q}`).text('Четверг', `4${q}`).row()
//                 .text('Пятница', `5${q}`).text('Суббота', `6${q}`).row()

//             ctx.session.route = ''

//             msg = 'choice day'
//             payload = { reply_markup: inlineKeyboard }
//         } else if (res.length > 1 && res.length === Object.keys(res.files).length) {
//             ctx.session.user.name = name
//             ctx.session.route = 'schedule-class-select'

//             msg = 'select right class number' // TODO: add btns markup
//         } else {
//             msg = 'send your full name pls again'
//         }
//     }

//     await ctx.reply(msg, payload)
// })
// scheduleRouter.route('schedule-class-select', async ctx => {
//     const classNumber = Number(ctx.callbackQuery?.data)
//     ctx.session.user.class = classNumber
// })

// AIzaSyBLcNMMZWVNPc1q2iUn8t2unh_emCgptB4

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
if (!GOOGLE_CLIENT_EMAIL)
  throw new Error('GOOGLE_CLIENT_EMAIL must be provided');

const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
if (!GOOGLE_PRIVATE_KEY) throw new Error('GOOGLE_PRIVATE_KEY must be provided');

const auth = new GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: `-----BEGIN PRIVATE KEY-----\n${GOOGLE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

const TOKEN: string = process.env.BOT_TOKEN || '';
if (!TOKEN) throw new Error('BOT_TOKEN must be provided');

// * [MARKETING MODULE]
const REDIS_URL = process.env.REDIS_URL ?? '';
if (!REDIS_URL) throw new Error('REDIS_URL must be provided');

const bot = new Bot<CustomContext>(TOKEN);

const client = createClient({
  url: REDIS_URL,
});
client.on('error', (err) => console.log('Redis Client Error', err));
const clientStart = async () => client.connect();
clientStart();

bot.use(
  session({
    initial(): SessionData {
      return {
        route: '',
        user: {
          name: '',
          class: 0,
        },
        data: null,
      };
    },
  })
);

bot.use(checkUser);

bot.use(mainComposer);

// * [MARKETING MODULE] middleware for /code PROCESSING
bot.use(serviceComposer);

// * [MARKETING MODULE] middleware for checking users
bot.use(authMiddleware);

bot.use(scheduleRouter);

bot.use(scheduleComposer);

bot.catch(async (e) => {
  console.log(e);
  // await prisma.$disconnect();
  await client.disconnect();
});

export default bot;
export { drive, client };
