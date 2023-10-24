import React from 'react'
import styles from './Contents.module.css'
import useSWR from 'swr';

const WT_Categoryweek = [
    { en: "Mon", th: "จันทร์", indexd: 1 },
    { en: "Tue", th: "อังคาร", indexd: 2 },
    { en: "Wed", th: "พุธ", indexd: 3 },
    { en: "Thu", th: "พฤหัสบดี", indexd: 4 },
    { en: "Fri", th: "ศุกร์", indexd: 5 },
    { en: "Sat", th: "เสาร์", indexd: 6 },
    { en: "Sun", th: "อาทิตย์", indexd: 0 },
  ];

const Content =  () => {

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: contents } = useSWR(`/api/contents/`, fetcher , { suspense: true })



  return (
    <div className={styles.container}>
    <div className={styles.cartoon}>
      <div className={styles.card}>
        {WT_Categoryweek.map((day) => (
          <div className={styles.daysection} id={day.en}>
            <h2 className={styles.header}>วัน{day.th}</h2>

            <div className={styles.grid}>
              {contents.filter((dayproduct ) => dayproduct.day === day.th).map((data) => (
                  <div key={data._id} className="relative responsive-cell ">
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
        ))}
      </div>
    </div>
  </div>
  )
}

export default Content