import React from 'react'
import LoginForm from '../components/auth/LoginForm'

const Login = () => {
  return (
    <div className='h-screen dark:bg_bg_1 flex items-center justify-center py-[19px] overflow-hidden'>
      Register
      {/*Container*/}
      <div className='flex w-[1600px] mx-auto h-full'>
        {/*Register Form*/}
        <LoginForm />
      </div>    
    </div>
  )
}

export default Login