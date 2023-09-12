import { useContext } from "react";
import { CuponsContext } from "../contexts/CuponsContext";

export function useCupons() {
  const value = useContext(CuponsContext);
  return value;
}
