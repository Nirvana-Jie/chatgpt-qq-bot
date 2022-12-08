import { config } from "dotenv";
import { createBot } from "./bot";
import { ChatReplyPlugin } from "./plugins/Chatgpt";
// import {Greet} from './plugins/greet'

config();

export const account = parseInt(process.env.ACCOUNT!);
export const password = process.env.PASS_WORD!;
export const groupID = parseInt(process.env.GROUP_ID!);

const bot = createBot(account, password, [groupID]);

// bot.use(Greet)
bot.use(ChatReplyPlugin);
