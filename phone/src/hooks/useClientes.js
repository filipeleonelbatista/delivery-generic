import { useContext } from "react";
import { ClientesContext } from "../contexts/ClientesContext";

export function useClientes() {
  const value = useContext(ClientesContext);
  return value;
}
