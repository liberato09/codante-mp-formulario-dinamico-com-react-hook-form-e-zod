import { ErrorMessage } from '@hookform/error-message';
import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { withMask } from 'use-mask-input';

export default function Form() {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [address, setAddress] = useState({street:'', city:''})

  const {register, handleSubmit, formState: {isSubmitting, errors}} = useForm()  // hook do react-hook-form

  async function handleZipcodeBlur(e: React.FocusEvent<HTMLInputElement>){
    try {
      const zipcode = e.target.value
      const res = await fetch (`https://brasilapi.com.br/api/cep/v2/${zipcode}`)
      const data = await res.json()
      setAddress({
        street: data.street,
        city: data.city
      })
    } catch (error) {
      throw new Error('CEP inválido')
    }
  }

  async function onSubmit(data: FieldValues){
    
    const res = await fetch('https://apis.codante.io/api/register-user/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    const resData = await res.json()
    console.log(resData)

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" {...register('name', {
          required: 'Nome é obrigatório',
          maxLength: {value: 255, message: 'Nome deve ter no máximo 255 caracteres'}
        })}/>
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="name" />
        </p>
        
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" {...register('email')}/>
        <p className="mt-1 text-xs text-red-400">
          <ErrorMessage errors={errors} name="email" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input type={isPasswordVisible ? "text": "password"} id="password" {...register('password')}/>
          <p className="mt-1 text-xs text-red-400">
            <ErrorMessage errors={errors} name="password" />
          </p>
          <span className="absolute right-3 top-3">
            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ):(

                <EyeOffIcon
                      className="text-slate-600 cursor-pointer"
                      size={20}
                    />
              )}

            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input type={isPasswordVisible ? "text": "password"} id="confirm-password" {...register('password_confirmation')}/>
          <p className="mt-1 text-xs text-red-400">
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>
          <span className="absolute right-3 top-3">
          <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ):(

                <EyeOffIcon
                      className="text-slate-600 cursor-pointer"
                      size={20}
                    />
              )}

            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input type="text" id="phone" ref={withMask("(99) 99999-9999")}/>
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" ref={withMask("999.999.999-99")}/>
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input type="text" id="cep" ref={withMask("99999-999")} onBlur={handleZipcodeBlur}/>
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
          value={address.street}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled
          value={address.city}
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input type="checkbox" id="terms" className="mr-2 accent-slate-500" />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{' '}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-200 flex justify-center items-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader className='animate-spin'/>
        ) : ('Cadastrar')}
      </button>
    </form>
  );
}
