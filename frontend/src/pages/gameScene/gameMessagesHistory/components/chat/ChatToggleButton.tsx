import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ChatIcon } from "../../../../../icons";
import gameHistoryMessages from "../../store/GameHistoryMessages";

const ChatToggleButton: React.FC = () => {
  return (
    <Button
      aria-label="Toggle Chat"
      text
      raised
      icon={<ChatIcon />}
      className={`tooltip-button ${gameHistoryMessages.isOpen ? "tooltip-button-selected" : ""}`}
      onClick={() => gameHistoryMessages.toggleOpen()}
      tooltip="Toggle Chat"
      tooltipOptions={{ position: "left" }}
    />
  );
};

export default observer(ChatToggleButton);
