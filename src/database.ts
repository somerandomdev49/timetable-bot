import { client as redis } from '.';

export interface UserData {
  code: number;
  limit: number;
}

export type UserID = number;

const USERSLIST = 'testers';

export async function addNewTester(
  tgId: number,
  code: string
): Promise<boolean> {
  const newCode = String(tgId).slice(3, 9);

  try {
    await redis.decr(code);
    await redis.lPush(USERSLIST, String(tgId));

    await redis.set(newCode, 3);
    return true;
  } catch (e) {
    console.error('[REDIS] (DECR&SET)');
    return false;
  }
}

export async function hasUserAccess(tgId: number): Promise<boolean> {
  try {
    const users = await redis.lRange(USERSLIST, 0, 999);
    if (users.includes(String(tgId))) return true;
  } catch (e) {
    console.error('[REDIS] (LRANGE)', e);
  }
  return false;
}

export async function canUseCode(code: string): Promise<boolean> {
  try {
    const limit = Number(await redis.get(code));
    if (limit > 0) return true;
  } catch (e) {
    console.error('[REDIS] (GET)', e);
  }
  return false;
}
