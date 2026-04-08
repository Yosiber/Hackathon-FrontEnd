import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "Coraje ha transformado completamente cómo administramos nuestro inventario médico. Las alertas de stock nos han salvado innumerables veces.",
    author: "Dra. María Fernández",
    role: "Directora Médica",
    avatarColor: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    content: "La gestión de tickets es increíblemente intuitiva. Nuestro tiempo de respuesta a los pacientes mejoró en un 40% durante el primer mes.",
    author: "Carlos Ramírez",
    role: "Jefe de Atención al Paciente",
    avatarColor: "bg-emerald-100 text-emerald-600"
  },
  {
    id: 3,
    content: "Tener un dashboard en tiempo real con datos precisos me permite tomar decisiones gerenciales con total confianza y agilidad.",
    author: "Ana Lucía Silva",
    role: "Gerente de Operaciones",
    avatarColor: "bg-indigo-100 text-indigo-600"
  }
];

export default function LandingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 dark:bg-emerald-900/30 rounded-full blur-[100px] opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Médicos que confían en Coraje</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 font-medium">Descubre cómo nuestra plataforma eleva la eficiencia clínica a diario.</p>
        </div>

        <div className="relative bg-white dark:bg-gray-800 border border-gray-100/50 dark:border-gray-700 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-blue-900/10 dark:shadow-black/40 mx-auto backdrop-blur-sm">
          <Quote className="mx-auto text-blue-200 mb-8 transform -scale-x-100" size={80} style={{ fill: 'currentColor' }} />
          
          <div className="relative h-96 md:h-72 overflow-hidden flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`absolute w-full px-4 transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center ${
                  index === currentIndex ? "opacity-100 translate-x-0" : 
                  index < currentIndex ? "opacity-0 -translate-x-12" : "opacity-0 translate-x-12"
                }`}
              >
                <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed max-w-3xl mx-auto">
                  "{testimonial.content}"
                </p>
                <div className="mt-8 flex items-center justify-center gap-5">
                  <div className={`w-14 h-14 rounded-full ${testimonial.avatarColor} flex items-center justify-center font-bold text-xl shadow-md border-2 border-white dark:border-gray-800`}>
                    {testimonial.author.charAt(0)}{testimonial.author.split(' ')[1]?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-gray-900 dark:text-white text-lg">{testimonial.author}</p>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 tracking-wider uppercase mt-0.5">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center items-center gap-6">
            <button 
              onClick={prevSlide}
              className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-gray-600"
            >
              <ChevronLeft size={28} />
            </button>
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-blue-600 w-12" : "bg-gray-300 w-3 hover:bg-blue-400"
                  }`}
                  aria-label={`Ir a testimonio ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-gray-600"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
