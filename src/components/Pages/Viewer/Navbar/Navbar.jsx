"use client"
import { ArrowBackIcon, ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Input, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { ArrowLeftIcon, Bars3Icon, HeartIcon } from '@heroicons/react/24/outline'
import { RxDashboard } from 'react-icons/rx'
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { DateHelper } from '../../../DateHelper/DataFormat';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

 function Navbar({ Menu, Original ,viewer }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const bg = useColorModeValue('white', 'gray.800')
  const session = useSession();
  const router = useRouter();

  // Function to go back to the previous page in history
  const goBack = () => {
    router.push(`/contents/${viewer?.contentid}`);
  };


  useEffect(() => {
    const hiddenElement = document.getElementById('hiddenElement');
    const hiddenElement1 = document.getElementById('hiddenElement1');
    let isVisible = false;

    function handleScroll() {
      if (window.scrollY === 0) {
        hiddenElement.style.opacity = '1';
        hiddenElement1.style.opacity = '1';
      } else {
        hiddenElement.style.opacity = '0';
        hiddenElement1.style.opacity = '0';
      }

      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        hiddenElement.style.opacity = '0';
        hiddenElement1.style.opacity = '0';
      }
    }

    function handleClick() {
      if (isVisible) {
        hiddenElement.style.opacity = '0';
        hiddenElement1.style.opacity = '0';
        isVisible = false;
      } else {
        hiddenElement.style.opacity = '1';
        hiddenElement1.style.opacity = '1';
        isVisible = true;
      }
    }

    // Initial setup
    hiddenElement.style.transition = 'opacity 0.5s ease-in-out';
    hiddenElement1.style.transition = 'opacity 0.5s ease-in-out';
    hiddenElement.style.opacity = '0';
    hiddenElement1.style.opacity = '0';

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const [result, setResult] = useState({
    nextvalue: null,
    prevvalue: null
  });
  useEffect(() => {
    const chapters = Original;
    const dataimgId = viewer?.id; 

    if (chapters && dataimgId) {
      for (let index = 0; index < chapters.length; index++) {
        const value = chapters[index];
        const prevValue = index > 0 ? chapters[index - 1] : null;
        const nextValue = index < chapters.length - 1 ? chapters[index + 1] : null;
  
        if (value._id === dataimgId) {
          setResult({
            nextvalue: nextValue,
            prevvalue: prevValue
          });
          break; // We found the current value, no need to continue the loop
        }
      }
    }
  

}, [Original ,viewer]);
  




  async function handleCheckchapter(chap) {
    const result =isCanOpen(Menu,chap)
    console.log('chap' , chap);
    if(result){
      router.push(`/viewer/${viewer?.contentid}/${chap._id}`)
    }else{
      onClose();
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
              }).then(() => {
                router.push(`/contents/${viewer?.contentid}`)
              });
            
    }
  }

  const Nextpage = async (index) => {
    
    // console.log('Prevpage --> ', index._id);
      //  console.log('contents --> ', Menu);
       const checkrole = Original.find((check) => check._id === index._id);
      //  console.log('filter ---> ', checkrole);
      const result =isCanOpen(Menu,checkrole)
        if(result){
          router.push(`/viewer/${viewer?.contentid}/${index._id}`)
        }else{
          onClose();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: '<a href="">Why do I have this issue?</a>'
                  }).then(() => {
                    router.push(`/contents/${viewer?.contentid}`)
                  });
                
        }
  
  };
   const Prevpage = async (index) => {  
      //  console.log('Nextpage --> ', index._id);
      //  console.log('contents --> ', Menu);
       const checkrole = Original.find((check) => check._id === index._id);
      //  console.log('filter ---> ', checkrole);
      const result =isCanOpen(Menu,checkrole)
        if(result){
          router.push(`/viewer/${viewer?.contentid}/${index._id}`)
        }else{
          onClose();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: '<a href="">Why do I have this issue?</a>'
                  }).then(() => {
                    router.push(`/contents/${viewer?.contentid}`)
                  });
                
        }
  };

  const isCanOpen = (Menu, chap) => {
    // console.log('chap' ,chap);
    if(chap.upload === true){
      return true
    }else{
      const today = new Date()
      const chek = Menu.some(order =>
        order?.chapter_id === chap._id && today < new Date(order.exdate)
      )
      return chek
    }
   
  }
  const displayStatus = (orders, chap) => {
    const today = new Date()
    const order = orders?.find(order =>
      order?.chapter_id === chap._id && today < new Date(order.exdate)
    )
    // console.log('displayStatus', order)
    if (!order) return <></>
    if (order.status === "เช่า") {
      return <span className={`rounded-full bg-red-500`}>
        <span className="px-2 text-white text-md">
          เช่า
        </span>
      </span>
    } else {
      return <span className={`rounded-full bg-green-500`}>
        <span className="px-2 text-white text-md">
          ซื้อเก็บ
        </span>
      </span>
    }
  }

  return (
    <div className='fixed w-full z-[100]'>
      <Box id="hiddenElement" zIndex={'100'} backgroundColor={bg} opacity={'0.5'}>
        <div className=" ">
          <header>
            <div className="w-full py-3 flex justify-between px-14 z-[100] ">

              <button onClick={goBack}  >
                <ArrowLeftIcon className="hidden h-6 w-6  sm:inline" />
              </button>

              <div className="flex items-center space-x-4 text-sm ">
                <HeartIcon className="hidden h-6 w-6  sm:inline" />
              </div>
            </div>
          </header>
        </div>
      </Box>
      <Box width={'full'} display={'flex'} justifyContent={'center'}>
        <Box id="hiddenElement1" zIndex={'50'} backgroundColor={bg} display={'flex'} justifyContent={'center'} borderRadius={'full'} bgGradient='linear(to-l, #7928CA, #FF0080)' position={'fixed'} bottom={'10'} opacity={'0.5'}>
          <Box backgroundColor={bg} mx={'5px'} my={'4px'} py={'2px'} borderRadius={'full'}>

            <div>
              <header>
                <div className=" flex items-center  rounded-full w-full m-1 z-50">
                  <div className='flex'>
                    {
                      result.nextvalue && (<div className='mx-4'>
                       
                          <ArrowBackIcon onClick={() => Nextpage(result.nextvalue)} className="hidden sm:inline text-2xl cursor-pointer" />
                        
                      </div>)
                    }
                    <div className="mx-4" ref={btnRef} colorScheme='teal' onClick={onOpen}>
                      <RxDashboard  className="hidden   sm:inline text-2xl cursor-pointer" />
                    </div>
                    {
                      result.prevvalue && (<div className='mx-4'>
                       
                          <ArrowForwardIcon onClick={() => Prevpage(result.prevvalue)} className="hidden sm:inline text-2xl cursor-pointer" />
                       
                      </div>)
                    }

                  </div>

               
                </div>
              </header>
            </div>
          </Box>
        </Box>
      </Box>


      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>ตอนทั้งหมด</DrawerHeader>

          <DrawerBody>
            {/* <Input placeholder='Type here...' /> */}
            <div className='mt-2'>
              <ul className="flex flex-wrap Episode_episodeItem ">
      
                <>
                {Original?.sort((a, b) => b.index - a.index)
                  .map((chap) => (
                    <li className="relative  mx-[2px] my-[2px] lg:!w-[calc((97%)/2)] list-none ">
                      <a
                        className="flex flex-none flex-col h-full relative  overflow-hidden"
                        // href={`/viewer/${webtoon}/${chap._id}`}
                        onClick={() => handleCheckchapter(chap)}
                      >
                        <div className="relative w-full bg-white/5 rounded-s-md">
                          <div className="overflow-hidden  inset-0">
                            <picture className="flex w-full h-full">
                            <div className='absolute z-30 p-2 '>
                            {
                            displayStatus(Menu, chap)
                            }
                            {chap.upload === true && chap.status === undefined ?
                            <span className="rounded-full bg-gray-100">
                              <span className="px-2 text-black text-md">
                                ฟรี
                              </span>
                            </span>
                            :
                            <></>}
                              </div>
                              <img
                                src={chap.img}
                                className="w-full h-full object-cover opacity-70"
                              />
                            </picture>
                          </div>
                        </div>
                        <Box px={'12px'} pt={'4px'} pb={'4px'} backgroundColor={bg}  >
                          <p className="whitespace-pre-wrap break-all break-words support-break-word overflow-hidden text-ellipsis !whitespace-nowrap leading-14 s12-regular-white">
                            {chap.index}
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="whitespace-pre-wrap break-all break-words support-break-word overflow-hidden text-ellipsis !whitespace-nowrap leading-14 opacity-50 s11-regular-white">
                              {DateHelper.convertJsDateToSqlDateFormat(new Date(chap.date_upload), false)}
                            </p>
                          </div>
                        </Box>
                      </a>
                    </li>
                  ))}
                </>        
              </ul>
            </div>

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>





  )
}

export default Navbar