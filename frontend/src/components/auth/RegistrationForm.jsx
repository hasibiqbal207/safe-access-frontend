import React from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Schema } from 'yup'
import AuthInput from './AuthInput'

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema ),
  })

  const onSubmit = (data) => console.log(data)
  console.log("values", watch())
  console.log("errors", errors);

  return (
    <div className='h-screen w-full flex items-center justify-center overflow-hidden'>
        {/* Container */}
        RegistrationForm
        <div className="max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div>
              <h2 className='mt-6 text-3xl font-bold'>Welcome</h2>
              <p className='mt-2 text-sm'>Sign Up</p>
            </div>
            <div>
              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)} 
                className='mt-6 space-y-6'
              >
                <AuthInput 
                  name='name'
                  type='text'
                  placeholder='Full Name'
                  register={register}
                  error={errors?.name?.message}
                />

                <AuthInput 
                  name='email'
                  type='text'
                  placeholder='Email Address'
                  register={register}
                  error={errors?.email?.message}
                />

                <AuthInput 
                  name='status'
                  type='text'
                  placeholder='Status'
                  register={register}
                  error={errors?.status?.message}
                />

                <AuthInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  register={register}
                  error={errors?.password?.message}
                />
                <button type='submit'>Submit</button>
              </form>
            </div>
        </div>
    </div>
  )
}

export default RegistrationForm