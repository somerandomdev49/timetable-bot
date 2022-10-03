"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../init");
async function getFiles(name) {
    const data = {
        files: {},
        length: 0,
    };
    const foldersRes = await init_1.drive.files.list({
        q: `'${process.env.FOLDER_ID}' in parents`,
    });
    const folders = foldersRes.data.files;
    if (!folders) {
        throw new Error('why are there no folders here?');
    }
    for await (const folder of folders) {
        const fileRes = await init_1.drive.files.list({
            q: `'${folder.id}' in parents and name contains '${name}'`,
        });
        const { files } = fileRes.data;
        data.length += Number(files?.length);
        if (files?.length === 1) {
            const classNumber = Number(folder.name?.slice(0, folder.name.indexOf('класс') - 1));
            data.files[classNumber] = String(files[0].id);
        }
    }
    return data;
}
exports.default = getFiles;
