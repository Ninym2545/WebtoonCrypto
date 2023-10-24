"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Data = async ({data , content}) => {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  ">
    {data?.data_img.sort((a, b) => a.name.localeCompare(b.name)).map((chap) => (
        <div  className="flex z-0">
            
          <div className="w-full">
            <img src={chap.url}/>
          </div>
        </div>
      ))}
  </div>
  )
}

export default Data