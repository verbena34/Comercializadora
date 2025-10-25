import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Topbar from "./components/common/Topbar";
import { ToastProvider } from "./components/ui/Toast";
import routes from "./routes";
import { useAuth } from "./store/useAuth";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

export default function App() {
  const role = useAuth((state) => state.role);

  // Si no hay usuario autenticado, mostrar solo las páginas de login y registro
  if (!role) {
    return (
      <ToastProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </ToastProvider>
    );
  }

  // Si hay usuario autenticado, mostrar la aplicación completa
  return (
    <ToastProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6">
            <Routes>
              {routes.filter(r => r.path !== "/login" && r.path !== "/register").map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Navigate to="/dashboard" />} />
              <Route path="/register" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
