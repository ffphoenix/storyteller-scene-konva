import { makeAutoObservable } from "mobx";
import { generateUUID } from "../../utils/uuid";

export type MessageType = "CHAT_MESSAGE" | "DICE_ROLL" | "SYSTEM_MESSAGE";

export type HistoryMessage = {
  id: string;
  type: MessageType;
  userId: number;
  body: { result?: string; context?: string; message?: string };
  createdAt: Date;
};
export type HistoryMessagesStore = {
  messages: HistoryMessage[];
  isOpen: boolean;
  toggleOpen: () => void;
  open: () => void;
  close: () => void;
  addDiceRollMessage: (userId: number, result: string, context?: string) => void;
  addUserMessage: (userId: number, text: string) => void;
  updateMessages: (messages: HistoryMessage[]) => void;
  clear: () => void;
};

const gameHistoryMessages: HistoryMessagesStore = makeAutoObservable<HistoryMessagesStore>({
  messages: [],
  isOpen: false,
  toggleOpen: () => {
    gameHistoryMessages.isOpen = !gameHistoryMessages.isOpen;
  },
  open: () => {
    gameHistoryMessages.isOpen = true;
  },
  close: () => {
    gameHistoryMessages.isOpen = false;
  },
  addDiceRollMessage: (userId, result, context) => {
    gameHistoryMessages.messages.push({
      id: generateUUID(),
      type: "DICE_ROLL",
      userId,
      body: { result, context },
      createdAt: new Date(),
    });
  },
  addUserMessage: (userId, message) => {
    gameHistoryMessages.messages.push({
      id: generateUUID(),
      type: "CHAT_MESSAGE",
      userId,
      body: { message },
      createdAt: new Date(),
    });
  },
  updateMessages: (messages) => {
    gameHistoryMessages.messages = messages;
  },
  clear: () => {
    gameHistoryMessages.messages = [];
  },
});

export default gameHistoryMessages;
