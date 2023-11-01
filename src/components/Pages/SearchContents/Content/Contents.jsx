"use client"
import React from 'react'
import styles from './Content.module.css'
import useSWR from 'swr';



  
const Content = ({typewt}) => {

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: contents } = useSWR(`/api/contents/`, fetcher , { suspense: true })



  return (

    <div className={styles.container}>
       <div>
        <h1 className='text-3xl font-bold mt-11'>ผลการค้นหา</h1>
      </div>
    <div className={styles.grid}>
     
      {typewt ? 
      <>
        {contents
        .filter((content) => content.title === typewt)
        .map((data) => (
          <div key={data._id} className="relative responsive-cell-rating mt-10">
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
      </> 
        : <>
      {contents.map((data) => (
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
        ))}</>
      }
      
    </div>
  </div>
  )
}

export default Content