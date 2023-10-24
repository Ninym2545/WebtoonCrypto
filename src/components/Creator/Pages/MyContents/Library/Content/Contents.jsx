"use client"
import React, { useEffect, useState } from 'react'
import styles from './Content.module.css'
import useSWR from 'swr';
import { useSession } from 'next-auth/react';


  
const Content = ({typewt}) => {
    const [contents, setcontents] = useState([]);
    const session = useSession();

    // useEffect(() => {
    //   const data = getData().then((value) => {
    //     console.log("data : ", value);
  
    //     setcontents(value);
    //   });
    // }, []);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, isLoading } = useSWR(
        `/api/contents/${session?.data?.user._id}`,
        fetcher
    );

  return (
    <div className={styles.container}>
    <div className={styles.grid}>
      {data?.filter((content) => content.category === typewt).map((data) => (
          <div key={data._id} className="relative responsive-cell-library ">
            <div className="relative w-full bg-transparent">
              <a
                className="w-full h-full relative overflow-hidden before:absolute before:inset-0 before:bg-grey-01 before:-z-1"
                href={`/creator/${data._id}`}
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