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
} from "firebase/firestore";
import { createContext, useCallback, useEffect, useState } from "react";
import { useCupons } from "../hooks/useCupons";
import { useLoader } from "../hooks/useLoader";
import { db } from "../services/firebase-config";

export const OrderContext = createContext({});

export function OrderContextProvider(props) {
  const { setIsLoading } = useLoader();

  const { cuponsList } = useCupons();

  const [ordersList, setOrdersList] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(false);

  const orderStatus = [
    { name: "Aberto", flow: ["Entrega", "Retirada"] },
    { name: "Aceito", flow: ["Entrega", "Retirada"] },
    { name: "Preparando Pedido", flow: ["Entrega", "Retirada"] },
    { name: "Saiu para entrega", flow: ["Entrega"] },
    { name: "Aguardando Retirada", flow: ["Retirada"] },
    { name: "Entregue", flow: ["Entrega", "Retirada"] },
    { name: "Finalizado", flow: ["Entrega", "Retirada"] },
    { name: "Cancelado", flow: ["Entrega", "Retirada"] },
  ];

  async function verifyCupom(cupom) {
    const response = cuponsList.filter(
      (item) => item.description.toUpperCase() === cupom.toUpperCase()
    );

    if (response.length > 0) {
      const dataAtual = dayjs();
      const startDate = dayjs(response[0].startDate);
      const endDate = dayjs(response[0].endDate);
      if (dataAtual.isAfter(startDate) && dataAtual.isBefore(endDate)) {
        return response[0];
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  async function handleCancelOrder(currentOrder) {
    console.log;
    const motivo = prompt("Digite um motivo para o cancelamento:");
    const updatedValue = {
      ...currentOrder,
      status: "Cancelado",
      observation: `${
        currentOrder.observation
      }\n\nMotivo do cancelamento: ${motivo}\n\n Cancelado em: ${dayjs().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      updatedAt: new Date(Date.now()).getTime(),
    };
    await updateOrder(updatedValue);
  }

  async function handleUpdateStatus(currentOrder, direction) {
    const atualIndex = orderStatus.findIndex(
      (item) => item.name === currentOrder?.status
    );

    // TODO MENSAGERIA: Não mando nada pelo email, então pensar em uma integração com o whatsapp
    if (direction === "next") {
      if (atualIndex <= orderStatus.length) {
        if (orderStatus[atualIndex + 1].name === "Cancelado") {
          const motivo = prompt("Digite um motivo para o cancelamento:");
          currentOrder.observation = `${
            currentOrder.observation
          }\n\nMotivo do cancelamento: ${motivo}\n\n Cancelado em: ${dayjs().format(
            "DD/MM/YYYY HH:mm:ss"
          )}`;
        }
        currentOrder.status = orderStatus[atualIndex + 1].name;
      }
    }

    if (direction === "back") {
      if (atualIndex >= 0) {
        currentOrder.status = orderStatus[atualIndex - 1].name;
      }
    }

    const updatedValue = {
      ...currentOrder,
      updatedAt: new Date(Date.now()).getTime(),
    };
    console.log("updatedValue", updatedValue);

    await updateOrder(updatedValue);
  }

  async function getAllOrders() {
    const orderRef = collection(db, "pedidos");
    const result = getDocs(query(orderRef, orderBy("createdAt", "desc")))
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

  const updateOrdersList = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllOrders();
    setOrdersList(response);
    setIsLoading(false);
  }, [setIsLoading]);

  async function getOrdersByID(id) {
    const orderRef = doc(db, "pedidos", id);
    const orderSnap = await getDoc(orderRef);
    const order = orderSnap.data();
    return order;
  }

  async function updateOrder(data) {
    await setDoc(doc(db, "pedidos", data.id), data);

    await updateOrdersList();
  }

  async function addOrder(data) {
    const orderRef = collection(db, "pedidos");
    await addDoc(orderRef, data);

    await updateOrdersList();
  }

  async function handleDeleteOrder(id) {
    const response = confirm(
      "Deseja realmente deletar esse registro? Esta ação é irreverssível"
    );
    if (response) {
      await deleteDoc(doc(db, "pedidos", id));
    }
    await updateOrdersList();
  }

  useEffect(() => {
    const executeAsync = async () => {
      await updateOrdersList();
    };
    executeAsync();
  }, [updateOrdersList]);

  return (
    <OrderContext.Provider
      value={{
        ordersList,
        selectedOrder,
        setSelectedOrder,
        updateOrdersList,
        handleDeleteOrder,
        addOrder,
        updateOrder,
        getOrdersByID,
        orderStatus,
        handleUpdateStatus,
        handleCancelOrder,
        verifyCupom,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
}
