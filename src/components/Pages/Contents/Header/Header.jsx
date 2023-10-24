import React from 'react'
import styles from './Header.module.css'



const Header = async ({details}) => {

  
  
  return (
    <div className={styles.container}>
    <div className={styles.item}>
      <div>
        <div className="flex space-x-2 items-center mb-7">
          <div className=" bg-red-600 text-white h-6 text-sm font-semibold rounded-lg px-2 pt-[3px]  cursor-pointer">
            {details.status}
          </div>
          <div className=" bg-gray-400 text-white h-6 text-sm font-semibold rounded-lg px-2 pt-[3px] cursor-pointer">
            วัน{details.day}
          </div>
          <div className=" bg-yellow-500 text-white h-6 text-sm font-semibold rounded-lg px-2 pt-[3px] cursor-pointer">
            {details.category}
          </div>
        </div>

        <h1 className="text-6xl font-bold cursor-default">{details.title}</h1>
        <p className="text-shadow-md text-lg pl-1 pb-8 pt-1 cursor-default">
          ผู้แต่ง :{details.author}
        </p>
        <p className="text-shadow-md text-xl pl-1 font-bold text-red-400 cursor-default pb-1">
          เรื่องย่อ
        </p>
        <p className="text-shadow-md text-xl max-w-xl pl-1 cursor-default">
          {details.desc}
        </p>
      </div>
    </div>
    <div className={styles.item}>
      <img src={details.poster_deatils} alt="" className={styles.imgpos} />
    </div>
  </div>
  )
}

export default Header