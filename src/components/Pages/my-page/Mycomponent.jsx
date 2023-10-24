"use client";
import { useState, useEffect } from "react";
import styles from './MyComponent.module.css'
import Content from "./Contents/Contents";
const MyComponent = () => {

  return (
    <div className='mt-20'>
      <div className='my-10'>
        <h1 className="text-3xl font-bold">การ์ตูนที่กำลังติดตาม</h1>
      </div>
      <Content />
    </div>
  )
}

export default MyComponent