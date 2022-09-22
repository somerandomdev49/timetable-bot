import { drive } from '../new_bot';
import Data from '../types/FilesData';

export default async function getFiles(name: string): Promise<Data> {
  const data: Data = {
    files: {},
    length: 0,
  };

  const foldersRes = await drive.files.list({
    q: `'${process.env.FOLDER_ID}' in parents`,
  });

  const folders = foldersRes.data.files;
  if (!folders) {
    throw new Error('why are there no folders here?');
  }

  for await (const folder of folders) {
    const fileRes = await drive.files.list({
      q: `'${folder.id}' in parents and name contains '${name}'`,
    });

    const { files } = fileRes.data;
    data.length += Number(files?.length);
    if (files?.length === 1) {
      const classNumber = Number(
        folder.name?.slice(0, folder.name.indexOf('класс') - 1)
      );
      // let name = String(files[0].name?.slice(0, -5))

      data.files[classNumber] = String(files[0].id); // TODO: make test for undefined
    }
  }

  return data;
}
