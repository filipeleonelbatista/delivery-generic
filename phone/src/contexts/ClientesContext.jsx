import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { createContext, useCallback, useEffect, useState } from "react";
import { useLoader } from "../hooks/useLoader";
import { db } from "../services/firebase-config";

export const ClientesContext = createContext({});

export function ClientesContextProvider(props) {
  const { setIsLoading } = useLoader();

  const [clientesList, setClientesList] = useState([]);

  const [selectedCliente, setSelectedCliente] = useState(false);

  async function getAllClientes() {
    const cuponsRef = collection(db, "clientes");
    const result = getDocs(query(cuponsRef, orderBy("createdAt", "desc")))
      .then((snap) => {
        let clientes = [];
        snap.docs.forEach((doc) => {
          clientes.push({ ...doc.data(), id: doc.id });
        });
        return clientes;
      })
      .catch((error) => {
        console.log("getAllClientes error", error);
        return [];
      });

    return result;
  }

  const updateClientesList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllClientes();
    setClientesList(response);
    setIsLoading(false);
  }, [setIsLoading]);

  async function getClientesByID(id) {
    const cuponsRef = doc(db, "clientes", id);
    const cuponsSnap = await getDoc(cuponsRef);
    const cupons = cuponsSnap.data();
    return cupons;
  }

  async function updateCliente(data) {
    await setDoc(doc(db, "clientes", data.id), data);

    await updateClientesList();
  }

  async function addCliente(data) {
    const clienteRef = collection(db, "clientes");
    await addDoc(clienteRef, data);

    await updateClientesList();
  }

  async function handleDeleteCliente(id) {
    const response = confirm(
      "Deseja realmente deletar esse registro? Esta ação é irreverssível"
    );
    if (response) {
      await deleteDoc(doc(db, "clientes", id));
    }
    await updateClientesList();
  }

  useEffect(() => {
    const executeAsync = async () => {
      await updateClientesList();
    };
    executeAsync();
  }, [updateClientesList]);

  return (
    <ClientesContext.Provider
      value={{
        clientesList,
        selectedCliente,
        setSelectedCliente,
        updateClientesList,
        handleDeleteCliente,
        addCliente,
        updateCliente,
        getClientesByID,
      }}
    >
      {props.children}
    </ClientesContext.Provider>
  );
}
