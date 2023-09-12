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
import deleteImageFromStorage from "../utils/deleteImageFromStorage";

export const ProductsContext = createContext({});

export function ProductsContextProvider(props) {
  const { setIsLoading } = useLoader();

  const [productsList, setProductsList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(false);

  async function getAllProducts() {
    const productsRef = collection(db, "produtos");
    const result = getDocs(query(productsRef, orderBy("name", "desc")))
      .then((snap) => {
        let products = [];
        snap.docs.forEach((doc) => {
          products.push({ ...doc.data(), id: doc.id });
        });
        return products;
      })
      .catch((error) => {
        console.log("getAllProducts error", error);
        return [];
      });

    return result;
  }

  async function getProductByID(id) {
    const productRef = doc(db, "produtos", id);
    const produtosnap = await getDoc(productRef);
    const categoria = produtosnap.data();
    return categoria;
  }

  async function updateProduct(data) {
    await setDoc(doc(db, "produtos", data.id), data);

    await updateProductsList();
  }

  async function addProduct(data) {
    const productRef = collection(db, "produtos");
    await addDoc(productRef, data);

    await updateProductsList();
  }

  async function handleDeleteProduct(id) {
    const response = confirm(
      "Deseja realmente deletar esse registro? Esta ação é irreverssível"
    );
    if (response) {
      //TODO: Verificar se existem pedidos com o produto e impedir a exclusão
      const product = await getProductByID(id);
      deleteImageFromStorage(product.avatar);
      await deleteDoc(doc(db, "produtos", id));
    }
    await updateProductsList();
  }

  const updateProductsList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllProducts();
    setProductsList(response);
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const executeAsync = async () => {
      await updateProductsList();
    };
    executeAsync();
  }, [updateProductsList]);
  return (
    <ProductsContext.Provider
      value={{
        productsList,
        selectedProduct,
        setSelectedProduct,
        updateProductsList,
        handleDeleteProduct,
        addProduct,
        updateProduct,
        getProductByID,
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
}
