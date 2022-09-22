import type { Context, SessionFlavor } from 'grammy';
import SessionData from './SessionData';

type CustomContext = Context & SessionFlavor<SessionData>;

export default CustomContext;
