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

 function Navbar({ data, dataimg }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const bg = useColorModeValue('white', 'gray.800')
  const session = useSession();
  const router = useRouter();
  // console.log(data)
  // Function to go back to the previous page in history
  const goBack = () => {
    router.push(`/contents/${data._id}`);
  };
  const [chapter, setChapter] = useState();

  useEffect(() => {
    const contents_id = data?._id
    fetch(`/api/chapter/${contents_id}`) // Make sure this URL is correct
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
      })
      .then((content) => {
        try {
            setChapter(content);
            const user = session?.data?.user.buyrent;
            // คัดกรองข้อมูลจาก filters ที่ตรงกับ content._id
            const filters = user.filter((user) => user.content_id === content._id);

            if (filters.length > 0) {
              // ใช้ filter เพื่อกรอง chapter ที่ตรงกับ contentIds
              const contentIds = filters.map((filter) => filter.chapter_id);
              // console.log('filter_status ---> ', filters);
              const chapterfilter = content.chapter.filter((chap) => contentIds.includes(chap._id));
              // console.log('filter', chapterfilter);
              const updatedChapterFilter = chapterfilter.map((chap, index) => ({
                ...chap,
                upload: true,
                status: filters[index].status
              }));
              // หาข้อมูลที่มี _id ตรงกันใน data1 และ data2
              const mergedData = content.chapter.map(item1 => {
                const matchingItem = updatedChapterFilter.find(item2 => item2._id === item1._id);
                if (matchingItem) {
                  return matchingItem; // ใช้ข้อมูลจาก data2
                }
                return item1; // ใช้ข้อมูลเดิมจาก data1
              });

              // ลากตัวแปร mergedData ไปใช้งานต่อ
              // console.log(mergedData);
              setChapter(mergedData)
              // console.log('chapter ---> ', chapter);
            }
          
        } catch (error) {
          console.log('error', error); 
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [data]);

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
    const chapters = chapter;
    const dataimgId = dataimg?._id;
  
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
  }, [chapter, dataimg?._id]);

  const [tickerBuy, setTickerBuy] = useState()
  const [SelectedChapterId, setSelectedChapterId] = useState()
  const [tickerRent, setTickerRent] = useState()
  const rent = 'เช่า'
  const buy = 'ซื้อเก็บ'

  async function handleCheckchapter(index) {
    if(session.data?.user){
      if (index.upload === true) {
        router.push(`/viewer/${data._id}/${index._id}`)
      } else {
        onClose();
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'คุณยังไม่ได้ซื้อตอนนี้!',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/contents/${data._id}`);
          }
        });
      }
    }else{
      router.push('/login')
    }

  }
 
  

  const Nextpage = async (index) => {
    console.log('Prevpage --> ', index._id);
    console.log('content --> ', chapter);
    const checkrole = chapter.find((check) => check._id === index._id);
    console.log('filter ---> ', checkrole);
    if(checkrole.upload === true){
       router.push(`/viewer/${data._id}/${index._id}`);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'คุณยังไม่ได้ซื้อตอนนี้!',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/contents/${data._id}`);
        }
      });
    }
  };
   const Prevpage = async (index) => {  
    console.log('Prevpage --> ', index._id);
    console.log('content --> ', chapter);
    const checkrole = chapter.find((check) => check._id === index._id);
    console.log('filter ---> ', checkrole);
    if(checkrole.upload === true){
       router.push(`/viewer/${data._id}/${index._id}`);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'คุณยังไม่ได้ซื้อตอนนี้!',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/contents/${data._id}`);
        }
      });
    }
  };




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
                {chapter?.sort((a, b) => b.index - a.index)
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
                                {chap.status && (
                                  <span className={`rounded-full ${chap.status === 'เช่า' ? 'bg-red-500' : 'bg-green-500'}`}>
                                    <span className="px-2 text-white text-sm">
                                      {chap.status === undefined ? <></> : chap.status}
                                    </span>
                                  </span>
                                )}
                                {chap.upload === true && chap.status === undefined ?
                                   <span className="rounded-full bg-gray-100">
                                   <span className="px-2 text-black text-sm">
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
              </ul>
            </div>

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>





  )
}

export default Navbar