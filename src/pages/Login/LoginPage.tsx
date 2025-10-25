import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Building2, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../store/useAuth";
import { useBusiness } from "../../store/useBusiness";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const setAuthRole = useAuth((state) => state.setRole);
  const { businessInfo } = useBusiness();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthRole("admin"); // Siempre usar rol de admin
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Información de la empresa */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center space-y-8">
            {/* Logo y título principal */}
            <div className="space-y-4">
              {businessInfo?.businessLogo ? (
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                  <img 
                    src={businessInfo.businessLogo} 
                    alt="Logo del negocio" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                  <Building2 size={40} className="text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {businessInfo?.businessName || "EMPRENDE360"}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    EMPRENDE360
                  </span>
                  <Sparkles size={20} className="text-yellow-300" />
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="space-y-6 max-w-sm">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-semibold mb-3">Gestión Inteligente</h3>
                <p className="text-blue-100 leading-relaxed">
                  Sistema completo para administrar tu {businessInfo?.businessType?.toLowerCase() || "negocio"} con herramientas modernas y eficientes.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold">📊</div>
                  <div className="text-sm text-blue-100 mt-1">Reportes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold">👥</div>
                  <div className="text-sm text-blue-100 mt-1">Clientes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold">💰</div>
                  <div className="text-sm text-blue-100 mt-1">Ventas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <div className="text-2xl font-bold">📦</div>
                  <div className="text-sm text-blue-100 mt-1">Inventario</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Efectos visuales */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Lado derecho - Formulario de login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-md">
          {/* Header del formulario */}
          <div className="text-center mb-8">
            <div className="lg:hidden w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg overflow-hidden">
              {businessInfo?.businessLogo ? (
                <img 
                  src={businessInfo.businessLogo} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 size={32} className="text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">
              {businessInfo ? `Bienvenido a ${businessInfo.businessName}` : "Accede a tu cuenta para continuar"}
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="usuario@emprende360.com"
                    required
                    className="pl-12 w-full rounded-xl border-2 border-gray-200 focus:ring-blue-500 focus:border-blue-500 py-3"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-12 pr-12 w-full rounded-xl border-2 border-gray-200 focus:ring-blue-500 focus:border-blue-500 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Botón de login */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-8"
              >
                <span className="flex items-center justify-center gap-2">
                  Ingresar
                  <Sparkles size={20} />
                </span>
              </Button>
            </form>

            {/* Footer del formulario */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-500">
                ¿Problemas para ingresar?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contacta al administrador
                </a>
              </p>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/register")}
                className="w-full border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Building2 size={20} className="mr-2" />
                Registrar Negocio
              </Button>
            </div>
          </div>

          {/* Información adicional para móvil */}
          <div className="lg:hidden mt-8 text-center text-sm text-gray-600">
            <p>Sistema de gestión comercial • Versión 2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
