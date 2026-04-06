import React, { useState, useEffect } from 'react';

interface ErrorAlertProps {
  message: string;
  status: string
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, status }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    // Esperamos a que termine la animación de opacidad antes de desmontar
    setTimeout(() => setShouldRender(false), 500);
  };

  useEffect(() => {
    // Auto-cierre tras 20 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-5 z-100 flex items-center w-full max-w-sm p-4 ${status === "error" ? "text-red-800 bg-red-50 border-red-300" : "text-green-600 bg-green-50 border-green-400/20"} border rounded-lg shadow-lg transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="alert"
    >
      {/* Icono de Error */}
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${status === "error" ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"} rounded-lg`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      </div>

      {/* Mensaje */}
      <div className="ms-3 text-sm font-medium pr-8">
        {message}
      </div>

      {/* Botón X */}
      <button
        type="button"
        onClick={handleClose}
        className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${status === "error" ? "bg-red-50 text-red-500 hover:bg-red-200 focus:ring-red-400": "bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400"}`}
        aria-label="Close"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default ErrorAlert;
