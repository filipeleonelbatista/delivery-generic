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
import { useCallback } from "react";
import { createContext, useEffect, useState } from "react";
import { useLoader } from "../hooks/useLoader";
import { db } from "../services/firebase-config";
import deleteImageFromStorage from "../utils/deleteImageFromStorage";

export const ConfigsContext = createContext({});

export function ConfigsContextProvider(props) {
  const { setIsLoading } = useLoader();

  const [config, setConfig] = useState([]);

  async function getAllConfigs() {
    const contactsRef = collection(db, "configuracoes");
    const result = getDocs(query(contactsRef))
      .then((snap) => {
        let contactList = [];
        snap.docs.forEach((doc) => {
          contactList.push({ ...doc.data(), id: doc.id });
        });
        return contactList;
      })
      .catch((error) => {
        console.log("getAllConfigs error", error);
        return [];
      });

    return result;
  }

  async function getCategoryByID(id) {
    const configRef = doc(db, "configuracoes", id);
    const categoriaSnap = await getDoc(configRef);
    const categoria = categoriaSnap.data();
    return categoria;
  }

  async function updateConfig(data) {
    await setDoc(doc(db, "configuracoes", data.id), data);

    await updateConfigsList();
  }

  const updateConfigsList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllConfigs();
    setConfig(response[0]);
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const executeAsync = async () => {
      await updateConfigsList();
    };
    executeAsync();
  }, [updateConfigsList]);

  return (
    <ConfigsContext.Provider
      value={{
        config,
        updateConfigsList,
        updateConfig,
        getCategoryByID,
      }}
    >
      {props.children}
    </ConfigsContext.Provider>
  );
}
