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
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden border-b border-gray-100">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-[100px] opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Médicos que confían en Coraje</h2>
          <p className="mt-4 text-xl text-gray-600 font-medium">Descubre cómo nuestra plataforma eleva la eficiencia clínica a diario.</p>
        </div>

        <div className="relative bg-white border border-gray-100/50 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-blue-900/10 mx-auto backdrop-blur-sm">
          <Quote className="mx-auto text-blue-200 mb-8 transform -scale-x-100" size={80} style={{ fill: 'currentColor' }} />
          
          <div className="relative h-72 md:h-48 overflow-hidden flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`absolute w-full px-4 transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center ${
                  index === currentIndex ? "opacity-100 translate-x-0" : 
                  index < currentIndex ? "opacity-0 -translate-x-12" : "opacity-0 translate-x-12"
                }`}
              >
                <p className="text-2xl md:text-3xl font-medium text-gray-800 italic leading-relaxed max-w-3xl mx-auto">
                  "{testimonial.content}"
                </p>
                <div className="mt-8 flex items-center justify-center gap-5">
                  <div className={`w-14 h-14 rounded-full ${testimonial.avatarColor} flex items-center justify-center font-bold text-xl shadow-md border-2 border-white`}>
                    {testimonial.author.charAt(0)}{testimonial.author.split(' ')[1]?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-gray-900 text-lg">{testimonial.author}</p>
                    <p className="text-sm font-bold text-blue-700 tracking-wider uppercase mt-0.5">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center items-center gap-6">
            <button 
              onClick={prevSlide}
              className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
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
              className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
