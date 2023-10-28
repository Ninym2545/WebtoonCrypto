"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../Viewer/Navbar/Navbar'
import Data from './Data/Data'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

async function getDataChapter(contentid) {

  const res = await fetch(`http://localhost:3000/api/chapter/${contentid}`, {
    cache: "no-store",
  });


  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getData(id) {
  const res = await fetch(`http://localhost:3000/api/viewer/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return notFound();
  }

  return res.json();
}

const MyComponent = async ({ viewer }) => {

  const route = useRouter();
  const session = useSession();
  const [Menu , setMenu] = useState();
  const [MenuNotRent , setMenuNotRent] = useState();
  const [dataImg , setDataImg] = useState();
  
  // new
  const [FilterChapter , setFilterChapter] = useState();
  const [originaChapters, setOriginaChapters] = useState([])
  const [orders, setOrders] = useState([]);
  const handleContextMenu = (e) => {
    e.preventDefault(); // ยกเลิกการแสดงเมนูคลิกขวา
    // ทำสิ่งที่คุณต้องการเมื่อมีการคลิกขวาที่นี่
  };

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      window.location.href = "/";
    }
    const chapter_id = viewer.contentid;
    fetch(`/api/chapter/${chapter_id}` , { cache: 'no-store' } ) // Make sure this URL is correct
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.status}`);
      }
      return res.json();
    })
    .then((content) => {
      // console.log('content ' ,content?.chapter);
      if (content?.chapter) {
        const filterChapter = content?.chapter.find(item => item._id === viewer.id )
        // console.log('view' ,filterChapter);
        setFilterChapter(filterChapter)
        setOriginaChapters(content?.chapter)
        // console.log('MyChapter', session?.data?.user.buyrent);
        const myorders = session?.data?.user.buyrent;
        setOrders(myorders)
      }

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [viewer]);


  

  return (
    <><div onContextMenu={handleContextMenu}>
 
      <Navbar Menu={orders} Original={originaChapters} viewer={viewer}/>
      <div className='container'>
        <Data dataImg={FilterChapter}  />
      </div>
    </div>
    </>

  )
}

export default MyComponent