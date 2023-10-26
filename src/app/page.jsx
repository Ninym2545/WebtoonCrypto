
import React from "react";
import styles from './page.module.css'
import Image from "next/image";
import lycoris from "../assets/lycoris.png";

export const metadata = {
  title: "Webtoon",
  description: "©2023 Webtoon. All rights reserved.",
};

const page = () => {
  
  return (
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
          <Image src={lycoris} alt="" className={styles.img} />
        </div>
      </div>
    </div>
  );
};

export default page;
