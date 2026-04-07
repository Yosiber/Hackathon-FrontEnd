import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NotFound() {

  const navigate = useNavigate();
  const { authUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Página No Encontrada</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
        La página que estás buscando no existe.
      </p>
      <button
        onClick={() => navigate( authUser ? "/" : "/login" )}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Volver al Inicio
      </button>
    </div>
  );
}
