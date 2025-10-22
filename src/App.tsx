import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Topbar from "./components/common/Topbar";
import { ToastProvider } from "./components/ui/Toast";
import routes from "./routes";
import { useAuth } from "./store/useAuth";

export default function App() {
  const role = useAuth((state) => state.role);

  return (
    <ToastProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6">
            <Routes>
              {routes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
