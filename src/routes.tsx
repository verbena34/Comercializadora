import DashboardPage from "./pages/Dashboard/DashboardPage";
import FelPage from "./pages/InvoicesFel/FelPage";
import LoginPage from "./pages/Login/LoginPage";
import PosPage from "./pages/Pos/PosPage";
import ProductsPage from "./pages/Products/ProductsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import PurchasesPage from "./pages/Purchases/PurchasesPage";
import QuotesPage from "./pages/Quotes/QuotesPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import UsersPage from "./pages/Users/UsersPage";

const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/productos", element: <ProductsPage /> },
  { path: "/compras", element: <PurchasesPage /> },
  { path: "/cotizaciones", element: <QuotesPage /> },
  { path: "/pos", element: <PosPage /> },
  { path: "/fel", element: <FelPage /> },
  { path: "/reportes", element: <ReportsPage /> },
  { path: "/usuarios", element: <UsersPage /> },
  { path: "/perfil", element: <ProfilePage /> },
];

export default routes;
