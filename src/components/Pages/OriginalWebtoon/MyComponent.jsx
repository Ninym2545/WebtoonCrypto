"use client"
import { React, useState, useEffect } from 'react'
import styles from './MyComponent.module.css'
import Navbar from './Navbar/Navbar';
import Content from './Contents/Contents';

const MyComponent = () => {

    const [currDay, setCurrDay] = useState(0);

    useEffect(() => {
        var dt = new Date();
        setCurrDay(dt.getDay());

        const element = document.getElementById(
            [
                { en: "Mon", th: "จันทร์", indexd: 1 },
                { en: "Tue", th: "อังคาร", indexd: 2 },
                { en: "Wed", th: "พุธ", indexd: 3 },
                { en: "Thu", th: "พฤหัสบดี", indexd: 4 },
                { en: "Fri", th: "ศุกร์", indexd: 5 },
                { en: "Sat", th: "เสาร์", indexd: 6 },
                { en: "Sun", th: "อาทิตย์", indexd: 0 },
            ].find((item) => item.indexd === dt.getDay())?.en || ""
        );
        element?.scrollIntoView();
    }, []);

    return (
        <div className='mt-5'>

            <div className={styles.container}>
                <Navbar currDay={currDay}  />
                <Content />
            </div>
        </div>
    )
}

export default MyComponent