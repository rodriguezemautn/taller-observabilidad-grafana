import { ChakraProvider, defaultSystem, Toaster } from "@chakra-ui/react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { toaster } from "./api/toaster"

createRoot(document.getElementById("root")!).render(
  <ChakraProvider value={defaultSystem}>
    <App />
    <Toaster toaster={toaster} />
  </ChakraProvider>,
)
