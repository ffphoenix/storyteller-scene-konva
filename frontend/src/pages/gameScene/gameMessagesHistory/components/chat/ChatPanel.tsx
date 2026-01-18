import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { CloseIcon } from "../../../../../icons";
import gameHistoryMessages from "../../store/GameHistoryMessages";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const ChatPanel: React.FC = () => {
  if (!gameHistoryMessages.isOpen) return null;

  return (
    <div
      className="absolute right-[40px] top-0  h-full w-80 bg-white border-r shadow-2xl z-1001 flex flex-col animate-fadein"
      style={{ animationDuration: "0.2s" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pl-3 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Chat</h3>
        <Button
          icon={<CloseIcon />}
          text
          rounded
          onClick={() => gameHistoryMessages.close()}
          className="text-gray-500"
          aria-label="Close"
        />
      </div>

      {/* Messages */}
      <ChatMessageList />

      {/* Input */}
      <ChatInput />
    </div>
  );
};

export default observer(ChatPanel);
