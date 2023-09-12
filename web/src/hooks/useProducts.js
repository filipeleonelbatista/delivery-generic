import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductContext";

export function useProducts() {
  const value = useContext(ProductsContext);
  return value;
}
