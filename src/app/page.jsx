"use client"

import React, { useState } from "react";
import styles from './page.module.css'
import Image from "next/image";
import lycoris from "../assets/lycoris.png";
import { Input } from "@chakra-ui/react";
import Content from "../components/Pages/SearchContents/Content/Contents";


const page = () => {
  
  const [typewt, setTypewt] = useState("");
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    console.log('value' ,inputValue );
    setTypewt(inputValue);
  }
  return (
    <>
    <div className="w-[15%] right-[850px] mt-[10px] z-[100]  fixed">
        <Input variant='flushed' placeholder='ค้นหาการ์ตูน'onChange={handleInputChange} value={typewt}  />
      </div>
      {typewt ?  <div className='container'>
        
    <Content typewt={typewt} />
    </div> :
       <div className="container">
       <div className={styles.container}>
         <div className={styles.item}>
           <h1 className={styles.title}>Lycoris Recoil</h1>
           <p className={styles.desc}>
             กลุ่มสาวน้อยผู้สร้างความสงบสุขให้แก่ชาวเมือง
             เบื้องหลังคือองค์กรลับผู้ต่อสู้กับอาชญากรในสังกัด DA มีนามว่า
             Lycoris
           </p>
           <button className={styles.button}>อ่านเลย</button>
         </div>
         <div className={styles.item}>
           <img src='lycoris.png' alt="" className={styles.img} />
         </div>
       </div>
     </div>
      }
   
   
    </>
  );
};

export default page;
