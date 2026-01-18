import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import gameHistoryMessages, { type HistoryMessage } from "../../store/GameHistoryMessages";
import CurrentUser from "../../../../../globalStore/users/CurrentUser";

const ChatMessageItem: React.FC<{ message: HistoryMessage }> = ({ message }) => {
  const isSystem = message.type === "SYSTEM_MESSAGE";
  const timeStr = message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isSystem) {
    return (
      <div className="flex flex-col items-center my-2 px-4">
        <span className="text-xs italic text-gray-500 text-center">
          {message.body.message} ({timeStr})
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-3 px-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-bold text-sm text-blue-700">
          {message.userId === CurrentUser.id ? "You" : message.userId}
        </span>
        <span className="text-[10px] text-gray-400">{timeStr}</span>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-sm shadow-sm break-words">
        {message.body.message}
      </div>
    </div>
  );
};

const ChatMessageList: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameHistoryMessages.messages.length]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 bg-gray-50/50">
      {gameHistoryMessages.messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-10 text-sm">No messages yet.</div>
      ) : (
        gameHistoryMessages.messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
      )}
    </div>
  );
};

export default observer(ChatMessageList);
