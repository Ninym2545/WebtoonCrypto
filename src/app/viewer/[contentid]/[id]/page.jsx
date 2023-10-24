
import React from 'react'
import styles from './page.module.css'
import dynamic from 'next/dynamic';



const MyClientComponent = dynamic(() => import('../../../../components/Pages/Viewer/MyComponent'), {
  ssr: false, // Treat this component as a "Client Component"
});



async function getData(id) {
    const res = await fetch(`http://localhost:3000/api/viewer/${id}`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      return notFound();
    }
  
    return res.json();
  }

  export async function generateMetadata({ params }) {
    const post = await getData(params.id);
    
    return {
      title: post.title,
      description: post.desc,
    };
  }

const page = ({params}) => {

  return (


      <MyClientComponent viewer={params}/>
  )
}

export default page