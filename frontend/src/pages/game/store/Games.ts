import type { GameResponseDto } from "../../../../generated/api";
import createDataStorage from "../../../components/crud/createDataStorage";

const getDefaultSystem = () => ({
  id: 0,
  name: "",
  status: "CREATED" as "CREATED" | "STARTED",
  shortUrl: Math.random().toString(36).substring(2, 10),
});
const SystemsStorage = createDataStorage<GameResponseDto>(getDefaultSystem);

export default SystemsStorage;
