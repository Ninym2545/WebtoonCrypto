
import React, { FC, useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-scroll";
import { Box, useColorModeValue } from "@chakra-ui/react";



const Navbar= ({ currDay }) => {
  const [click] = useState(false);
  const bg = useColorModeValue('white', 'gray.800')
  return (
    
    <div className={styles.container}>
      <Box position={'fixed'} top={'0.5'} right={'0.5'} left={'0.5'} height={'130px'} backgroundColor={bg} opacity={'0.4'}></Box>
      <div className={styles.weeknav}>
        <ul className={styles.section}>
          <li className={click ? styles.daysection + styles.active  : styles.daysection}>
            <Link
              className={styles.links}
              to="Mon"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                จ.
              </p>
            </Link>
          </li>
          <li className={click ? styles.daysection + styles.active : styles.daysection}>
            <Link
               className={styles.links}
              to="Tue"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                อ.
              </p>
            </Link>
          </li>
          <li className={click ? styles.daysection + styles.active : styles.daysection}>
            <Link
               className={styles.links}
              to="Wed"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                พ.
              </p>
            </Link>
          </li>
          <li className={click ? styles.daysection + styles.active : styles.daysection}>
            <Link
               className={styles.links}
              to="Thu"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                พฤ.
              </p>
            </Link>
          </li>
          <li className={click ? styles.daysection + styles.active : styles.daysection}>
            <Link
               className={styles.links}
              to="Fri"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                ศ.
              </p>
            </Link>
          </li>
          <li className={click ? styles.daysection + styles.active : styles.daysection}>
            <Link
              className={styles.links}
              to="Sat"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                ส.
              </p>
            </Link>
          </li>
          <li className={click ? styles.daysection + styles.active : styles.daysection}>
            <Link
              className={styles.links}
              to="Sun"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
            >
              <p className="">
                {" "}
                อา.
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
