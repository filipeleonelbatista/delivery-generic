import { useContext } from "react";
import { ShoppingCartContext } from "../contexts/ShoppingCartContext";

export function useShoppingCart() {
  const value = useContext(ShoppingCartContext);
  return value;
}
