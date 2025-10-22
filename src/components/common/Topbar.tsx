import { Search, User } from "lucide-react";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../store/useAuth";

export default function Topbar() {
  const role = useAuth((s) => s.role);
  const setRole = useAuth((s) => s.setRole);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <img src={logo} alt="logo" className="h-8" />
        <div className="relative">
          <input placeholder="Buscar..." className="pl-10 pr-4 h-10 rounded-xl border bg-gray-50" />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={role}
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
