import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { routeTree } from "./router";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppInitializer } from "@/components/AppInitializer";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInitializer />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
