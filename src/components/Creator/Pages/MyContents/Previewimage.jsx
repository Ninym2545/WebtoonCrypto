import React from 'react'
import {TiDeleteOutline} from 'react-icons/ti'

const Previewimage = ({url , onClick}) => {
  return (
    <div className='z-40'>
        
        <div >
        <img src={url} className='rounded-md h-full w-full' property/>
        </div>
        <div className='absolute top-[20px] right-[40px] w-10 h-10 z-50 cursor-pointer'>
        <TiDeleteOutline className='text-red-500 w-10 h-10' onClick={onClick} />
        </div>
       
    </div>
  )
}

export default Previewimage