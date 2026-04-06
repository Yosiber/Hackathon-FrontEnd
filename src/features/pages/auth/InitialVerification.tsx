import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type z from "zod";
import { verifyRegistrationSchema } from "../../schemas/auth.schema";

import { useUsers } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFirstFormError } from "../../assets/scripts/getFirstFormError";
import ErrorAlert from "../../components/form/ErrorAlert";
import { OtpInputField } from "../../components/form/OtpInput";

type VerifyRegisterFormValues = z.infer<typeof verifyRegistrationSchema>

export default function InitialVerification() {

    const { verifyUserRegistration, resendSignupCode, serverError } = useUsers();
    const [ resendCount, setResendCount ] = useState(1);

    const { handleSubmit, formState: { errors, isSubmitted }, reset, control } = useForm({
        resolver: zodResolver(verifyRegistrationSchema)
    });

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const createdUserId = location.state?.createdUserId;

    const errorMessage = getFirstFormError(errors, serverError);

    const onSubmit = async (data: VerifyRegisterFormValues) => {
        const response = await verifyUserRegistration({...data, createdUserId: createdUserId})
        if (response) {
            navigate("/login", {
                state: { successRegister: "Has verificado tu cuenta satisfactoriamente" }
            });
            reset();
        }
    }

    const resendCode = async () => {
        await resendSignupCode(createdUserId);
    }

    useEffect(() => {
      if (email === undefined || createdUserId === undefined) {
          navigate("/error/403");
          return;
      }
    },[email, createdUserId, navigate])

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-x-hidden">
            {resendCount > 0 && (
                <ErrorAlert key={resendCount} message={`Un código de verificación ha sido enviado a ${email}`} status="success" />
            )}
            {isSubmitted && errorMessage && (
                <ErrorAlert key={errorMessage} message={errorMessage} status="error" />
            )}
            <div className="w-full max-w-2xl px-6 py-12 relative-z-10">
                <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
                    <span className="font-bold uppercase tracking-widest text-gray-400">
                        Registro
                    </span>
                    <span className="material-symbols-outlined text-gray-400 !text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_right</span>
                    <span className="font-bold uppercase tracking-widest text-blue-700">
                        Verificación
                    </span>
                </nav>
                <div className="rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-white/50">
                    <div className="mb-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-400/10 rounded-full mb-8 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-800 !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_unread</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Verifica tu correo</h1>
                        <p className="max-w-sm text-gray-500">
                            Hemos enviado un código de seguridad a<br/>
                            <span className="font-bold text-gray-800">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        <OtpInputField control={control} name="code"/>
                        <div className="space-y-6">
                            <button className="w-full py-5 rounded-2xl text-gray-100 font-bold text-lg shadow-lg shadow-gray-300 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:cursor-pointer" type="submit"
                            style={{ background: "linear-gradient(135deg, #005dac 0%, #1976d2 100%)" }}><span>Verificar Identidad</span>
                            </button>
                            <div className="text-center">
                                <button className="text-blue-800 font-bold hover:scale-[1.05] inline-flex items-center gap-1 text-sm transition-all hover:cursor-pointer" type="button"
                                onClick={() => {resendCode();setResendCount(prev => prev + 1)} }>
                                    <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>refresh</span>
                                    Reenviar código
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );

};