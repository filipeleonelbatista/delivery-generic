import {
  Alert,
  AlertIcon,
  CheckCircleIcon,
  VStack,
} from "@gluestack-ui/themed";
import { createContext, useState } from "react";

export const ToastContext = createContext({});

export function ToastContextProvider(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState(null);
  const [autoHide, setAutoHide] = useState(6000);

  const addToast = ({ severity, message, title = null }) => {
    setTitle(title);
    setMessage(message);
    setSeverity(severity);
    setOpen(false);
    const valor =
      (message.split(/\s+/).filter((word) => word !== "").length / 50) * 60000;
    setAutoHide(valor);
  };

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  return (
    <ToastContext.Provider
      value={{
        addToast,
      }}
    >
      {open && (
        <Alert mx="$2.5" action={severity ?? "info"} variant="solid">
          <AlertIcon as={CheckCircleIcon} size="xl" mr="$3" />
          <VStack space="xs">
            {title && <AlertText fontWeight="$bold">{title}</AlertText>}
            {message && <AlertText>{message}</AlertText>}
          </VStack>
        </Alert>
      )}
      {props.children}
    </ToastContext.Provider>
  );
}
