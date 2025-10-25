import { Search, User } from "lucide-react";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../store/useAuth";

export default function Topbar() {
  const role = useAuth((s) => s.role);
  const setRole = useAuth((s) => s.setRole);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Emprende360" className="h-8" />
          <div className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            EMPRENDE360
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={role || "employee"}
          onChange={(e) => setRole(e.target.value as any)}
          className="border rounded-lg p-2 bg-white"
        >
          <option value="admin">Admin</option>
          <option value="employee">Empleado</option>
        </select>
        <div className="flex items-center gap-2">
          <User className="text-gray-500" />
          <div className="text-sm">Juan Pérez</div>
        </div>
      </div>
    </header>
  );
}
