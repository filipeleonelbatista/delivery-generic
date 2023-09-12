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

export const BannersContext = createContext({});

export function BannersContextProvider(props) {
  const { setIsLoading } = useLoader();

  const [bannersList, setBannersList] = useState([]);

  const [selectedBanner, setSelectedBanner] = useState(false);

  async function getAllBanners() {
    const contactsRef = collection(db, "banners");
    const result = getDocs(query(contactsRef, orderBy("order", "desc")))
      .then((snap) => {
        let bannerList = [];
        snap.docs.forEach((doc) => {
          bannerList.push({ ...doc.data(), id: doc.id });
        });
        return bannerList;
      })
      .catch((error) => {
        console.log("getAllBanners error", error);
        return [];
      });

    return result;
  }

  async function getBannerByID(id) {
    const bannerRef = doc(db, "banners", id);
    const bannerSnap = await getDoc(bannerRef);
    const banner = bannerSnap.data();
    return banner;
  }

  async function updateBanner(data) {
    await setDoc(doc(db, "banners", data.id), data);

    await updateBannersList();
  }

  async function addBanner(data) {
    const bannerRef = collection(db, "banners");
    await addDoc(bannerRef, data);

    await updateBannersList();
  }

  async function handleDeleteBanner(id) {
    const response = confirm(
      "Deseja realmente deletar esse registro? Esta ação é irreverssível"
    );
    if (response) {
      //TODO: Verificar se existem produtos com a mesma banner e impedir a exclusão
      const banner = await getBannerByID(id);
      deleteImageFromStorage(banner.avatar);
      await deleteDoc(doc(db, "banners", id));
    }
    await updateBannersList();
  }

  const updateBannersList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllBanners();
    setBannersList(response);
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const executeAsync = async () => {
      await updateBannersList();
    };
    executeAsync();
  }, [updateBannersList]);

  return (
    <BannersContext.Provider
      value={{
        bannersList,
        selectedBanner,
        setSelectedBanner,
        updateBannersList,
        handleDeleteBanner,
        addBanner,
        updateBanner,
        getBannerByID,
      }}
    >
      {props.children}
    </BannersContext.Provider>
  );
}
