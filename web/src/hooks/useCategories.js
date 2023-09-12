import { useContext } from "react";
import { CategoriesContext } from "../contexts/CategoriesContext";

export function useCategories() {
  const value = useContext(CategoriesContext);
  return value;
}
