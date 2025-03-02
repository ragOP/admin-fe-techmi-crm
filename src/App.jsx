import Router from "./router";
import { ThemeProvider } from "./theme";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router />
      </ThemeProvider>
    </>
  );
}

export default App;
