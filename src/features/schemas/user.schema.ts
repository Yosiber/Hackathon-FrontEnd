import z from "zod";

export const registerSchema = z.object({
  name: z.string()
    .nonempty("El nombre es obligatorio")
    .regex(/^[A-ZÑ][A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+){0,4}$/, "Nombre inválido"),
  email: z.string()
    .nonempty("El email es obligatorio")
    .regex(/^[\w.%+-]+@[A-Za-z\d.-]{2,}\.[a-z]{2,6}$/, "Email inválido"),
  password: z.string()
    .nonempty("La contraseña es obligatoria")
    .regex(/^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^a-zA-Z\d]+)[a-zA-Z0-9].{7,30}$/, "Ingresa una Contraseña entre 7 y 30 carácteres, mínimo 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial"),
  age: z.string()
    .nonempty("La edad es obligatoria")
    .regex(/^\d+$/, "Edad inválida")
    .transform((value) => Number(value))
    .refine((value) => value >= 14 && value <= 120, { message: "Edad debe ser entre 14 y 120" }),
  phone: z.string()
    .nonempty("El teléfono es obligatorio")
    .regex(/^3\d{9}$/, "Teléfono inválido"),
  documentType: z.string()
    .nonempty("El tipo de documento es obligatorio"),
  documentNumber: z.string()
    .nonempty("El número de documento es obligatorio")
});
