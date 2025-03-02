import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.js";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ToastContainer />
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
