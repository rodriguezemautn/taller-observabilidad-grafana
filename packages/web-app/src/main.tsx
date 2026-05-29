import { ChakraProvider, defaultSystem, Toaster, ToastRoot, ToastTitle, ToastDescription } from "@chakra-ui/react"
import type { ToastOptions } from "@ark-ui/react/toast"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { toaster } from "./api/toaster"

createRoot(document.getElementById("root")!).render(
  <ChakraProvider value={defaultSystem}>
    <App />
    <Toaster toaster={toaster}>
      {(toast: ToastOptions) => (
        <ToastRoot>
          <ToastTitle>{toast.title}</ToastTitle>
          {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
        </ToastRoot>
      )}
    </Toaster>
  </ChakraProvider>,
)
