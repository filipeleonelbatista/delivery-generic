import { useContext } from "react";
import { LoaderContext } from "../contexts/LoaderContext";

export function useLoader() {
  const value = useContext(LoaderContext);
  return value;
}
