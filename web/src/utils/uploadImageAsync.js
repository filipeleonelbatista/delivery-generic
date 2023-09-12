import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../services/firebase-config";

export async function uploadImageAsync(file, path) {
  if (!file) return;

  const storageRef = ref(
    storage,
    `/${path}/${Date.now()}-${encodeURI(file.name)}`
  );
  await uploadBytesResumable(storageRef, file);

  return getDownloadURL(storageRef);
}
