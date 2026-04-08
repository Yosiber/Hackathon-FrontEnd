import * as Dialog from "@radix-ui/react-dialog";
import { Mail, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUsers } from "../context/UserContext";

interface EmailOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  newEmail: string;
  onSuccess: () => void;
}

export default function EmailOtpModal({ isOpen, onClose, userId, newEmail, onSuccess }: EmailOtpModalProps) {
  const [code, setCode] = useState("");
  const { verifyNewEmailCode, loading, serverError } = useUsers();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;
    
    const success = await verifyNewEmailCode(userId, code);
    if (success) {
      onSuccess();
      setCode("");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40 dark:bg-gray-950/60 backdrop-blur-md z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl z-50 p-10 focus:outline-none border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 border-4 border-blue-50 dark:border-blue-900/20">
              <Mail size={36} />
            </div>
            
            <Dialog.Title className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
              Verifica tu bandeja
            </Dialog.Title>
            
            <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Enviamos un código seguro de 6 dígitos a <br/>
              <span className="font-bold text-gray-800 dark:text-gray-200 mt-1 inline-block">{newEmail}</span><br/>
              Introdúcelo para confirmar el cambio.
            </Dialog.Description>

            <form onSubmit={handleVerify} className="w-full">
              <div className="mb-6 relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // only numeric
                  className="w-full text-center text-5xl tracking-[0.4em] font-black text-blue-900 dark:text-white bg-blue-50/50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-3xl py-6 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all font-mono"
                />
              </div>

              {serverError && (
                <div className="mb-8 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium text-left">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <p>{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={code.length < 6 || loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-lg font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/30"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} />}
                Confirmar Email
              </button>
            </form>

            <div className="mt-8 text-sm text-gray-400">
              <button 
                type="button" 
                onClick={onClose} 
                className="hover:text-gray-600 dark:hover:text-gray-200 font-bold underline decoration-dotted underline-offset-4"
              >
                Cancelar y mantener email actual
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
