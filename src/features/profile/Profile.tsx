import { useState, useEffect } from "react";
import {
  User, Mail, Pencil, X, Check, Camera,
  ShieldCheck, Bell, ClipboardList,
  PackageCheck, AlertTriangle, ChevronRight,
} from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useUsers } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import PhotoUploadModal from "./PhotoUploadModal";
import { useAuth } from "../context/AuthContext";

const actividadReciente = [
  { tipo: "ticket",   icono: "ticket",     texto: "Ticket B-202 completado — Ana Rosa",      tiempo: "Hace 10 min",  color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/30"   },
  { tipo: "stock",    icono: "alerta",     texto: "Alerta de stock crítico — Insulina NPH",   tiempo: "Hace 32 min",  color: "text-red-500",    bg: "bg-red-50 dark:bg-red-900/30"     },
  { tipo: "llegada",  icono: "llegada",    texto: "Llegada registrada — Metformina 850mg",    tiempo: "Hace 1h",      color: "text-green-500",  bg: "bg-green-50 dark:bg-green-900/30" },
  { tipo: "ticket",   icono: "ticket",     texto: "Ticket A-101 atendido — Carlos Gómez",     tiempo: "Hace 2h",      color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/30"   },
  { tipo: "stock",    icono: "alerta",     texto: "Stock bajo — Ibuprofeno 400mg",            tiempo: "Hace 3h",      color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/30" },
];

const accesosRapidos = [
  { label: "Tickets de hoy",    path: "/tickets",       icon: <ClipboardList size={18} />,  color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/30"   },
  { label: "Inventario",        path: "/inventory",     icon: <PackageCheck size={18} />,   color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
  { label: "Notificaciones",    path: "/notifications", icon: <Bell size={18} />,           color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  { label: "Stock crítico",     path: "/inventory",     icon: <AlertTriangle size={18} />,  color: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/30"     },
];

const stats = [
  { label: "Tickets hoy",     value: "24", sub: "+3 pendientes",  color: "border-blue-400"  },
  { label: "Completados",     value: "18", sub: "75% del total",  color: "border-green-400" },
  { label: "Stock crítico",   value: "3",  sub: "Requiere acción",color: "border-red-400"   },
  { label: "Llegadas hoy",    value: "5",  sub: "Medicamentos",   color: "border-amber-400" },
];

function ActivityIcon({ tipo }: { tipo: string }) {
  if (tipo === "ticket")  return <ClipboardList size={15} />;
  if (tipo === "llegada") return <PackageCheck size={15} />;
  return <AlertTriangle size={15} />;
}

export default function Profile() {
  const { setPlaceholder } = useSearch();
  const { updateUserImage } = useUsers();
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name,
    email: authUser?.email,
    imageProfile: authUser?.profilePictureUrl,
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    setPlaceholder("Buscar...");
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, imageProfile: authUser?.profilePictureUrl }));
  }, [authUser?.profilePictureUrl]);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: authUser?.name || '', email: authUser?.email || '', imageProfile: authUser?.profilePictureUrl });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (imageData: string) => {
    const base64 = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    setFormData({ ...formData, imageProfile: base64 });
    setIsPhotoModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.imageProfile && authUser?._id) {
      try {
        await updateUserImage(authUser._id, formData.imageProfile);
        setIsEditing(false);
      } catch (error) {
        console.error('Error al actualizar la imagen:', error);
      }
    }
  };

  const avatarSrc = formData.imageProfile
    ? `data:image/png;base64,${formData.imageProfile}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563eb&color=fff&size=160`;

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-200"
            style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
            account_circle
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mi perfil</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tu información personal</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 ${s.color}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">{s.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Fila principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Avatar + info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center gap-4">
          <div className="relative">
            <img src={avatarSrc} alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow" />
            {isEditing && (
              <button type="button" onClick={() => setIsPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow">
                <Camera size={14} />
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{formData.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
          </div>

          {/* Badges de rol/sede/turno */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
              <ShieldCheck size={15} className="text-blue-500 flex-shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">Rol</span>
              <span className="text-xs font-medium">{authUser?.role || '-'}</span>
            </div>
          </div>

          {!isEditing && (
            <button onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
              <Pencil size={14} /> Editar perfil
            </button>
          )}
        </div>

        {/* Info / Form */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Información personal</h3>
            {isEditing && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                Modo edición
              </span>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3">
              {[
                { label: "Nombre completo", value: formData.name,  icon: <User size={15} />  },
                { label: "Correo electrónico", value: formData.email, icon: <Mail size={15} /> },
                { label: "Rol en el sistema", value: authUser?.role || '-',    icon: <ShieldCheck size={15} /> },
              ].map((row) => (
                <div key={row.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    {row.icon}
                    <span>{row.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { label: "Nombre completo",    name: "name",  type: "text"  },
                { label: "Correo electrónico", name: "email", type: "email" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{field.label}</label>
                  <input type={field.type} name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600" />
                </div>
              ))}

              {/* Campos de solo lectura en edición */}
              {[
                { label: "Rol en el sistema", value: authUser?.role || '-' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{f.label}</label>
                  <input disabled value={f.value}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                </div>
              ))}

              <p className="text-xs text-gray-400 dark:text-gray-500">
                {authUser?.role === "usuario" ? (
                  "* Tu rol es de un usuario normal, asignado por el sistema."
                ) : (
                  "* El rol, sede y turno son asignados por el administrador del sistema."
                )}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <X size={14} /> Cancelar
                </button>
                <button type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  <Check size={14} /> Guardar cambios
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Fila inferior: actividad + accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Actividad reciente */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-4">Actividad reciente</h3>
          <div className="flex flex-col gap-3">
            {actividadReciente.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${a.bg} ${a.color}`}>
                  <ActivityIcon tipo={a.tipo} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{a.texto}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{a.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-4">Accesos rápidos</h3>
          <div className="flex flex-col gap-3">
            {accesosRapidos.map((a) => (
              <button key={a.label} onClick={() => navigate(a.path)}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${a.bg} ${a.color}`}>{a.icon}</div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.label}</span>
                </div>
                <ChevronRight size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </button>
            ))}
          </div>
        </div>

      </div>

      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </main>
  );
}