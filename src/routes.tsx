import DashboardPage from "./pages/Dashboard/DashboardPage";
import FelPage from "./pages/InvoicesFel/FelPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import CustomersPage from "./pages/Customers/CustomersPage";
import ProductsPage from "./pages/Products/ProductsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import PurchasesPage from "./pages/Purchases/PurchasesPage";
import QuotesPage from "./pages/Quotes/QuotesPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import SalesPage from "./pages/Sales/SalesPage";
import UsersPage from "./pages/Users/UsersPage";
import CardPaymentPage from "./pages/CardPayment/CardPaymentPage";

const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/productos", element: <ProductsPage /> },
  { path: "/compras", element: <PurchasesPage /> },
  { path: "/cotizaciones", element: <QuotesPage /> },
  { path: "/clientes", element: <CustomersPage /> },
  { path: "/ventas", element: <SalesPage /> },
  { path: "/pago-tarjeta", element: <CardPaymentPage /> },
  { path: "/fel", element: <FelPage /> },
  { path: "/reportes", element: <ReportsPage /> },
  { path: "/usuarios", element: <UsersPage /> },
  { path: "/perfil", element: <ProfilePage /> },
];

export default routes;
