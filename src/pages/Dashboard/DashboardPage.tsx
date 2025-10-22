import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { formatMoney } from "../../lib/format";
import { mockQuotes, mockSales } from "../../lib/mock";
import { useAuth } from "../../store/useAuth";
import { useCatalog } from "../../store/useCatalog";

export default function DashboardPage() {
  const role = useAuth((state) => state.role);
  const products = useCatalog((state) => state.products);
  const navigate = useNavigate();

  const todaySales = mockSales.filter((s) => s.date === "2024-10-21");
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.stockMin);
  const openQuotes = mockQuotes.filter((q) => q.status === "open");

  const latestSales = mockSales.slice(0, 5).map((sale) => ({
    ID: sale.id,
    Cliente: sale.customerName || "N/A",
    Total: formatMoney(sale.total),
    Fecha: sale.date,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
        <PageHeader
          title="Dashboard"
          subtitle={`Bienvenido, ${role === "admin" ? "Administrador" : "Empleado"}`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ventas Hoy</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{formatMoney(todayTotal)}</p>
            <p className="text-emerald-100 mt-2">{todaySales.length} transacciones</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ítems en Stock</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
            <p className="text-blue-100 mt-2">productos activos</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Stock Bajo</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{lowStockProducts.length}</p>
            <p className="text-red-100 mt-2">requieren reposición</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Cotizaciones Abiertas</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{openQuotes.length}</p>
            <p className="text-orange-100 mt-2">pendientes</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-600 to-gray-700 p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold">Últimas Ventas</h3>
                <p className="text-slate-200">Actividad reciente del POS</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/pos")}
                className="w-full sm:w-auto bg-white text-slate-700 hover:bg-slate-100 border-0 shadow-lg font-semibold"
              >
                Ir a POS
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <Table columns={["ID", "Cliente", "Total", "Fecha"]} data={latestSales} />
            </div>
          </div>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Análisis de Ventas</h3>
            <p className="text-purple-200">Tendencias y métricas</p>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
              <div className="text-center">
                <div className="text-6xl text-purple-300 mb-4">📊</div>
                <p className="text-purple-600 font-medium">Gráfico de ventas</p>
                <p className="text-purple-400 text-sm mt-1">Próximamente disponible</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
