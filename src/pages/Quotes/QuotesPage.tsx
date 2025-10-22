import { FileText, Plus, Printer, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import { useToast } from "../../components/ui/Toast";
import { formatDate, formatMoney } from "../../lib/format";
import { mockQuotes } from "../../lib/mock";
import { useCatalog } from "../../store/useCatalog";
import { Quote, QuoteItem } from "../../types/quote";

export default function QuotesPage() {
  const { products } = useCatalog();
  const toast = useToast();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState(mockQuotes);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Partial<Quote>>({
    customerName: "",
    validDays: 15,
    date: new Date().toISOString().split("T")[0],
    items: [],
    total: 0,
    status: "open",
  });
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const quotesTableData = quotes.map((q) => ({
    ID: q.id,
    Cliente: q.customerName,
    Fecha: formatDate(q.date),
    "Válida por": `${q.validDays} días`,
    Total: formatMoney(q.total),
    Estado: (
      <Badge color={q.status === "open" ? "gray" : q.status === "won" ? "green" : "red"}>
        {q.status === "open" ? "Abierta" : q.status === "won" ? "Ganada" : "Perdida"}
      </Badge>
    ),
    Acciones: (
      <div className="flex gap-1">
        <Button variant="ghost" onClick={() => editQuote(q)} title="Editar">
          <FileText size={16} />
        </Button>
        <Button variant="ghost" onClick={() => printQuote(q)} title="Imprimir">
          <Printer size={16} />
        </Button>
        {q.status === "open" && (
          <Button variant="ghost" onClick={() => convertToSale(q)} title="Convertir a Venta">
            <ShoppingCart size={16} />
          </Button>
        )}
      </div>
    ),
  }));

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  function editQuote(quote: Quote) {
    setCurrentQuote(quote);
    setShowQuoteModal(true);
  }

  function printQuote(quote: Quote) {
    toast.add(`Imprimiendo cotización ${quote.id}`);
  }

  function convertToSale(quote: Quote) {
    toast.add(`Convirtiendo cotización ${quote.id} a venta`);
    navigate("/pos", { state: { preloadedItems: quote.items } });
  }

  function addItemToQuote() {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const lineTotal = quantity * price - discount;
    const newItem: QuoteItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      price,
      discount,
      total: lineTotal,
    };

    const updatedItems = [...(currentQuote.items || []), newItem];
    const total = updatedItems.reduce((sum, item) => sum + item.total, 0);

    setCurrentQuote((prev) => ({
      ...prev,
      items: updatedItems,
      total,
    }));

    setSelectedProduct("");
    setQuantity(1);
    setPrice(0);
    setDiscount(0);
    setSearchProduct("");
  }

  function removeItemFromQuote(index: number) {
    const updatedItems = currentQuote.items?.filter((_, i) => i !== index) || [];
    const total = updatedItems.reduce((sum, item) => sum + item.total, 0);

    setCurrentQuote((prev) => ({
      ...prev,
      items: updatedItems,
      total,
    }));
  }

  function saveQuote() {
    const newQuote: Quote = {
      id: `Q${String(quotes.length + 1).padStart(3, "0")}`,
      customerName: currentQuote.customerName || "",
      validDays: currentQuote.validDays || 15,
      date: currentQuote.date || new Date().toISOString().split("T")[0],
      items: currentQuote.items || [],
      total: currentQuote.total || 0,
      status: "open",
    };

    setQuotes((prev) => [...prev, newQuote]);
    toast.add("Cotización guardada exitosamente");
    setShowQuoteModal(false);
    setCurrentQuote({
      customerName: "",
      validDays: 15,
      date: new Date().toISOString().split("T")[0],
      items: [],
      total: 0,
      status: "open",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 space-y-6 sm:space-y-8">
      <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
        <PageHeader title="Cotizaciones" subtitle="Gestión de presupuestos y cotizaciones" />
      </div>

      <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Cotizaciones Activas</h3>
              <p className="text-amber-100 mt-1">Gestión completa de presupuestos</p>
            </div>
            <Button
              onClick={() => setShowQuoteModal(true)}
              className="w-full lg:w-auto bg-white text-amber-600 hover:bg-amber-50 border-0 shadow-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              <Plus size={16} className="mr-2" />
              Nueva Cotización
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <div className="overflow-x-auto">
          <Table columns={Object.keys(quotesTableData[0] || {})} data={quotesTableData} />
        </div>
      </Card>

      <Modal
        open={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        title="Nueva Cotización"
      >
        <div className="space-y-8">
          {/* Información del cliente */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
            <h4 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
              Información del Cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Cliente</label>
                <Input
                  value={currentQuote.customerName || ""}
                  onChange={(e) =>
                    setCurrentQuote({ ...currentQuote, customerName: e.target.value })
                  }
                  placeholder="Nombre del cliente"
                  className="border-2 border-amber-200 focus:border-amber-500 rounded-xl shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Válida por (días)
                </label>
                <Input
                  type="number"
                  value={currentQuote.validDays || 15}
                  onChange={(e) =>
                    setCurrentQuote({ ...currentQuote, validDays: Number(e.target.value) })
                  }
                  min="1"
                  max="365"
                  className="border-2 border-amber-200 focus:border-amber-500 rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Agregar productos */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
            <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              Agregar Productos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-3 items-end">
              <div className="lg:col-span-4 space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Producto</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-emerald-400" size={16} />
                  <Input
                    placeholder="Buscar producto..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="pl-10 border-2 border-emerald-200 focus:border-emerald-500 rounded-xl shadow-sm"
                  />
                </div>
                {searchProduct && (
                  <div className="absolute z-10 w-full bg-white border-2 border-emerald-200 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-xl">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="p-3 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-emerald-100 last:border-b-0"
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setSearchProduct(product.name);
                          setPrice(product.price);
                        }}
                      >
                        <div className="font-medium text-slate-800">{product.name}</div>
                        <div className="text-sm text-slate-500">
                          SKU: {product.sku} - {formatMoney(product.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">Precio</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  step="0.01"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">Descuento</label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  step="0.01"
                />
              </div>
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium mb-1">Total</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  {formatMoney(quantity * price - discount)}
                </div>
              </div>
              <div className="lg:col-span-1 w-full sm:w-auto">
                <Button
                  onClick={addItemToQuote}
                  disabled={!selectedProduct}
                  className="w-full lg:w-auto"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          {currentQuote.items && currentQuote.items.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Productos en la Cotización</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentQuote.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded gap-2"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-600">
                        {item.quantity} x {formatMoney(item.price)}
                        {item.discount > 0 && ` - ${formatMoney(item.discount)} desc.`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatMoney(item.total)}</span>
                      <Button variant="ghost" onClick={() => removeItemFromQuote(index)}>
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatMoney(currentQuote.total || 0)}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowQuoteModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveQuote}
              disabled={!currentQuote.customerName || !currentQuote.items?.length}
              className="w-full sm:w-auto"
            >
              Guardar Cotización
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
