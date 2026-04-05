import { useState, useRef, useEffect } from "react";
import { X, Upload, Camera, Circle } from "lucide-react";

const CameraCapture = ({ onPictureTaken, onCancel }: {
  onPictureTaken: (data: string) => void;
  onCancel: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
  let isMounted = true;

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user"
        },
        audio: false
      });
      streamRef.current = s;

      const video = videoRef.current;
      if (video && !video.srcObject) { 
        video.srcObject = s;

        video.onplaying = () => {
          console.log("VIDEO PLAYING 🔥");
          console.log("SIZE:", video.videoWidth, video.videoHeight);
        };

        video.onerror = (e) => console.error("VIDEO ERROR", e);

        video.onloadedmetadata = () => {
          video.play().catch(err => {
            console.error("Play error:", err);
          });
        };
}

    } catch (err) {
      console.error(err);
      setError("No se pudo acceder a la cámara.");
    }
  };

  startCamera();

  return () => {
    isMounted = false;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };
}, []);


    const handleTake = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const size = Math.min(video.videoWidth, video.videoHeight);

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(
      video,
      sx, sy, size, size, 
      0, 0, size, size    
    );

    onPictureTaken(canvas.toDataURL("image/jpeg"));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 p-4">
          {error}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 rounded-lg border border-gray-200 dark:border-gray-700 object-cover bg-black"
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-3">
        <button
          onClick={handleTake}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          disabled={!!error}
        >
          <Circle size={14} /> Tomar foto
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

const PhotoUploadModal = ({ isOpen, onClose, onImageSelect }: {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (data: string) => void;
}) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onImageSelect(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setIsCameraOn(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-label="Cerrar modal"
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isCameraOn ? "Tomar foto" : "Actualizar foto de perfil"}
          </h3>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X size={16} />
          </button>
        </div>
        

        {/* Body */}
        {isCameraOn ? (
          <CameraCapture
            onPictureTaken={(data) => { onImageSelect(data); setIsCameraOn(false); }}
            onCancel={() => setIsCameraOn(false)}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload size={16} />
              Subir desde dispositivo
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => setIsCameraOn(true)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Camera size={16} />
              Usar cámara
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadModal;