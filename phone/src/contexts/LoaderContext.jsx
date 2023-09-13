import { Modal, ModalBackdrop, Spinner, VStack } from "@gluestack-ui/themed";
import { createContext, useState } from "react";

export const LoaderContext = createContext({});

export function LoaderContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      <Modal isOpen={isLoading}>
        <ModalBackdrop />
        <VStack
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size="large" />
        </VStack>
      </Modal>
      {props.children}
    </LoaderContext.Provider>
  );
}
