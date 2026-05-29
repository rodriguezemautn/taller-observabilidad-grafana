import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { createRoot } from "react-dom/client"
import { App } from "./App"

createRoot(document.getElementById("root")!).render(
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>,
)
