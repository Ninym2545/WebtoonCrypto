"use client";
import { useState, useEffect } from "react";
import styles from './MyComponent.module.css'

import Content from "./Content/Contents";
import { Input } from "@chakra-ui/react";
const MyComponent = () => {

  const [typewt, setTypewt] = useState("");
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    console.log('value' ,inputValue );
    setTypewt(inputValue);
  }
  return (
    <div className='mt-32'>
      <div className="flex justify-between">
      <div className=''>
        <h1 className="text-3xl font-bold">ค้นหาการ์ตูน</h1>
      </div>
      <div className="w-[50%]">
        <Input variant='flushed' placeholder='Flushed'  onChange={handleInputChange} value={typewt} />
      </div>
      </div>
      <Content typewt={typewt} />
    </div>
  )
}

export default MyComponent