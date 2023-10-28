"use client"
import React, { useEffect, useState } from 'react'
import styles from './Content.module.css'
import useSWR from 'swr';
import { useSession } from 'next-auth/react';



  
const Content = ({typewt}) => {

  const session = useSession();

  const [filteredData, setFilteredData] = useState([]); // สร้างตัวแปรใหม่เพื่อเก็บข้อมูลที่คัดกรองแล้ว

  useEffect(() => {
    fetch(`/api/follow/${session?.data?.user._id}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((content) => {
 
        fetch("/api/contents" , { cache: 'no-store' })
        .then((res) => res.json())
        .then((db2Content) => {
          // ตรวจสอบแต่ละรายการใน Db1 และคัดกรองข้อมูลจาก Db2
          const filteredContent = content.map((item) => {
            const contentId = item.content_id;
            const matchingDb2Item = db2Content.find((db2Item) => db2Item._id === contentId);

            return matchingDb2Item || null; // ถ้าไม่พบข้อมูลใน Db2 ให้ return null
          });

          setFilteredData(filteredContent);
        });
      }); 
  }, []);
  

  return (
    <div className={styles.container}>
    <div className={styles.grid}>
      {filteredData?.map((data) => (
          <div key={data._id} className="relative responsive-cell-rating ">
            <div className="relative w-full bg-transparent">
              <a
                className="w-full h-full relative overflow-hidden before:absolute before:inset-0 before:bg-grey-01 before:-z-1"
                href={`/contents/${data._id}`}
              >
                <picture>
                  <img src={data.background} className="z-10" />
                </picture>
                <picture>
                  <div className="justify-end  absolute flex  bottom-0  ">
                    <img src={data.poster} className="" />
                  </div>
                </picture>

                <div className="w-full bottom-0 left-0 absolute h-full bg-gradient-to-t from-[#0F0F0F] opacity-60"></div>

                <div className="flex absolute bottom-2   ">
                  <img src={data.logo} className="" />
                </div>
              </a>
            </div>
          </div>
        ))}
    </div>
  </div>
  )
}

export default Content