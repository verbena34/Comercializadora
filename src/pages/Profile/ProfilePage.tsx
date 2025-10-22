import {
  Calendar,
  Clock,
  Edit,
  Key,
  Mail,
  Phone,
  Save,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import { useToast } from "../../components/ui/Toast";
import { mockUsers } from "../../lib/mock";
import { useAuth } from "../../store/useAuth";

export default function ProfilePage() {
  const { role } = useAuth();
  const toast = useToast();

  // Usar el primer usuario como ejemplo, o admin si es admin
  const user = role === "admin" ? mockUsers[0] : mockUsers[1];

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+502 5555-1234",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "es",
    currency: "GTQ",
    notifications: true,
    autoLogout: "60",
  });

  function updateProfile() {
    toast.add("Perfil actualizado exitosamente");
    setShowEditModal(false);
  }

  function changePassword() {
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.add("Las contraseñas no coinciden");
      return;
    }

    toast.add("Contraseña actualizada exitosamente");
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  function updatePreferences() {
    toast.add("Preferencias guardadas exitosamente");
  }

  const accountInfo = {
    createdAt: "2024-01-15",
    lastLogin: "2024-10-" + Math.floor(Math.random() * 20 + 1),
    loginCount: Math.floor(Math.random() * 100 + 50),
    activeSession: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 space-y-6 sm:space-y-8">
      <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
        <PageHeader title="Mi Perfil" subtitle="Configuración de cuenta y preferencias" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Información del perfil */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Información Personal</h3>
                  <p className="text-violet-100 mt-1">Datos de tu cuenta</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowEditModal(true)}
                  className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-semibold"
                >
                  <Edit size={16} className="mr-2" />
                  ✏️ Editar
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto sm:mx-0 shadow-lg">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-2xl font-bold text-slate-800">{user?.name}</h4>
                    <Badge color={user?.role === "admin" ? "blue" : "green"}>
                      {user?.role === "admin" ? "🔑 Administrador" : "👤 Empleado"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <Mail className="text-blue-600" size={20} />
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Email</div>
                      <div className="font-semibold text-slate-800">{user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <Phone className="text-emerald-600" size={20} />
                    <div>
                      <div className="text-sm text-emerald-600 font-medium">Teléfono</div>
                      <div className="font-semibold text-slate-800">{profileForm.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <Calendar className="text-amber-600" size={20} />
                    <div>
                      <div className="text-sm text-amber-600 font-medium">Creado</div>
                      <div className="font-semibold text-slate-800">15 Enero 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                    <Clock className="text-purple-600" size={20} />
                    <div>
                      <div className="text-sm text-purple-600 font-medium">Último acceso</div>
                      <div className="font-semibold text-slate-800">Hoy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferencias del sistema */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Preferencias del Sistema</h3>
                  <p className="text-emerald-100 mt-1">Configuración personalizada</p>
                </div>
                <Button 
                  onClick={updatePreferences} 
                  className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-emerald-50 border-0 shadow-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  <Save size={16} className="mr-2" />
                  💾 Guardar
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">🎨 Tema</label>
                  <Select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl shadow-sm"
                  >
                    <option value="light">☀️ Claro</option>
                    <option value="dark">🌙 Oscuro</option>
                    <option value="auto">🔄 Automático</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">🌐 Idioma</label>
                  <Select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl shadow-sm"
                  >
                    <option value="es">🇬🇹 Español</option>
                    <option value="en">🇺🇸 English</option>
                  </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Moneda</label>
                <Select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                >
                  <option value="GTQ">Quetzales (Q)</option>
                  <option value="USD">Dólares ($)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cierre automático (min)</label>
                <Select
                  value={preferences.autoLogout}
                  onChange={(e) => setPreferences({ ...preferences, autoLogout: e.target.value })}
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                  <option value="0">Desactivado</option>
                </Select>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notifications: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-700">🔔 Recibir notificaciones del sistema</span>
              </label>
            </div>
            </div>
          </Card>

          {/* Seguridad */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <h3 className="text-lg font-semibold mb-6">Seguridad</h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Contraseña</div>
                    <div className="text-sm text-gray-600">Última actualización: hace 3 meses</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full sm:w-auto"
                >
                  Cambiar
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Autenticación de dos factores</div>
                    <div className="text-sm text-gray-600">Desactivado</div>
                  </div>
                </div>
                <Button variant="ghost" disabled className="w-full sm:w-auto">
                  Configurar
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar con estadísticas */}
        <div className="space-y-4 lg:space-y-6 order-first xl:order-last">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Estadísticas de Cuenta</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Miembro desde</div>
                  <div className="font-medium">
                    {new Date(accountInfo.createdAt).toLocaleDateString("es-GT")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={20} className="text-green-500" />
                <div>
                  <div className="text-sm text-gray-600">Último acceso</div>
                  <div className="font-medium">
                    {new Date(accountInfo.lastLogin).toLocaleDateString("es-GT")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User size={20} className="text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Inicios de sesión</div>
                  <div className="font-medium">{accountInfo.loginCount}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Settings size={20} className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-600">Sesión activa</div>
                  <Badge color="green">Conectado</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>

            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Venta #V-2024-0854</div>
                <div className="text-gray-600">hace 2 horas</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Producto actualizado</div>
                <div className="text-gray-600">hace 5 horas</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Inicio de sesión</div>
                <div className="text-gray-600">hace 1 día</div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium">Nueva versión disponible</div>
                <div className="text-xs text-gray-600">Sistema v2.1.0</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-sm font-medium">Respaldo programado</div>
                <div className="text-xs text-gray-600">Hoy a las 23:00</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal editar perfil */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Información Personal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
            <Input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <Input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              placeholder="+502 5555-1234"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowEditModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button onClick={updateProfile} className="w-full sm:w-auto">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal cambiar contraseña */}
      <Modal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Cambiar Contraseña"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Nueva Contraseña</label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-sm text-gray-700">
              <strong>Recomendaciones:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Mínimo 8 caracteres</li>
                <li>Incluir mayúsculas y minúsculas</li>
                <li>Incluir números y símbolos</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowPasswordModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button onClick={changePassword} className="w-full sm:w-auto">
              Actualizar Contraseña
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
