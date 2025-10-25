import { Copy, CreditCard, DollarSign, FileText, Package, Plus, Printer, Search, ShoppingCart, Eye, X, Download, Calendar, Clock, User, List, Wallet, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import { useToast } from "../../components/ui/Toast";
import { formatDate, formatMoney, formatPhone } from "../../lib/format";
import { useCatalog } from "../../store/useCatalog";
import { useCustomers } from "../../store/useCustomers";
import { Quote, QuoteItem } from "../../types/quote";

export default function QuotesPage() {
  const { products } = useCatalog();
  const { customers } = useCustomers();
  const toast = useToast();
  const navigate = useNavigate();

  // Initialize with empty quotes to show empty state first
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showProductSelectorModal, setShowProductSelectorModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentQuote, setCurrentQuote] = useState<Partial<Quote & { customerPhone?: string; customerId?: string }>>({
    customerName: "",
    customerPhone: "",
    customerId: "",
    validDays: 15,
    date: new Date().toISOString().split("T")[0],
    items: [],
    total: 0,
    status: "open",
  });
  
  const [searchProduct, setSearchProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [globalDiscountAmount, setGlobalDiscountAmount] = useState(0);

  // Manual product fields for when no catalog exists
  const [manualProduct, setManualProduct] = useState({
    name: "",
    price: 0,
  });

  // Product selector tab state
  const [productSelectorTab, setProductSelectorTab] = useState<"catalog" | "manual">("catalog");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  function getStatusBadge(status: string, validDays: number, date: string) {
    const isExpired = new Date() > new Date(new Date(date).getTime() + validDays * 24 * 60 * 60 * 1000);
    
    if (isExpired && status === "open") {
      return <Badge color="red">Vencida</Badge>;
    }
    
    switch (status) {
      case "open":
        return <Badge color="blue">Abierta</Badge>;
      case "won":
        return <Badge color="green">Ganada</Badge>;
      case "lost":
        return <Badge color="red">Perdida</Badge>;
      default:
        return <Badge color="gray">Desconocida</Badge>;
    }
  }

  function getTotalItems(items: QuoteItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  function formatPhoneNumber(phone: string): string {
    // Basic phone formatting for Guatemala
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    return phone;
  }

  function convertToSale(quote: Quote) {
    // Navigate to sales page with quote data
    navigate('/ventas', {
      state: {
        fromQuote: true,
        quoteData: quote
      }
    });
    setShowPreviewModal(false);
    toast.add(`Cotización ${quote.id} convertida a venta`);
  }

  function openQuotePreview(quote: Quote) {
    setPreviewQuote(quote);
    setShowPreviewModal(true);
  }

  function duplicateQuote(quote: Quote) {
    const duplicatedQuote = {
      ...quote,
      customerName: `${quote.customerName} (Copia)`,
      date: new Date().toISOString().split("T")[0],
      status: "open" as const,
    };
    delete (duplicatedQuote as any).id;
    setCurrentQuote(duplicatedQuote);
    setEditingQuote(null);
    setShowQuoteModal(true);
    toast.add("Cotización duplicada. Puede editarla antes de guardar.");
  }

  function editQuote(quote: Quote) {
    setCurrentQuote(quote);
    setEditingQuote(quote);
    setShowQuoteModal(true);
  }

  function generatePDF(quote: Quote) {
    // Create PDF content
    const pdfContent = generateQuotePDF(quote);
    
    // Create a blob and download link
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cotizacion_${quote.id}_${quote.customerName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.add(`PDF de cotización ${quote.id} generado exitosamente`);
  }

  function generateQuotePDF(quote: Quote): string {
    const currentDate = new Date().toLocaleDateString('es-GT');
    const validUntil = new Date(new Date(quote.date).getTime() + quote.validDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-GT');
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización ${quote.id} - Emprende360</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; color: #1e293b; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 4px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: 900; color: #3b82f6; margin-bottom: 8px; letter-spacing: -1px; }
        .subtitle { color: #64748b; font-size: 16px; font-weight: 500; }
        .quote-title { font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-card { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; border-left: 6px solid #3b82f6; }
        .info-title { font-weight: 700; color: #334155; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { color: #1e293b; font-size: 18px; font-weight: 600; }
        .table { width: 100%; border-collapse: collapse; margin: 30px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .table th { padding: 20px 16px; text-align: left; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .table td { padding: 16px; border-bottom: 1px solid #e2e8f0; }
        .table tr:nth-child(even) { background: #f8fafc; }
        .table tr:hover { background: #f1f5f9; }
        .total-section { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 12px; margin-top: 30px; border: 2px solid #e2e8f0; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; }
        .total-final { font-size: 24px; font-weight: 900; color: #3b82f6; border-top: 3px solid #3b82f6; padding-top: 20px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0; color: #64748b; }
        .footer h4 { color: #3b82f6; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .footer p { margin: 4px 0; }
        @media print { body { background: white; } .container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EMPRENDE360</div>
            <div class="subtitle">Gestión Comercial Integral • Ferretería</div>
            <h2 class="quote-title">COTIZACIÓN ${quote.id}</h2>
        </div>
        
        <div class="info-grid">
            <div class="info-card">
                <div class="info-title">Cliente</div>
                <div class="info-value">${quote.customerName}</div>
            </div>
            <div class="info-card">
                <div class="info-title">Fecha de Emisión</div>
                <div class="info-value">${currentDate}</div>
            </div>
            <div class="info-card">
                <div class="info-title">Válida Hasta</div>
                <div class="info-value">${validUntil}</div>
            </div>
            <div class="info-card">
                <div class="info-title">Estado</div>
                <div class="info-value" style="color: #3b82f6;">Abierta</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Descuento</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${quote.items.map(item => `
                    <tr>
                        <td style="font-weight: 600;">${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${formatMoney(item.price)}</td>
                        <td>${item.discount > 0 ? formatMoney(item.discount) : '-'}</td>
                        <td style="font-weight: 700; color: #3b82f6;">${formatMoney(item.total)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span style="font-weight: 600;">Subtotal:</span>
                <span style="font-weight: 700;">${formatMoney(quote.total)}</span>
            </div>
            <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>${formatMoney(quote.total)}</span>
            </div>
        </div>

        <div class="footer">
            <h4>EMPRENDE360</h4>
            <p>Gestión Comercial Integral • Ferretería</p>
            <p>Esta cotización es válida por ${quote.validDays} días desde la fecha de emisión.</p>
            <p style="font-weight: 600; margin-top: 20px;">Generado el ${currentDate}</p>
        </div>
    </div>
</body>
</html>`;
  }

  function printQuote(quote: Quote) {
    const pdfContent = generateQuotePDF(quote);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    toast.add(`Imprimiendo cotización ${quote.id}`);
  }

  function openProductSelector() {
    setShowProductSelectorModal(true);
    setSearchProduct("");
    setProductSelectorTab(products.length > 0 ? "catalog" : "manual");
  }

  function selectProductFromModal(product: any) {
    const lineTotal = quantity * product.price - discount;
    const newItem: QuoteItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
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

    setShowProductSelectorModal(false);
    setQuantity(1);
    setDiscount(0);
    toast.add(`${product.name} agregado a la cotización`);
  }

  function addManualProduct() {
    if (!manualProduct.name || manualProduct.price <= 0) {
      toast.add("Complete el nombre y precio del producto", "error");
      return;
    }

    const lineTotal = quantity * manualProduct.price - discount;
    const newItem: QuoteItem = {
      productId: `manual-${Date.now()}`,
      productName: manualProduct.name,
      quantity,
      price: manualProduct.price,
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

    setManualProduct({ name: "", price: 0 });
    setQuantity(1);
    setDiscount(0);
    setShowProductSelectorModal(false);
    toast.add(`${newItem.productName} agregado a la cotización`);
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

  function validateQuoteForm(): boolean {
    if (!currentQuote.customerName || currentQuote.customerName.length < 3) {
      toast.add("El nombre del cliente es requerido (mínimo 3 caracteres)", "error");
      return false;
    }
    if (!currentQuote.items || currentQuote.items.length === 0) {
      toast.add("Debe agregar al menos un producto", "error");
      return false;
    }
    if (currentQuote.validDays && (currentQuote.validDays < 1 || currentQuote.validDays > 90)) {
      toast.add("La vigencia debe estar entre 1 y 90 días", "error");
      return false;
    }
    return true;
  }

  // Solo guardar cotización
  async function saveQuoteOnly() {
    if (!validateQuoteForm()) return;

    setIsLoading(true);
    
    try {
      const quoteToSave: Quote = {
        id: editingQuote?.id || `Q${String(quotes.length + 1).padStart(3, "0")}`,
        customerName: currentQuote.customerName || "",
        validDays: currentQuote.validDays || 15,
        date: currentQuote.date || new Date().toISOString().split("T")[0],
        items: currentQuote.items || [],
        total: Math.max(0, (currentQuote.total || 0) - globalDiscountAmount),
        status: "open",
      };

      if (editingQuote) {
        setQuotes((prev) => prev.map(q => q.id === editingQuote.id ? quoteToSave : q));
        toast.add("Cotización actualizada exitosamente");
      } else {
        setQuotes((prev) => [...prev, quoteToSave]);
        toast.add("Cotización guardada exitosamente");
      }

      resetQuoteForm();
      setShowQuoteModal(false);
    } catch (error) {
      toast.add("Error al guardar la cotización", "error");
    } finally {
      setIsLoading(false);
    }
  }

  // Guardar y generar PDF
  async function saveAndGeneratePDF() {
    if (!validateQuoteForm()) return;

    setIsLoading(true);
    
    try {
      const quoteToSave: Quote = {
        id: editingQuote?.id || `Q${String(quotes.length + 1).padStart(3, "0")}`,
        customerName: currentQuote.customerName || "",
        validDays: currentQuote.validDays || 15,
        date: currentQuote.date || new Date().toISOString().split("T")[0],
        items: currentQuote.items || [],
        total: Math.max(0, (currentQuote.total || 0) - globalDiscountAmount),
        status: "open",
      };

      if (editingQuote) {
        setQuotes((prev) => prev.map(q => q.id === editingQuote.id ? quoteToSave : q));
        toast.add("Cotización actualizada exitosamente");
      } else {
        setQuotes((prev) => [...prev, quoteToSave]);
        toast.add("Cotización guardada exitosamente");
      }

      // Generate PDF after saving
      setTimeout(() => {
        generatePDF(quoteToSave);
      }, 500);

      resetQuoteForm();
      setShowQuoteModal(false);
    } catch (error) {
      toast.add("Error al guardar la cotización", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function resetQuoteForm() {
    setCurrentQuote({
      customerName: "",
      customerPhone: "",
      customerId: "",
      validDays: 15,
      date: new Date().toISOString().split("T")[0],
      items: [],
      total: 0,
      status: "open",
    });
    setEditingQuote(null);
    setGlobalDiscountAmount(0);
  }

  function handleCustomerSelect(customerId: string) {
    if (customerId) {
      const selectedCustomer = customers.find(c => c.id === customerId);
      if (selectedCustomer) {
        setCurrentQuote({
          ...currentQuote,
          customerId: selectedCustomer.id,
          customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
          customerPhone: selectedCustomer.phone,
        });
      }
    } else {
      // Clear customer selection
      setCurrentQuote({
        ...currentQuote,
        customerId: "",
        customerName: "",
        customerPhone: "",
      });
    }
  }

  function getModalTitle(): string {
    return editingQuote ? "Editar cotización" : "Nueva cotización";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
        <PageHeader title="Cotizaciones" subtitle="Gestión integral de cotizaciones para clientes" />
      </div>

      {/* Enhanced Header Section */}
      <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">📋 Gestión de Cotizaciones</h3>
              <p className="text-blue-100 text-lg">Crea, edita y convierte cotizaciones a ventas</p>
              <div className="flex items-center gap-4 text-blue-200 text-sm">
                <span>📊 {quotes.length} cotizaciones</span>
                <span>•</span>
                <span>📈 {quotes.filter(q => q.status === 'open').length} activas</span>
              </div>
            </div>
            <Button
              onClick={() => {
                resetQuoteForm();
                setShowQuoteModal(true);
              }}
              className="w-full lg:w-auto bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={20} className="mr-3" />
              ✨ Nueva Cotización
            </Button>
          </div>
        </div>
      </Card>

      {/* Enhanced Quotes Grid or Empty State */}
      {quotes.length === 0 ? (
        <Card className="text-center py-20 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <div className="max-w-lg mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
              <FileText size={48} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 ¡Comienza tu primera cotización!</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Crea cotizaciones profesionales para tus clientes y conviértelas en ventas de manera sencilla
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-blue-600 font-semibold">📝 Crear</div>
                <div className="text-gray-600">Cotizaciones detalladas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-green-600 font-semibold">📄 Generar</div>
                <div className="text-gray-600">PDF profesional</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-purple-600 font-semibold">🛒 Convertir</div>
                <div className="text-gray-600">A venta directamente</div>
              </div>
            </div>
            <Button
              onClick={() => {
                resetQuoteForm();
                setShowQuoteModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus size={24} className="mr-3" />
              🚀 Crear Primera Cotización
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <Card key={quote.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
              {/* Enhanced Quote Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-100 transition-colors">
                      {quote.customerName}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-200 text-sm">
                      <FileText size={14} />
                      <span>ID: {quote.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(quote.status, quote.validDays, quote.date)}
                  </div>
                </div>
                
                {/* Enhanced Quote Summary */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {formatMoney(quote.total)}
                      </div>
                      <div className="text-blue-100 text-sm">💰 Total cotización</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-lg font-bold text-white">
                        <Package size={16} />
                        {getTotalItems(quote.items)}
                      </div>
                      <div className="text-blue-100 text-sm">
                        📦 {quote.items.length} productos
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} className="text-blue-500" />
                    <span>📅 {formatDate(quote.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-purple-500" />
                    <span>⏰ {quote.validDays} días</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openQuotePreview(quote)}
                      className="w-full hover:bg-blue-50 hover:text-blue-600 border border-blue-200"
                    >
                      <Eye size={16} className="mr-2" />
                      👁️ Vista Previa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generatePDF(quote)}
                      className="w-full hover:bg-purple-50 hover:text-purple-600 border border-purple-200"
                    >
                      <Download size={16} className="mr-2" />
                      📄 Descargar PDF
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editQuote(quote)}
                      className="w-full hover:bg-amber-50 hover:text-amber-600 border border-amber-200"
                    >
                      <FileText size={16} className="mr-2" />
                      ✏️ Editar
                    </Button>
                    {quote.status === "open" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => convertToSale(quote)}
                        className="w-full hover:bg-emerald-50 hover:text-emerald-600 border border-emerald-200 font-semibold"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        🛒 A Venta
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Quote Preview Modal */}
      <Modal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={`👁️ Vista previa - ${previewQuote?.id || ''}`}
      >
        {previewQuote && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <User size={20} className="mr-3" />
                📋 Información de la Cotización
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">👤 Cliente</label>
                  <p className="text-lg font-semibold text-gray-900">{previewQuote.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">📊 Estado</label>
                  <div className="mt-1">
                    {getStatusBadge(previewQuote.status, previewQuote.validDays, previewQuote.date)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">📅 Fecha de creación</label>
                  <p className="text-gray-900">{formatDate(previewQuote.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">⏰ Válida por</label>
                  <p className="text-gray-900">{previewQuote.validDays} días</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Package size={20} className="mr-3" />
                📦 Productos ({getTotalItems(previewQuote.items)} items)
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {previewQuote.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-white rounded-lg border border-green-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.productName}</div>
                      <div className="text-sm text-gray-600">
                        {item.quantity} x {formatMoney(item.price)}
                        {item.discount > 0 && ` - ${formatMoney(item.discount)} desc.`}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatMoney(item.total)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-green-200 mt-4 pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-green-700 bg-green-100 p-4 rounded-xl">
                  <span>💰 Total:</span>
                  <span>{formatMoney(previewQuote.total)}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => generatePDF(previewQuote)}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold py-3"
              >
                <Download size={16} className="mr-2" />
                📄 Descargar PDF
              </Button>
              <Button
                onClick={() => {
                  setShowPreviewModal(false);
                  editQuote(previewQuote);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold py-3"
              >
                <FileText size={16} className="mr-2" />
                ✏️ Editar
              </Button>
              {previewQuote.status === "open" && (
                <Button
                  onClick={() => convertToSale(previewQuote)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold py-3"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  🛒 A Venta
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Quote Modal */}
      <Modal
        open={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        title={getModalTitle()}
      >
        <div className="space-y-8">
          {/* Customer Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <User size={20} className="mr-3" />
              👤 Información del Cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Seleccionar cliente registrado
                </label>
                <Select
                  value={currentQuote.customerId || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleCustomerSelect(e.target.value)
                  }
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm"
                >
                  <option value="">Seleccionar cliente existente...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} - {formatPhone(customer.phone)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/clientes')}
                  className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl"
                >
                  <Plus size={16} className="mr-2" />
                  Registrar nuevo cliente
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Nombre del cliente <span className="text-red-500">*</span>
                </label>
                <Input
                  value={currentQuote.customerName || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentQuote({ ...currentQuote, customerName: e.target.value })
                  }
                  placeholder="Ingrese el nombre del cliente"
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Número de teléfono
                </label>
                <Input
                  value={currentQuote.customerPhone || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setCurrentQuote({ ...currentQuote, customerPhone: value });
                  }}
                  placeholder="12345678"
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm"
                  maxLength={8}
                />
                {currentQuote.customerPhone && (
                  <p className="text-sm text-gray-600">
                    Formato: {formatPhoneNumber(currentQuote.customerPhone)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Válida por (días)
                </label>
                <Input
                  type="number"
                  value={currentQuote.validDays || 15}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentQuote({ ...currentQuote, validDays: Math.max(1, Math.min(90, Number(e.target.value) || 15)) })
                  }
                  min="1"
                  max="90"
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-purple-900 flex items-center">
                <Package size={20} className="mr-3" />
                📦 Productos de la cotización
              </h4>
              <Button
                onClick={openProductSelector}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} className="mr-2" />
                ➕ Agregar Producto
              </Button>
            </div>
            
            {/* Products List */}
            {currentQuote.items && currentQuote.items.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {currentQuote.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-xl border border-purple-100 shadow-sm gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{item.productName}</div>
                      <div className="text-sm text-slate-600">
                        {item.quantity} x {formatMoney(item.price)}
                        {item.discount > 0 && ` - ${formatMoney(item.discount)} desc.`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-purple-600">{formatMoney(item.total)}</span>
                      <Button 
                        variant="ghost" 
                        onClick={() => removeItemFromQuote(index)}
                        className="text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Discount Section */}
            {currentQuote.items && currentQuote.items.length > 0 && (
              <div className="border-t border-purple-200 pt-4 space-y-4">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <h5 className="text-sm font-semibold text-yellow-900 mb-3 flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    💰 Descuento Global
                  </h5>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-yellow-800 mb-1">
                        Descuento en Quetzales
                      </label>
                      <Input
                        type="number"
                        value={globalDiscountAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalDiscountAmount(Number(e.target.value))}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="border-2 border-yellow-300 focus:border-yellow-500 rounded-lg"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-yellow-700">Descuento aplicado:</div>
                      <div className="text-lg font-bold text-yellow-600">
                        {formatMoney(globalDiscountAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Total Section */}
            {currentQuote.items && currentQuote.items.length > 0 && (
              <div className="border-t border-purple-200 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-purple-800">Subtotal:</span>
                    <span className="text-lg font-semibold text-purple-600">
                      {formatMoney(currentQuote.total || 0)}
                    </span>
                  </div>
                  {globalDiscountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-yellow-800">Descuento:</span>
                      <span className="text-lg font-semibold text-yellow-600">
                        - {formatMoney(globalDiscountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-purple-200 pt-3">
                    <div className="flex justify-between items-center bg-purple-100 p-4 rounded-xl">
                      <div>
                        <span className="text-xl font-bold text-purple-900">💰 Total Final:</span>
                        <div className="text-sm text-purple-700">
                          {getTotalItems(currentQuote.items)} items • {currentQuote.items.length} productos
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatMoney(Math.max(0, (currentQuote.total || 0) - globalDiscountAmount))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State for Products */}
            {(!currentQuote.items || currentQuote.items.length === 0) && (
              <div className="text-center py-8 border-2 border-dashed border-purple-200 rounded-xl">
                <Package size={48} className="mx-auto text-purple-400 mb-4" />
                <p className="text-purple-700 font-medium mb-2">No hay productos agregados</p>
                <p className="text-purple-600 text-sm">
                  Agregue productos del catálogo o cree líneas manuales
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => setShowQuoteModal(false)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all duration-200"
              disabled={isLoading}
            >
              ❌ Cancelar
            </Button>
            <Button
              onClick={saveQuoteOnly}
              disabled={!currentQuote.customerName || !currentQuote.items?.length || isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  💾 {editingQuote ? "Actualizar" : "Solo Guardar"}
                </>
              )}
            </Button>
            <Button
              onClick={saveAndGeneratePDF}
              disabled={!currentQuote.customerName || !currentQuote.items?.length || isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  📄 Guardar y Generar PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enhanced Product Selector Modal */}
      <Modal
        open={showProductSelectorModal}
        onClose={() => setShowProductSelectorModal(false)}
        title="➕ Agregar Producto"
      >
        <div className="space-y-6">
          {/* Enhanced Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-xl p-1">
            <button
              onClick={() => setProductSelectorTab("catalog")}
              className={`flex-1 px-4 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                productSelectorTab === "catalog" && products.length > 0
                  ? 'bg-blue-500 text-white shadow-lg'
                  : products.length > 0
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              disabled={products.length === 0}
            >
              📦 Del Catálogo ({products.length})
            </button>
            <button
              onClick={() => setProductSelectorTab("manual")}
              className={`flex-1 px-4 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                productSelectorTab === "manual"
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              ✏️ Línea Manual
            </button>
          </div>

          {/* Quantity and Discount Inputs */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">📊 Cantidad</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                min="1"
                className="border-2 border-slate-200 focus:border-blue-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">💰 Descuento (Q)</label>
              <Input
                type="number"
                value={discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                min="0"
                step="0.01"
                className="border-2 border-slate-200 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>

          {productSelectorTab === "catalog" && products.length > 0 ? (
            <>
              {/* Enhanced Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-4 text-blue-400" size={20} />
                <Input
                  placeholder="🔍 Buscar por nombre, SKU o categoría"
                  value={searchProduct}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchProduct(e.target.value)}
                  className="pl-12 border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm text-lg py-3"
                />
              </div>

              {/* Enhanced Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => selectProductFromModal(product)}
                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{product.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          📝 SKU: {product.sku} | 📂 {product.category}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            {formatMoney(product.price)}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            product.stock > product.stockMin 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            📦 Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && searchProduct && (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">🚫 No se encontraron productos</p>
                </div>
              )}
            </>
          ) : (
            /* Enhanced Manual Product Form */
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Package size={24} className="text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-800 text-lg">✏️ Línea Manual</h4>
                    <p className="text-purple-700 mt-1">
                      {products.length === 0 
                        ? "No hay productos en el catálogo. Cree una línea manual con nombre y precio."
                        : "Cree un producto personalizado para esta cotización."
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    📝 Nombre del producto <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={manualProduct.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setManualProduct({ ...manualProduct, name: e.target.value })
                    }
                    placeholder="Ingrese el nombre del producto"
                    className="border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    💰 Precio <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={manualProduct.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setManualProduct({ ...manualProduct, price: Math.max(0, Number(e.target.value) || 0) })
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Enhanced Preview */}
              {manualProduct.name && manualProduct.price > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <Eye size={20} className="mr-2" />
                    👁️ Vista previa del producto
                  </h4>
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-blue-100">
                    <div>
                      <div className="font-semibold text-lg">{manualProduct.name}</div>
                      <div className="text-sm text-gray-600">
                        {quantity} x {formatMoney(manualProduct.price)}
                        {discount > 0 && ` - ${formatMoney(discount)} desc.`}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatMoney(quantity * manualProduct.price - discount)}
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={addManualProduct}
                disabled={!manualProduct.name || manualProduct.price <= 0}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus size={20} className="mr-3" />
                ➕ Agregar Producto Manual
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}