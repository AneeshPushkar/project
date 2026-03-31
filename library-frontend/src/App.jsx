import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import RoutesConfig from "./routes/routes";
import "./App.css";

function Layout() {
  const location = useLocation();

  // Hide sidebar & navbar on auth pages
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="app">
      {!hideLayout && <Sidebar />}

      <div className="main">
        {!hideLayout && <Navbar />}
        <RoutesConfig />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;