import { z } from "zod";

export const userRegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z
      .string()
      .min(1, { message: "Email obrigatório" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
    password_confirmation: z.string().min(8, {
      message: "Confirmação de senha deve ter no mínimo 8 caracteres",
    }),
    phone: z
      .string()
      .min(1, { message: "Telefone é obrigatório" })
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Telefone inválido" }),
    cpf: z
      .string()
      .min(1, { message: "CPF é obrigatório" })
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido" }),
    zipcode: z
      .string()
      .min(1, { message: "CEP é obrigatório" })
      .regex(/^\d{5}-\d{3}$/, { message: "CEP inválido" }),
    city: z.string().min(1, { message: "Cidade é obrigatória" }),
    address: z.string().min(1, { message: "Estado é obrigatório" }),
    terms: z.boolean({ message: "Termos de uso são obrigatórios" }),
  })
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    {
      message: "Senhas não conferem",
      path: ["password_confirmation"],
    }
  );

export type UserRegister = z.infer<typeof userRegisterSchema>;
