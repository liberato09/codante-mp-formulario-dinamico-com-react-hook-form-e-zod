import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";

export default function Form() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const [address, setAddress] = useState({ street: "", city: "" });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm(); // hook do react-hook-form

  const registerWithMask = useHookFormMask(register);

  async function handleZipcodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    try {
      const zipcode = e.target.value;
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);

      if (res.ok) {
        const data = await res.json();
        setValue("address", data.street);
        setValue("city", data.city);
      }
    } catch (error) {
      throw new Error("CEP inválido");
    }
  }

  async function onSubmit(data: FieldValues) {
    const res = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      // Cada api irá retornar um erro diferente, então é necessário tratar cada um deles
      // setError('email', { type: 'manual', message: 'CPF não é válido' });

      for (const field in resData.errors) {
        setError(field, { type: "manual", message: resData.errors[field] });
      }
    }
    console.log(resData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "Nome é obrigatório",
            maxLength: {
              value: 255,
              message: "Nome deve ter no máximo 255 caracteres",
            },
          })}
        />
        {/* {errors.name && (
          <p className="mt-1 text-xs text-red-400">
            {errors.name?.message as string}
          </p>
        )} */}
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="name" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input
          className=""
          type="email"
          id="email"
          {...register("email", {
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "E-mail inválido",
            },
          })}
        />
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="email" />
        </p>
      </div>
      {/* SENHA */}
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: {
                value: 8,
                message: "Senha deve ter no mínimo 8 caracteres",
              },
            })}
          />
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
          <p className="mt-1 text-xs text-red-400">
            <ErrorMessage errors={errors} name="password" />
          </p>
        </div>
      </div>

      {/* CONFIRMAÇÃO DA SENHA */}
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="confirm-password"
            {...register("password_confirmation", {
              required: "Confirmação de senha é obrigatória",
              minLength: {
                value: 8,
                message: "Senha deve ter no mínimo 8 caracteres",
              },
              validate: (value, formValues) => {
                return value === formValues.password || "Senhas não coincidem";
              },
            })}
          />
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
          <p className="mt-1 text-xs text-red-400">
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>
        </div>
      </div>

      {/* TELEFONE */}
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...registerWithMask("phone", "(99) 99999-9999", {
            required: "Telefone é obrigatório",
            pattern: {
              value: /^\(\d{2}\) \d{5}-\d{4}$/,
              message: "Telefone inválido",
            },
          })}
        />
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="phone" />
        </p>
      </div>

      {/* CPF */}
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask("cpf", "999.999.999-99", {
            required: "CPF é obrigatório",
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: "CPF inválido",
            },
          })}
        />
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="cpf" />
        </p>
      </div>

      {/* CEP */}
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...registerWithMask("zipcode", "99999-999", {
            required: "CEP é obrigatório",
            pattern: {
              value: /^\d{5}-\d{3}$/,
              message: "CEP inválido",
            },
            onBlur: handleZipcodeBlur, // passando o onBlur para o hook
          })}
          // onBlur={handleZipcodeBlur}
        />
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="zipcode" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
          {...register("address")}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled
          {...register("city")}
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms", {
            required: "Aceite os termos e condições",
          })}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="terms" />
        </p>
      </div>

      <button
        type="submit"
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-200 flex justify-center items-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader className="animate-spin" /> : "Cadastrar"}
      </button>
    </form>
  );
}
