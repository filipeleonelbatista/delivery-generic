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

export const CategoriesContext = createContext({});

export function CategoriesContextProvider(props) {
  const { setIsLoading } = useLoader();

  const [categoriesList, setCategoriesList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(false);

  async function getAllCategories() {
    const contactsRef = collection(db, "categorias");
    const result = getDocs(query(contactsRef, orderBy("order", "desc")))
      .then((snap) => {
        let contactList = [];
        snap.docs.forEach((doc) => {
          contactList.push({ ...doc.data(), id: doc.id });
        });
        return contactList;
      })
      .catch((error) => {
        console.log("getAllCategories error", error);
        return [];
      });

    return result;
  }

  async function getCategoryByID(id) {
    const categoryRef = doc(db, "categorias", id);
    const categoriaSnap = await getDoc(categoryRef);
    const categoria = categoriaSnap.data();
    return categoria;
  }

  async function updateCategory(data) {
    await setDoc(doc(db, "categorias", data.id), data);

    await updateCategoriesList();
  }

  async function addCategory(data) {
    const categoryRef = collection(db, "categorias");
    await addDoc(categoryRef, data);

    await updateCategoriesList();
  }

  async function handleDeleteCategory(id) {
    const response = confirm(
      "Deseja realmente deletar esse registro? Esta ação é irreverssível"
    );
    if (response) {
      //TODO: Verificar se existem produtos com a mesma categoria e impedir a exclusão
      const category = await getCategoryByID(id);
      deleteImageFromStorage(category.avatar);
      await deleteDoc(doc(db, "categorias", id));
    }
    await updateCategoriesList();
  }

  const updateCategoriesList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllCategories();
    setCategoriesList(response);
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const executeAsync = async () => {
      await updateCategoriesList();
    };
    executeAsync();
  }, [updateCategoriesList]);

  return (
    <CategoriesContext.Provider
      value={{
        categoriesList,
        selectedCategory,
        setSelectedCategory,
        updateCategoriesList,
        handleDeleteCategory,
        addCategory,
        updateCategory,
        getCategoryByID,
      }}
    >
      {props.children}
    </CategoriesContext.Provider>
  );
}
