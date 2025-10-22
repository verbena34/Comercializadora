import { BarChart2, Box, File, FileText, Home, ShoppingCart, User, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../store/useAuth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: <Home /> },
  { to: "/productos", label: "Productos", icon: <Box /> },
  { to: "/compras", label: "Compras", icon: <ShoppingCart />, adminOnly: true },
  { to: "/cotizaciones", label: "Cotizaciones", icon: <FileText /> },
  { to: "/pos", label: "POS", icon: <File /> },
  { to: "/fel", label: "FEL", icon: <FileText /> },
  { to: "/reportes", label: "Reportes", icon: <BarChart2 /> },
  { to: "/usuarios", label: "Usuarios", icon: <Users />, adminOnly: true },
  { to: "/perfil", label: "Perfil", icon: <User /> },
];

export default function Sidebar() {
  const role = useAuth((s) => s.role);

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        {items.map((i) => {
          if (i.adminOnly && role !== "admin") return null;
          return (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg ${
                  isActive ? "bg-primary-50 text-primary-700" : ""
                }`
              }
            >
              <span className="w-5 h-5 text-gray-600">{i.icon}</span>
              <span>{i.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
