import React from 'react'
import dynamic from 'next/dynamic';


const MyClientComponent = dynamic(() => import('../../components/Pages/CreatorApplication/Mycomponent'), {
  ssr: false, // Treat this component as a "Client Component"
});

const page = () => {
  return (
    <div className='container'>
        <MyClientComponent/>
    </div>
  )
}

export default page