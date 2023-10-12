import { createContext, useEffect, useState } from "react";
import { useLoader } from "../hooks/useLoader";
import { useToast } from "../hooks/useToast";
import { db } from "../services/firebase-config";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext({});

export function UserContextProvider(props) {
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();

  const [user, setUser] = useState(null);
  const [ordersList, setOrdersList] = useState(null);

  async function getAllOrdersFromClient(id) {
    const orderRef = collection(db, "pedidos");
    const result = getDocs(
      query(orderRef, where("clientId", "==", id), orderBy("createdAt", "desc"))
    )
      .then((snap) => {
        let pedidos = [];
        snap.docs.forEach((doc) => {
          pedidos.push({ ...doc.data(), id: doc.id });
        });
        return pedidos;
      })
      .catch((error) => {
        console.log("getAllOrders error", error);
        return [];
      });

    return result;
  }

  async function getClientesByID(id) {
    const cuponsRef = doc(db, "clientes", id);
    const cuponsSnap = await getDoc(cuponsRef);
    const cupons = cuponsSnap.data();
    return cupons;
  }

  async function loadData() {
    const value = await AsyncStorage.getItem("@user_id");
    console.log("Valor do user_id", value);
    if (value !== null) {
      const response = await getClientesByID(value);
      setUser(response);

      const ordersResponse = await getAllOrdersFromClient(value);
      setOrdersList(ordersResponse);
    }
  }

  useEffect(() => {
    const executeAsync = async () => {
      await loadData();
    };
    executeAsync();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loadData
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
