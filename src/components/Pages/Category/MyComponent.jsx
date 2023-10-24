"use client";
import { useState, useEffect } from "react";
import styles from './MyComponent.module.css'
import Navbar from './Navbar/Navbar'
import Content from "./Contents/Contents";
const MyComponent = () => {

    const [typewt, settypewt] = useState("โรแมนซ์แฟนตาซี");
  return (
    <div className='mt-5'>
        <div className={styles.container}>
            <Navbar settypewt={settypewt} typewt={typewt} />
        </div>
        <Content typewt={typewt}/>
    </div>
  )
}

export default MyComponent