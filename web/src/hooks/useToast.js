import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export function useToast() {
  const value = useContext(ToastContext);
  return value;
}
