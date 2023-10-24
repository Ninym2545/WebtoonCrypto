import React from 'react'
import {TiDeleteOutline} from 'react-icons/ti'
const Previewinput = ({url , onClick}) => {
  return (
    <div className='z-40'>
        <div >
        <img src={url} className='rounded-md w-52 ' property/>
        </div>
        <div className='absolute top-[50px] right-[70px] w-10 h-10 z-50 cursor-pointer'>
        <TiDeleteOutline className='text-red-500 w-10 h-10' onClick={onClick} />
        </div>
       
    </div>
  )
}

export default Previewinput