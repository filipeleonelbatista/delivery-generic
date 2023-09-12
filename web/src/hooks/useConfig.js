import { useContext } from "react";
import { ConfigsContext } from "../contexts/ConfigsContext";

export function useConfig() {
  const value = useContext(ConfigsContext);
  return value;
}
