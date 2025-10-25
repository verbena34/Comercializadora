import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Upload, 
  Camera, 
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Check
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useToast } from "../../components/ui/Toast";
import { useBusiness, BusinessInfo } from "../../store/useBusiness";
import { useAuth } from "../../store/useAuth";

const businessTypes = [
  "Ferretería",
  "Tienda de Abarrotes",
  "Farmacia",
  "Librería",
  "Restaurante",
  "Panadería",
  "Carnicería",
  "Verdulería",
  "Taller Mecánico",
  "Salón de Belleza",
  "Ropa y Accesorios",
  "Electrónicos",
  "Muebles",
  "Deportes",
  "Otro"
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { setBusinessInfo } = useBusiness();
  const { setRole } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Información personal
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    
    // Información del negocio
    businessName: "",
    businessType: "",
    address: "",
    city: "",
    country: "Guatemala"
  });

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.add("La imagen debe ser menor a 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBusinessLogo(result);
      };
      reader.readAsDataURL(file);
    }
  }

  function validateStep1() {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.add("Por favor completa todos los campos obligatorios", "error");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.add("Las contraseñas no coinciden", "error");
      return false;
    }
    
    if (formData.password.length < 8) {
      toast.add("La contraseña debe tener al menos 8 caracteres", "error");
      return false;
    }
    
    return true;
  }

  function validateStep2() {
    if (!formData.businessName || !formData.businessType) {
      toast.add("Por favor completa la información del negocio", "error");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleSubmit() {
    const businessInfo: BusinessInfo = {
      ownerFirstName: formData.firstName,
      ownerLastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      businessType: formData.businessType,
      businessLogo,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      registeredAt: new Date().toISOString()
    };

    setBusinessInfo(businessInfo);
    setRole("admin"); // El propietario del negocio será admin por defecto
    toast.add("¡Registro completado exitosamente! Bienvenido a Emprende360");
    navigate("/dashboard");
  }

  const steps = [
    { number: 1, title: "Información Personal", completed: currentStep > 1 },
    { number: 2, title: "Datos del Negocio", completed: currentStep > 2 },
    { number: 3, title: "Finalizar Registro", completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Building2 size={40} className="text-blue-600 mr-3" />
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xl">
              EMPRENDE360
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Registra tu Negocio</h1>
          <p className="text-gray-600">Completa tu información para comenzar a usar el sistema</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : currentStep === step.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.completed ? <Check size={20} /> : step.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? "text-gray-800" : "text-gray-500"
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-4 ${
                    step.completed ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            
            {/* Step 1: Información Personal */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                  <p className="text-gray-600">Datos del propietario del negocio</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombres *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("firstName", e.target.value)}
                      placeholder="Juan Carlos"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("lastName", e.target.value)}
                      placeholder="García López"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="pl-12 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      value={formData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                      placeholder="+502 5555-1234"
                      className="pl-12 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("password", e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pr-12 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">Requisitos de contraseña:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Mínimo 8 caracteres</li>
                    <li>• Incluir mayúsculas y minúsculas</li>
                    <li>• Incluir números</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Información del Negocio */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">Información del Negocio</h2>
                  <p className="text-gray-600">Datos de tu empresa o negocio</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Negocio *
                  </label>
                  <Input
                    value={formData.businessName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("businessName", e.target.value)}
                    placeholder="Ferretería El Martillo"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Negocio *
                  </label>
                  <Select
                    value={formData.businessType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("businessType", e.target.value)}
                    className="w-full"
                    required
                  >
                    <option value="">Selecciona el tipo de negocio</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo del Negocio
                  </label>
                  <div className="space-y-4">
                    {businessLogo && (
                      <div className="text-center">
                        <img 
                          src={businessLogo} 
                          alt="Logo del negocio" 
                          className="w-32 h-32 object-contain mx-auto rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center gap-3">
                        {businessLogo ? <Camera size={32} className="text-blue-500" /> : <Upload size={32} className="text-gray-400" />}
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {businessLogo ? "Cambiar logo" : "Subir logo del negocio"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG hasta 5MB</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        value={formData.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("city", e.target.value)}
                        placeholder="Guatemala"
                        className="pl-12 w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      País
                    </label>
                    <Select
                      value={formData.country}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("country", e.target.value)}
                      className="w-full"
                    >
                      <option value="Guatemala">Guatemala</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Panamá">Panamá</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("address", e.target.value)}
                    placeholder="Zona 1, Ciudad de Guatemala"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Resumen y Confirmación */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Sparkles className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">¡Casi Terminamos!</h2>
                  <p className="text-gray-600">Revisa tu información antes de continuar</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Resumen del Registro</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Información Personal</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nombre:</span> {formData.firstName} {formData.lastName}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        {formData.phone && <p><span className="font-medium">Teléfono:</span> {formData.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Información del Negocio</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Negocio:</span> {formData.businessName}</p>
                        <p><span className="font-medium">Tipo:</span> {formData.businessType}</p>
                        {formData.city && <p><span className="font-medium">Ciudad:</span> {formData.city}</p>}
                      </div>
                    </div>
                  </div>

                  {businessLogo && (
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2">Logo del Negocio</p>
                      <img 
                        src={businessLogo} 
                        alt="Logo" 
                        className="w-20 h-20 object-contain mx-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">¿Qué obtienes con Emprende360?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Sistema completo de gestión comercial</li>
                    <li>✓ Control de inventario y productos</li>
                    <li>✓ Gestión de ventas y cotizaciones</li>
                    <li>✓ Administración de clientes</li>
                    <li>✓ Reportes y análisis detallados</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Anterior
                  </Button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
                  >
                    <Sparkles size={20} className="mr-2" />
                    Completar Registro
                  </Button>
                )}
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Iniciar Sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}