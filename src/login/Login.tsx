import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

interface Data {
  email: string,
  password: string,
}

export default function Login() {
  const [userInfo, setUserInfo] = useState<Data>({
    email: '',
    password: ''
  });
  const [logInError, setLogInError] = useState<string>("");

  const navigate: NavigateFunction = useNavigate()

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInfo({...userInfo, email: event.target.value} )
  }

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInfo({...userInfo, password: event.target.value} )
  }

  const validation = yup.object().shape({
    email: yup.string().email("Invalid email format.").required("Please enter your email."),
    password: yup.string().required("Please enter your password"),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validation)
  });

  const submitData = async (data: Data): Promise<void> => {
    await axios.post(`https://trading-app-backend.onrender.com/api/trader_tokens?trader[email]=${data.email}&trader[password]=${data.password}`).then(response => {
      console.log(response);
      localStorage.setItem("traderId", response.data.id);
      localStorage.setItem("traderToken", response.data.trader_token);
      navigate("/dashboard");
    }).catch(() => {setLogInError("Invalid username or email.")})
  }

  return (
    <div className='flex flex-col justify-center items-center bg-slate-800 w-screen h-screen'>
      <form method='POST' className='flex flex-col w-[700px] h-[500px] border-2 justify-center items-center rounded-xl' onSubmit={handleSubmit(submitData)}>
        <div className='flex flex-col justify-center items-center mb-5'>
          <span className='text-xl text-gray-500'>{logInError}</span>
        </div>
        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='email-input' className='text-2xl text-gray-400'>Email:</label>
          <input id='email-input' {...register("email")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateEmail} />
        </div>
        <div className='mt-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.email?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px] mt-9'>
          <label htmlFor='password-input' className='text-2xl text-gray-400'>Password:</label>
          <input type='password' {...register("password")} className='w-[300px] h-11 rounded-xl p-5 outline-none' onChange={updatePassword} />
        </div>
        <div className='mt-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.password?.message}</span>
        </div>
        <div className='flex flex-col justify-center items-center mt-14'>
          <button type='submit' className='text-xl bg-yellow-300 w-[500px] h-11 rounded-xl mt-6'>
            Log in
          </button>

          <p className='text-lg text-white mt-6'>
            Don't have an account? Sign up <Link to="/register" className='text-sky-500'>
              here
            </Link>.
          </p>
          <p className='text-lg text-white mt-6'>
            Are you an admin? log in <Link to="/admin" className='text-sky-500'>here</Link>.
          </p>
        </div>
      </form>
    </div>
  )
}
