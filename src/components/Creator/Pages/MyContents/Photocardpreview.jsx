import React , { useTransition } from 'react'
import Image from 'next/image'
import {AiFillDelete} from 'react-icons/ai'

const Photocardpreview = ({url , onClicks}) => {

  const [isPending , startTransition] = useTransition();

  return (
    <div>
      <div className='reverse'>
        <img src={url}  priority />
        <div className=' text-red-500'>
        <button  onClick={onClicks}>
          <AiFillDelete  className='w-7 h-8 cursor-pointer' /> 
        </button>
        </div>
        
      </div>
    
    </div>
  )
}

export default Photocardpreview