import React from 'react'
import dynamic from 'next/dynamic';

const MyClientComponent = dynamic(() => import('../../components/Pages/Topup/Mycomponent'), {
  ssr: false, // Treat this component as a "Client Component"
});

export const metadata = {
  title: "เติมแคช",
  description: "Generated by create next app",
};

const page = () => {
  return (
    <div className='container'>
        <MyClientComponent/>
    </div>
  )
}

export default page