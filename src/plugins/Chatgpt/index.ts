import { config } from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { initFn, Plugin } from "../../types";
import { Config, GroupMessageEvent, MessageElem, TextElem } from "oicq";
import { Helper } from "../../Helper";
import { logger } from "../../shared/logger";

config();
const { warn, info } = logger;

let configs: Config | undefined;
const api = new ChatGPTAPI({
  sessionToken: process.env.SESSION_TOKEN!,
});
async function initChatGPT() {
  try {
    await api.ensureAuth();
    info("ChatGPT 身份确认 ");
  } catch (e) {
    warn("ChatGPT 身份异常");
  }
}

async function ChatReply(data: GroupMessageEvent, helper: Helper) {
  try {
    const { sender, message } = data;
    const infoObj = message[1] as TextElem;
    const res = await api.sendMessage(infoObj.text);
    helper.sendMsg(`@${sender.nickname}\n${res}`);
  } catch (e) {
    console.log(e);
    helper.sendMsg("慢点慢点，我快跟不上了");
  }
}

const init: initFn<Config, false> = (helper, _config) => {
  configs = _config;
  initChatGPT();
  helper.addEventListener("message.group", (data) => {
    const { group_id, message } = data;
    if (group_id !== helper.groupID) return;
    if (message[0].type === "at") {
      ChatReply(data, helper);
    }
  });
};

export const ChatReplyPlugin: Plugin<Config, false> = {
  name: "ChatReply",
  init,
};
