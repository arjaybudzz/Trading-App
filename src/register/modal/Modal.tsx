import React from 'react'
import { Link } from 'react-router-dom'

export default function Modal() {
  return (
    <div className='flex flex-col bg-slate-800 w-screen h-screen text-white justify-center items-center'>
        <div className='flex flex-col justify-around items-center w-[700px] h-[500px] border-2 border-gray-500 rounded-xl p-4'>
            <div>
                <h1 className='text-3xl'>Account Registered</h1>
            </div>
            <h1 className='text-4xl'>Account is sent to admin for approval.</h1>
            <Link to="/" className='underline text-xl'>Proceed to login</Link>
        </div>
    </div>
  )
}
