import { useContext } from "react";
import { BannersContext } from "../contexts/BannersContext";

export function useBanners() {
  const value = useContext(BannersContext);
  return value;
}
