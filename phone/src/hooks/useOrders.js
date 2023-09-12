import { useContext } from "react";
import { OrderContext } from "../contexts/OrderContext";

export function useOrders() {
  const value = useContext(OrderContext);
  return value;
}
