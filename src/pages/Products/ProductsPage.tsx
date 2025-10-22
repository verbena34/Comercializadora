import { Edit, Package, Plus, Search } from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Table from "../../components/ui/Table";
import { useToast } from "../../components/ui/Toast";
import { formatMoney } from "../../lib/format";
import { useCatalog } from "../../store/useCatalog";
import { Product } from "../../types/product";

export default function ProductsPage() {
  const { products, categories, units, addProduct, updateProduct, adjustStock } = useCatalog();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState({ productId: "", quantity: 0, note: "" });

  const [productForm, setProductForm] = useState({
    sku: "",
    barcode: "",
    name: "",
    category: "",
    unit: "",
    cost: 0,
    price: 0,
    stock: 0,
    stockMin: 0,
    active: true,
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const productTableData = filteredProducts.map((p) => ({
    ID: p.id,
    SKU: p.sku,
    Código: p.barcode,
    Nombre: p.name,
    Categoría: p.category,
    Unidad: p.unit,
    Costo: formatMoney(p.cost),
    Precio: formatMoney(p.price),
    Stock: p.stock,
    "Stock Mín": p.stockMin,
    Estado: <Badge color={p.active ? "gray" : "red"}>{p.active ? "Activo" : "Inactivo"}</Badge>,
    Acciones: (
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => handleEditProduct(p)}>
          <Edit size={16} />
        </Button>
        <Button variant="ghost" onClick={() => handleStockAdjust(p.id)}>
          <Package size={16} />
        </Button>
      </div>
    ),
  }));

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  }

  function handleStockAdjust(productId: string) {
    setStockAdjustment({ productId, quantity: 0, note: "" });
    setShowStockModal(true);
  }

  function handleSaveProduct() {
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      toast.add("Producto actualizado");
    } else {
      addProduct(productForm);
      toast.add("Producto creado");
    }
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      sku: "",
      barcode: "",
      name: "",
      category: "",
      unit: "",
      cost: 0,
      price: 0,
      stock: 0,
      stockMin: 0,
      active: true,
    });
  }

  function handleStockAdjustment() {
    adjustStock(stockAdjustment.productId, stockAdjustment.quantity, stockAdjustment.note);
    toast.add("Stock ajustado");
    setShowStockModal(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 space-y-6 sm:space-y-8">
      <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
        <PageHeader title="Productos" subtitle="Gestión del catálogo de productos" />
      </div>

      <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Catálogo de Productos</h3>
                <p className="text-emerald-100 mt-1">Gestión completa del inventario</p>
              </div>
              <Button
                onClick={() => setShowProductModal(true)}
                className="w-full lg:w-auto bg-white text-emerald-600 hover:bg-emerald-50 border-0 shadow-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} className="mr-2" />
                Nuevo Producto
              </Button>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-3 text-emerald-300" size={18} />
                  <Input
                    placeholder="Buscar por SKU, nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-white/90 border-0 shadow-lg rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-white"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-48 bg-white/90 border-0 shadow-lg rounded-xl text-slate-800"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                  }}
                  className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-semibold transition-all duration-200"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <div className="overflow-x-auto">
          <Table columns={Object.keys(productTableData[0] || {})} data={productTableData} />
        </div>
      </Card>

      <Modal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="SKU"
            value={productForm.sku}
            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
          />
          <Input
            placeholder="Código de barras"
            value={productForm.barcode}
            onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
          />
          <Input
            placeholder="Nombre"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            className="md:col-span-2"
          />
          <Select
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Select
            value={productForm.unit}
            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
          >
            <option value="">Seleccionar unidad</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Costo"
            value={productForm.cost}
            onChange={(e) => setProductForm({ ...productForm, cost: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Precio"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Stock inicial"
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Stock mínimo"
            value={productForm.stockMin}
            onChange={(e) => setProductForm({ ...productForm, stockMin: Number(e.target.value) })}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowProductModal(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveProduct} className="w-full sm:w-auto">
            Guardar
          </Button>
        </div>
      </Modal>

      <Modal open={showStockModal} onClose={() => setShowStockModal(false)} title="Ajuste de Stock">
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Cantidad (+/-)"
            value={stockAdjustment.quantity}
            onChange={(e) =>
              setStockAdjustment({ ...stockAdjustment, quantity: Number(e.target.value) })
            }
          />
          <Input
            placeholder="Motivo"
            value={stockAdjustment.note}
            onChange={(e) => setStockAdjustment({ ...stockAdjustment, note: e.target.value })}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowStockModal(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button onClick={handleStockAdjustment} className="w-full sm:w-auto">
            Ajustar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
