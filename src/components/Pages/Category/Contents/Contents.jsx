"use client"
import React from 'react'
import styles from './Content.module.css'
import useSWR from 'swr';



  
const Content = ({typewt}) => {

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: contents } = useSWR(`/api/contents/`, fetcher , { suspense: true })



  return (
    <div className={styles.container}>
    <div className={styles.banner}>
      {/* {Banner.filter((bannerproduct) => bannerproduct.type.en === typewt).map(
      (type_wt) => (
        <div key={type_wt.id} className="relative mb-2">
          <img
            src={type_wt.imageBg}
            className={styles.bannerimg}
          />
        </div>
      )
    )} */}
    </div>
    <div className={styles.grid}>
      {contents
        .filter((content) => content.category === typewt)
        .map((data) => (
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