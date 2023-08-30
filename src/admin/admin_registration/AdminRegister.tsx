import React from 'react'
import * as yup from 'yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios, { AxiosResponse } from 'axios'
import { NavigateFunction, useNavigate } from 'react-router-dom'

interface Admin {
  userName:string,
  firstName:string,
  lastName:string
  email:string,
  password: string,
  passwordConfirmation: string
}

export default function AdminRegister() {
  const [profile, setProfile] = useState<Admin>({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const navigate: NavigateFunction = useNavigate();

  const validation = yup.object().shape({
    userName: yup.string().required("Please enter your username"),
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup.string().email("Invalid email format").required("Please enter your email"),
    password: yup.string().required("Please enter password").min(8).max(20),
    passwordConfirmation: yup.string().required("Please confirm your password").oneOf(["password"], "Passwords do not match").min(8).max(20)
  })

  const { register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(validation)
  })

  const updateUserName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, userName: event.target.value});
  }

  const updateFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, firstName: event.target.value});
  }

  const updateLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, lastName: event.target.value});
  }

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, email: event.target.value});
  }

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, password: event.target.value});
  }

  const updateConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, passwordConfirmation: event.target.value});
  }

  const registerData = async (data: Admin): Promise<void> => {
    await axios.post("https://trading-app-backend.onrender.com/api/admins", {
      username: data.userName,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation
    }).then((response: AxiosResponse<any, any>) => {
      console.log(response);
      navigate("/admin");
    }).catch((error: any) => {
      console.error(error);
    })
  }

  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen bg-slate-800 text-lg'>
      <form method='POST' onSubmit={handleSubmit(registerData)} className='flex flex-col w-[700px] h-[500px] border-2 justify-center items-center rounded-xl'>
        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='userName-input' className='text-2xl text-gray-400'>Username:</label>
          <input id='userName-input' {...register("userName")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateUserName} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.userName?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='firstName-input' className='text-2xl text-gray-400'>First Name:</label>
          <input id='firstName-input' {...register("firstName")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateFirstName} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.firstName?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='lastName-input' className='text-2xl text-gray-400'>Last Name:</label>
          <input id='lastName-input' {...register("lastName")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateLastName} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.lastName?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='email-input' className='text-2xl text-gray-400'>Email:</label>
          <input id='email-input' {...register("email")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateEmail} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.email?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='password-input' className='text-2xl text-gray-400'>Password:</label>
          <input id='password-input' type='password' {...register("password")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updatePassword} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.password?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='confirmPassword-input' className='text-2xl text-gray-400'>Confirm Password:</label>
          <input id='confirmPassword-input' {...register("passwordConfirmation")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateConfirmPassword} type='password' />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.passwordConfirmation?.message}</span>
        </div>

        <button type='submit' className='text-xl bg-yellow-300 w-[500px] h-11 rounded-xl mt-5'>
            Register
          </button>
      </form>
    </div>
  )
}
