import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/user.schema";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorAlert from "../../components/form/ErrorAlert";
import { getFirstFormError } from "../../assets/scripts/getFirstFormError";
import { useUsers } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
    const { authUser, loading, setLoading } = useAuth();
    const { signUp, serverError } = useUsers();
    const [ showPassword, setShowPassword ] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitted }, reset } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const navigate = useNavigate();

    const errorMessage = getFirstFormError(errors, serverError);

    const onSubmit = async (data: RegisterFormValues) => {
        const createdUserId = await signUp({ ...data, role: "usuario" });
        
        if (createdUserId) {
            const { email } = data;
            navigate("/verify-registration", {
                state: { email, createdUserId }
            })
            reset();
        }
    }

    useEffect(() => {
        console.log(authUser);
        if (authUser) {
            navigate("/");
        } else {
            setLoading(false);
        }
    }, [authUser, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-gray-400 !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    autorenew
                </span>
            </div>
        );
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center relative p-6 md:p-12">
            {isSubmitted && errorMessage && (
                <ErrorAlert key={errorMessage} message={errorMessage} status="error" />
            )}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 relative z-10 border-none">
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-10">
                            <span className="material-symbols-outlined text-blue-800 !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                            <span className="text-2xl font-black text-blue-800 tracking-tighter headline">Coraje Centro Servicio</span>
                        </div>
                        <div className="mt-12">
                            <h2 className="font-headline font-extrabold text-5xl tracking-tighter mb-6 leading-tight">
                                Crea tu <span className="text-blue-800">Santuario</span> Clínico
                            </h2>
                            <p className="text-gray-500 text-lg mb-8 max-w-lg font-bold">
                                Inicia tu proceso de gestión centralizada de tus productos en tu Sucursal de Medicamentos más cercana asociada a tu EPS. <span className="text-blue-800">Coraje</span> garantiza la integridad de tus datos y la agilidad de la atención médica.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-800" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Protección de Datos</h4>
                                        <p className="text-sm text-gray-500">Encriptación de grado clínico para toda la información sensible.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-green-800" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Acceso Instantáneo</h4>
                                        <p className="text-sm text-gray-500">Obtén la información más reciente de primera mano desde nuestro portal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 md:p-14 flex flex-col justify-center">
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">
                        <span>Inicio</span>
                        <span className="material-symbols-outlined text-gray-400 !text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_right</span>
                        <span className="text-blue-700 font-bold">Registro</span>
                    </nav>
                    <div className="mb-10">
                        <h3 className="text-3xl font-extrabold font-headline tracking-tight">Información de Perfil</h3>
                        <p className="text-gray-500 mt-2">Completa los siguientes campos para crear tu perfil de usuario.</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Nombre Completo</label>
                            <div className={`border-b-2 ${errors.name ? "border-red-600" : "focus-within:border-blue-700"} transition-all`}>
                                <input type="text" className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="Tu nombre"
                                {...register("name")} />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Edad</label>
                            <div className={`border-b-2 ${errors.age ? "border-red-600" : "focus-within:border-blue-700"} transition-all`}>
                                <input type="text" className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="Tu edad"
                                {...register("age")} />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Tipo de Documento</label>
                            <div className={`relative border-b-2 ${errors.documentType ? "border-red-600" : "focus-within:border-blue-700"} transition-all`}>
                                <select className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg appearance-none focus:outline-none" {...register("documentType")}>
                                    <option value="CEDULA" >Cedula Ciudadania</option>
                                    <option value="TARJETA_IDENTIDAD" >Tarjeta de Identidad</option>
                                    <option value="CEDULA_EXTRANJERIA" >Cedula Extranjeria</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-0 bottom-2.5 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>expand_more</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Número de Documento</label>
                            <div className={`border-b-2 ${errors.documentNumber ? "border-red-600" : "focus-within:border-blue-700"} transition-all`}>
                                <input type="text" className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="Número de Identificación"
                                {...register("documentNumber")} />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Correo Electrónico</label>
                            <div className={`border-b-2 ${errors.email ? "border-red-600" : "focus-within:border-blue-700"} transition-all`}>
                                <input type="text" className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="Tu Email"
                                {...register("email")} />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Teléfono</label>
                            <div className={`border-b-2 ${errors.phone ? "border-red-600" : "focus-within:border-blue-700"} transition-all`}>
                                <input type="tel" className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="Tu Número Telefónico"
                                {...register("phone")} />
                            </div>
                        </div>
                        <div className="relative group md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Contraseña</label>
                            <div className={`relative border-b-2 ${errors.password ? "border-red-600" : "focus-within:border-blue-700"} transition-all flex items-center`}>
                                <input type={`${showPassword ? "text" : "password"}`} className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="Tu Contraseña"
                                {...register("password")} />
                                <button className="transition-colors px-2 flex items-center" type="button"
                                onClick={() => setShowPassword(!showPassword)}>
                                    <span className={`${showPassword ? "text-blue-600" : "text-gray-400"} hover:text-gray-900 hover:cursor-pointer material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                                </button>
                            </div>
                        </div>
                        <div className="md:col-span-1 flex flex-col md:flex-row items-center gap-6">
                            <button className="text-gray-100 font-bold px-12 py-2 rounded-xl text-lg flex items-center gap-3 shadow-lg hover:scale-[1.02] hover:cursor-pointer transition-transform w-full md:w-auto" style={{background: "linear-gradient(135deg, #005dac 0%, #1976d2 100%)"}}
                            >
                                Completar Registro
                            </button>
                        </div>
                        <div className="md:col-span-1 flex flex-col md:flex-row items-center gap-6">
                            <button type="button" onClick={() => {navigate("/login"); reset();}} className="text-blue-800 font-bold px-12 py-2 rounded-xl text-lg flex items-center gap-3 shadow-lg hover:scale-[1.02] hover:cursor-pointer transition-transform w-full md:w-auto" >
                                ¿Ya tienes una Cuenta?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )

}