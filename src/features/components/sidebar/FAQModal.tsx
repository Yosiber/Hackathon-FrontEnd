import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, HelpCircle, X } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex justify-between items-center py-4 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-100">{question}</span>
        <ChevronDown
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          size={20}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "¿Cómo puedo agregar un nuevo medicamento?",
    answer: "Para agregar un nuevo medicamento, dirígete a la sección 'Inventario' en tu dashboard. Luego, haz clic en el botón 'Agregar Medicamento' y completa el formulario con los datos correspondientes."
  },
  {
    question: "¿Cómo funciona el sistema de alertas?",
    answer: "El sistema revisa constantemente los niveles de stock. Recibirás una notificación automática cuando un medicamento alcance su nivel de 'stock mínimo' definido en su registro para evitar escasez."
  },
  {
    question: "¿Puedo cambiar la información de mi perfil?",
    answer: "Actualmente tu información está vinculada a tu EPS de origen o datos de registro. Para realizar cambios en tus datos principales, contacta a soporte técnico de Coraje."
  },
  {
    question: "¿Cómo busco un elemento específico?",
    answer: "Usa la barra de búsqueda ubicada en la parte superior de esta pantalla. Los resultados se filtrarán automáticamente a medida que escribas el nombre o principio activo del medicamento."
  }
];

export default function FAQModal({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40 dark:bg-gray-950/60 backdrop-blur-md z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden focus:outline-none border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <HelpCircle size={24} />
              </div>
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Preguntas Frecuentes
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Encuentra rápidamente respuestas a las preguntas más comunes sobre el uso de la plataforma de Coraje Centro Servicio.
            </Dialog.Description>
            
            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 shrink-0 text-center border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿No encuentras lo que buscas? <a className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">Soporte Técnico</a>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
