import React from 'react'
import RegistrationForm from '../components/auth/RegistrationForm'

const Register = () => {
  return (
    <div className='h-screen dark:bg_bg_1 flex items-center justify-center py-[19px] overflow-hidden'>
      Register
      {/*Container*/}
      <div className='flex w-[1600px] mx-auto h-full'>
        {/*Register Form*/}
        <RegistrationForm />
      </div>    
    </div>
  )
}

export default Register