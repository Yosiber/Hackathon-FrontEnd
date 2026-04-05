import { useState, useEffect } from "react";
import { User, Mail, Pencil, X, Check, Camera } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useUser } from "../../context/UserContext";
import PhotoUploadModal from "./PhotoUploadModal";

export default function Profile() {
  const { setPlaceholder } = useSearch();
  const { user, updateImage } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: "staff@drogueria.com",
    imageProfile: user.imageProfile,
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    setPlaceholder("Buscar...");
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: "staff@drogueria.com",
      imageProfile: user.imageProfile,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (imageData: string) => {
    const base64 = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    setFormData({ ...formData, imageProfile: base64 });
    setIsPhotoModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateImage(formData.imageProfile);
    setIsEditing(false);
  };

  const avatarSrc = formData.imageProfile
    ? `data:image/png;base64,${formData.imageProfile}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563eb&color=fff&size=160`;

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
          <span
            className="material-symbols-outlined text-gray-600 dark:text-gray-200"
            style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
          >
            account_circle
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mi perfil</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona tu información personal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
              >
                <Camera size={14} />
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
              {formData.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
          </div>

          {!isEditing && (
            <div className="w-full mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                <Pencil size={14} /> Editar perfil
              </button>
            </div>
          )}
        </div>

        {/* Info / Edit card */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
              Información personal
            </h3>
            {isEditing && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                Modo edición
              </span>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              {[
                { label: "Nombre", value: formData.name, icon: <User size={15} /> },
                { label: "Correo electrónico", value: formData.email, icon: <Mail size={15} /> },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    {row.icon}
                    {row.label}
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { label: "Nombre", name: "name", type: "text" },
                { label: "Correo electrónico", name: "email", type: "email" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <X size={14} /> Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Check size={14} /> Guardar cambios
                </button>
              </div>
            </form>
          )}
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