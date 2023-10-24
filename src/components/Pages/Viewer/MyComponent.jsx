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
  const [post , setPost] = useState();
  const [con , setCon] = useState();
  const [chapter, setChapter] = useState();
  const [dataImg , setDataImg] = useState();
  const handleContextMenu = (e) => {
    e.preventDefault(); // ยกเลิกการแสดงเมนูคลิกขวา
    // ทำสิ่งที่คุณต้องการเมื่อมีการคลิกขวาที่นี่
  };

  useEffect(() => {

    const chapter_id = viewer.contentid;
    fetch(`/api/chapter/${chapter_id}`) // Make sure this URL is correct
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.status}`);
      }
      return res.json();
    })
    .then((content) => {
      try {
        if (session.data?.user) {
          setChapter(content);


          const user = session.data.user.buyrent;
          // คัดกรองข้อมูลจาก filters ที่ตรงกับ content._id
          const filters = user.filter((user) => user.content_id === content._id);

          if (filters.length > 0) {
            // ใช้ filter เพื่อกรอง chapter ที่ตรงกับ contentIds
            const contentIds = filters.map((filter) => filter.chapter_id);

            const chapterfilter = content.chapter.filter((chap) => contentIds.includes(chap._id));

            const updatedChapterFilter = chapterfilter.map((chap, index) => ({
              ...chap,
              upload: true,
              status: filters[index].status
            }));
            // หาข้อมูลที่มี _id ตรงกันใน data1 และ data2
            const mergedData = content.chapter.map(item1 => {
              const matchingItem = updatedChapterFilter.find(item2 => item2._id === item1._id);
              if (matchingItem) {
                return matchingItem; // ใช้ข้อมูลจาก data2
              }
              return item1; // ใช้ข้อมูลเดิมจาก data1
            });

            // ลากตัวแปร mergedData ไปใช้งานต่อ
            setChapter(mergedData)
            const filterDataImg = mergedData.find((data) => data._id === viewer.id)
             if(filterDataImg.upload === true){
              setDataImg(filterDataImg)
             }else{
              route.push(`/contents/${chapter_id}`);
             }
          }
        } else {
          setChapter(content);
        }
      } catch (error) {
        console.log('error', error);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [viewer]);

  useEffect(() => {
    if(session.data?.user){
      const fetchData = async () => {
        try {
          const postData = await getData(viewer.id);
          setPost(postData);
    
          const chapterData = await getDataChapter(viewer.contentid);
          setCon(chapterData);
    
          // Do something with postData and chapterData
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle the error (e.g., display an error message)
        }
      };
    
      fetchData();
    }else{
      route.push('/login')
    }

  }, [viewer]);
  

  return (
    <><div onContextMenu={handleContextMenu}>

      <Navbar data={con} dataimg={post} />
      <div className='container'>
        <Data data={dataImg} content={con} />
      </div>
    </div>
    </>

  )
}

export default MyComponent