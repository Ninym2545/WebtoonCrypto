"use client"
import React, { FC, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Box, useColorModeValue } from "@chakra-ui/react";

const WT_Category = [
    { typewt: { en: 'romancefan', th: 'โรแมนซ์แฟนตาซี' } },
    { typewt: { en: 'romance', th: 'โรแมนซ์' } },
    { typewt: { en: 'action', th: 'แอ็กชัน' } },
    { typewt: { en: 'drama', th: 'ดราม่า' } },
    { typewt: { en: 'horror', th: 'สยองขวัญ' } },
    { typewt: { en: 'commedy', th: 'ตลก' } },

];

const Navbar = ({ settypewt, typewt }) => {
    const bg = useColorModeValue('white', 'gray.800')
    const [categorys, setcategorys] = useState([
    ]);

    useEffect(() => {
        fetch(`/api/category`)
        .then((response) => response.json())
        .then((data) => setcategorys(data));
       
    }, []);


    return (
        <div className="w-full">
              <div className={styles.container}>
            <div className={styles.weeknav}>
                <ul className={styles.ulrank}>
                    {
                        categorys.map(category => (
                            <li key={category._id} className={`${styles.lirank}  ${category.category.th === typewt ? "liactionrank" : ""}`} >
                                <button className={styles.lirank} onClick={() => { settypewt(category.category.th) }} ><p className={styles.links}>{category.category.th}</p></button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
        </div>
      
    );
};

export default Navbar;
