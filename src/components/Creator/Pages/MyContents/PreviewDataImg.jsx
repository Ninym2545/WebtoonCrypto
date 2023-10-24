import React from 'react'
import {TiDeleteOutline} from 'react-icons/ti'

const PreviewDataImg = ({url , onClick}) => {
  return (
    <div className='z-40'>
        
        <div >
        <img src={url} className='rounded-md h-full w-full' property/>
        </div>
        <div className='absolute top-[20px] right-[40px] w-10 h-10 z-50 cursor-pointer'>
        </div>
       
    </div>
  )
}

export default PreviewDataImg