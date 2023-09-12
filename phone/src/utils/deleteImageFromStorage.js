import { deleteObject, ref } from "firebase/storage";
import { storage } from "../services/firebase-config";

export default function deleteImageFromStorage(imagePath) {
  if (!imagePath) return;

  const imageRef = ref(storage, imagePath);

  return deleteObject(imageRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log("deleteImageFromStorage error", error);
      return false;
    });
}
