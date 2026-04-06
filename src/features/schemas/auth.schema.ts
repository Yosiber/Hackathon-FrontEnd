import z from "zod";

export const verifyRegistrationSchema = z.object({
    code: z.string()
      .nonempty("Por favor ingresa Código")
      .regex(/^\d{6}$/, "Ingresa un código e 6 dígitos")
})

export const loginSchema = z.object({
    email: z.string()
      .nonempty("El email es obligatorio")
      .regex(/^[\w.%+-]+@[A-Za-z\d.-]{2,}\.[a-z]{2,6}$/, "Ingresa un correo válido"),
    password: z.string()
      .nonempty("La contraseña es obligatoria")
      .regex(/^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^a-zA-Z\d]+)[a-zA-Z0-9].{7,30}$/, "Ingresa una contraseña válida"),
})

export const recoveryPasswordSchema = z.object({
    password: z.string()
      .nonempty("La contraseña es obligatoria")
      .regex(/^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^a-zA-Z\d]+)[a-zA-Z0-9].{7,30}$/, "Ingresa una Contraseña entre 7 y 30 carácteres, mínimo 1 minúscula,  mayúscula y 1 número"),
})