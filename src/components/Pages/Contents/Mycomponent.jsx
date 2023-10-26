import React from 'react'
import styles from './Mycomponent.module.css'
import Navbar from './Navbar/Navbar';
import Header from './Header/Header';
import Chapter from './Chapter/Chapter';


async function getData(id) {
  const res = await fetch(`http://localhost:3000/api/showcontents/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return notFound();
  }

  return res.json();
}


const Mycomponent = async ({content_id}) => {
  const data = await getData(content_id);
  
  return (
    <>
     <Navbar data={data} />
     <div className='container'>
     <Header details={data} />
     <Chapter webtoon={content_id}  />
     </div>
    </>


  )
}

export default Mycomponent