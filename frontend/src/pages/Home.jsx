import React from 'react'
import { useDispatch } from "react-redux";
import { logout } from '../features/userSlice';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => { dispatch(logout()); navigate("/login"); }} className='border px-4 py-2 bg-red-500 text-white'>Logout</button>
    </div>
  )
}

export default Home