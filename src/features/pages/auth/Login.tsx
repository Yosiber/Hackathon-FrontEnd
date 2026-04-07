import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type z from "zod";
import { loginSchema } from "../../schemas/auth.schema";

import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFirstFormError } from "../../assets/scripts/getFirstFormError";
import ErrorAlert from "../../components/form/ErrorAlert";

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {

    const { signIn, serverError, authUser, loading, setLoading } = useAuth();
    const [ showPassword, setShowPassword ] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitted }, reset } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const navigate = useNavigate();
    const location = useLocation();
    const successRegister = location.state?.successRegister;
    const successLogout = location.state?.successLogout;
    const sessionExpired = location.state?.sessionExpired;
    const successPassword = location.state?.successPassword;

    const errorMessage = getFirstFormError(errors, serverError);

    const onSubmit = async (data: LoginFormValues) => {
        const response = await signIn({...data})
        if (response) {
            navigate("/");
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
        <main className="min-h-screen flex items-center justify-center relative px-6 py-12">
            {successRegister && (
                <ErrorAlert key={successRegister} message={successRegister} status="success" />
            )}
            {successLogout && (
                <ErrorAlert key={successLogout} message={successLogout} status="success" />
            )}
            {sessionExpired && (
                <ErrorAlert key={sessionExpired} message={sessionExpired} status="success" />
            )}
            {successPassword && (
                <ErrorAlert key={successPassword} message={successPassword} status="success" />
            )}
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
                        <div className="mt-20">
                            <h2 className="text-4xl font-extrabold tracking-tight mb-6">
                                Tu salud requiere <br /> <span className="text-blue-800 italic">Coraje</span> y constancia.
                            </h2>
                            <p className="text-gray-500 font-bold text-lg max-w-md">
                                Bienvenido de nuevo a tu santuario clínico digital. Gestiona tus medicamentos con la precisión y el cuidado que mereces.
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-none shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-800" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    verified_user
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Seguridad Clínica</p>
                                <p className="text-sm">Datos encriptados bajo estándares médicos.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-8">
                        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">
                            <span>Inicio</span>
                            <span className="material-symbols-outlined text-gray-400 !text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_right</span>
                            <span className="text-blue-700 font-bold">Login</span>
                        </nav>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                            Iniciar Sesión
                        </h1>
                        <p>Ingresa tus credenciales para acceder a tu información.</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Correo Electrónico</label>
                            <div className={`group border-b-2 ${errors.email ? "border-red-600" : "border-gray-300 focus-within:border-blue-700"} transition-all`}>
                                <input type="text" className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="nombre@ejemplo.com"
                                {...register("email")} />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center pr-2">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1">Contraseña</label>
                                <a onClick={() => {navigate("/recovery-password"); reset();}} className="text-xs font-semibold text-blue-800 transition-all hover:scale-[1.05] hover:cursor-pointer">Olvidé mi contraseña</a>
                            </div>
                            <div className={`group border-b-2 ${errors.password ? "border-red-600" : "border-gray-300 focus-within:border-blue-700"} transition-all flex items-center`}>
                                <input type={`${showPassword ? "text" : "password"}`} className="w-full bg-transparent border-0 py-3 px-1 font-medium text-lg placeholder:text-gray-400 focus:outline-none" placeholder="••••••••"
                                {...register("password")} />
                                <button className="transition-colors px-2 flex items-center" type="button"
                                onClick={() => setShowPassword(!showPassword)}>
                                    <span className={`${showPassword ? "text-blue-600" : "text-gray-400"} hover:text-gray-900 hover:cursor-pointer material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                                </button>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button className="w-full text-gray-100 py-4 px-8 rounded-xl font-bold tracking-wide shadow-lg hover:scale-[1.02] hover:cursor-pointer transition-all duration-300"
                            type="submit"
                            style={{ background: "linear-gradient(135deg, #005dac 0%, #1976d2 100%)" }}>
                                Acceder al Portal
                            </button>
                        </div>
                    </form>
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-500 font-semibold mb-4">
                            ¿Aún no tienes una cuenta?
                        </p>
                        <a onClick={() => {navigate("/register")}} className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-gray-400 text-blue-800 font-bold hover:bg-blue-800 hover:text-gray-100 transition-all hover:cursor-pointer">
                            Regístrate ahora
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );

};