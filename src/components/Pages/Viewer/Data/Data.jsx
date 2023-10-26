"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Data = async ({ dataImg }) => {
  useEffect(() => {
    //console.log('dataImg', dataImg);
  }, [dataImg])
  return (

    <div className="flex flex-col items-center justify-center min-h-screen  ">
      {dataImg?.data_img
        ?.sort((a, b) => {
          // แยกเลขออกมาจากชื่อไฟล์
          const numA = parseInt(a.name.match(/\d+/)[0]);
          const numB = parseInt(b.name.match(/\d+/)[0]);

          // เรียงลำดับตามตัวเลข
          return numA - numB;
        })
        .map((chap) => (
          <div key={chap._id} className="flex z-0">
            <div className="w-full">
              <img src={chap.url} alt={chap.name} />
            </div>
          </div>
        ))}
    </div>
  )
}

export default Data