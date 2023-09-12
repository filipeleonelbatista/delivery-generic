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

export const CuponsContext = createContext({});

export function CuponsContextProvider(props) {
  const { setIsLoading } = useLoader();

  const [cuponsList, setCuponsList] = useState([]);

  const [selectedCupom, setSelectedCupom] = useState(false);

  async function getAllCupons() {
    const cuponsRef = collection(db, "desconto");
    const result = getDocs(query(cuponsRef, orderBy("createdAt", "desc")))
      .then((snap) => {
        let cupons = [];
        snap.docs.forEach((doc) => {
          cupons.push({ ...doc.data(), id: doc.id });
        });
        return cupons;
      })
      .catch((error) => {
        console.log("getAllCupons error", error);
        return [];
      });

    return result;
  }

  async function getCuponsByID(id) {
    const cuponsRef = doc(db, "desconto", id);
    const cuponsSnap = await getDoc(cuponsRef);
    const cupons = cuponsSnap.data();
    return cupons;
  }

  async function updateCupom(data) {
    await setDoc(doc(db, "desconto", data.id), data);

    await updateCuponsList();
  }

  async function addCupom(data) {
    const cupomRef = collection(db, "desconto");
    await addDoc(cupomRef, data);

    await updateCuponsList();
  }

  async function handleDeleteCupom(id) {
    const response = confirm(
      "Deseja realmente deletar esse registro? Esta ação é irreverssível"
    );
    if (response) {
      await deleteDoc(doc(db, "desconto", id));
    }
    await updateCuponsList();
  }

  const updateCuponsList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllCupons();
    setCuponsList(response);
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const executeAsync = async () => {
      await updateCuponsList();
    };
    executeAsync();
  }, [updateCuponsList]);

  return (
    <CuponsContext.Provider
      value={{
        cuponsList,
        selectedCupom,
        setSelectedCupom,
        updateCuponsList,
        handleDeleteCupom,
        addCupom,
        updateCupom,
        getCuponsByID,
      }}
    >
      {props.children}
    </CuponsContext.Provider>
  );
}
