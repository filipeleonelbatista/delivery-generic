import dayjs from "dayjs";
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
  where,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCupons } from "../hooks/useCupons";
import { useLoader } from "../hooks/useLoader";
import { useToast } from "../hooks/useToast";
import { db } from "../services/firebase-config";

export const ShoppingCartContext = createContext({});

export function ShoppingCartContextProvider(props) {
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();
  const { cuponsList } = useCupons();

  const [productsList, setProductsList] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  const [selectedPaymentMethod, setselectedPaymentMethod] = useState(null);
  const [change, setChange] = useState('0,00');
  const [isDelivery, setIsDelivery] = useState("Entrega");
  const [cupom, setCupom] = useState(null);

  async function verifyCupom(cupom) {
    const response = cuponsList.filter(
      (item) => item.description.toUpperCase() === cupom.toUpperCase()
    );

    if (response.length > 0) {
      const dataAtual = dayjs();
      const startDate = dayjs(response[0].startDate);
      const endDate = dayjs(response[0].endDate);
      if (dataAtual.isAfter(startDate) && dataAtual.isBefore(endDate)) {
        setCupom(response[0]);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const totalShoppingCart = useMemo(() => {
    const soma = productsList.reduce(
      (total, objeto) => total + objeto.totalAmount,
      0
    );
    return soma;
  }, [productsList]);

  async function getClientByPhoneNumber(phoneNumber) {
    const clientesRef = collection(db, "clientes");
    const result = getDocs(
      query(clientesRef, where("phoneNumber", "==", phoneNumber))
    )
      .then((snap) => {
        let clientes = [];
        snap.docs.forEach((doc) => {
          clientes.push({ ...doc.data(), id: doc.id });
        });
        return clientes;
      })
      .catch((error) => {
        console.log("getClientByPhoneNumber error", error);
        return [];
      });

    return result;
  }

  async function addProductsToCart(data, quantity) {
    setProductsList([
      ...productsList,
      {
        quantity: quantity,
        productId: data.id,
        unityAmount: data.currentValue,
        totalAmount: data.currentValue * quantity,
        productObject: data,
      },
    ]);

    addToast({
      severity: "success",
      message: "Item adicionado!",
    });

    document.getElementById("shopping-cart-button-open-drawer").click();
  }

  const handleRemoveProductFromCart = (index) => {
    const itemsRestantes = productsList.filter(
      (item, currentIndex) => currentIndex !== index
    );

    setProductsList([...itemsRestantes]);
  };

  async function updateQuantity(index, action) {
    const updatedProductsList = [...productsList];
    const product = updatedProductsList[index];

    if (action === "adicionar") {
      product.quantity += 1;
      product.totalAmount = product.unityAmount * product.quantity;
    } else if (action === "remover" && product.quantity > 1) {
      product.quantity -= 1;
      product.totalAmount = product.unityAmount * product.quantity;
    }

    setProductsList([...updatedProductsList]);
  }

  async function createOrderFromSite(data) {
    if (data.clientId == "") {
      const clienteRef = collection(db, "clientes");
      const clientResponse = await addDoc(clienteRef, data.clientObject);
      data.clientId = clientResponse.id;
    }

    const orderRef = collection(db, "pedidos");
    const response = await addDoc(orderRef, data);

    return response;
  }

  useEffect(() => {
    const executeAsync = async () => { };
    executeAsync();
  }, []);

  return (
    <ShoppingCartContext.Provider
      value={{
        productsList,
        userInfo,
        setUserInfo,
        selectedPaymentMethod,
        setselectedPaymentMethod,
        addProductsToCart,
        handleRemoveProductFromCart,
        totalShoppingCart,
        updateQuantity,
        isDelivery,
        setIsDelivery,
        cupom,
        setCupom,
        verifyCupom,
        createOrderFromSite,
        getClientByPhoneNumber,
        setChange,
        change
      }}
    >
      {props.children}
    </ShoppingCartContext.Provider>
  );
}
