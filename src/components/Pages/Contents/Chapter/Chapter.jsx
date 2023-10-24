"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from './Chapter.module.css'
import { DateHelper } from "../../../DateHelper/DataFormat";
import { Box, Button, Input, useColorModeValue, useDisclosure, Text, Select } from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';



const Chapter = ({ webtoon }) => {
  const bg = useColorModeValue('gray.100', 'gray.700');
  const [chapter, setChapter] = useState();

  const route = useRouter();
  const btnRef = useRef()
  const session = useSession();

  useEffect(() => {
    fetch(`/api/chapter/${webtoon}`) // Make sure this URL is correct
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
      })
      .then((content) => {
        try {
          if (session.data?.user) {
            setChapter(content);

            // console.log('content ---> ', content);
            const user = session.data.user.buyrent;
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
          } else {
            setChapter(content);
          }
        } catch (error) {
          console.log('error', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [webtoon]);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tickerBuy, setTickerBuy] = useState()
  const [SelectedChapterId, setSelectedChapterId] = useState()
  const [tickerRent, setTickerRent] = useState()
  const rent = 'เช่า'
  const buy = 'ซื้อเก็บ'

  async function handleCheckchapter(index) {
    if(session.data?.user){
      if (index.upload === true) {
        route.push(`/viewer/${webtoon}/${index._id}`)
      } else {
        const user = session.data.user;
        setTickerBuy(user.ticker_buy)
        setTickerRent(user.ticker_rent)
        if (user.ticker_buy === 0 && user.ticker_rent === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href="">Why do I have this issue?</a>'
          }).then(() => {
            if (user.coin > 0) {
              // Redirect to /exchange and open in a new popup window with specific dimensions
              const windowFeatures = 'width=500,height=800'; // Set the desired window dimensions
              window.open('/exchange', '_blank', windowFeatures);
            }
            if (user.coin === 0) {
              // Redirect to /exchange and open in a new popup window with specific dimensions
              const windowFeatures = 'width=1200,height=800'; // Set the desired window dimensions
              window.open('/topup', '_blank', windowFeatures);
            }
          });
        } else {
          setSelectedChapterId(index._id);
          onOpen();
        }
      }
    }else{
      route.push('/login')
    }

  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const ticker = e.target[0].value;
    const chapter_id = e.target[1].value;
    const content_id = e.target[2].value;
  
    // You may want to add input validation here
  
    // Assuming you've imported session, Swal, and route correctly
    const user_id = session.data.user._id;
  
    try {
      const res = await fetch("../api/buy-rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          chapter_id,
          content_id,
          user_id,
        }),
      });
  
      if (res.ok) {
        const responseData = await res.json();
        console.log("res ---> ", responseData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `ซื้อตอนสำเร็จ`,
        });
        onClose();
        session
        console.log('session ' , session);
        // route.push(`/viewer/${responseData.content_id}/${responseData.chapter_id}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send data. Please try again.",
        });
      }
    } catch (error) {
      console.log('error ---> ', error);
    }
  };

  return (
    <div>
      <div className="mx-auto  pb-0  items-center mt-6 mb-1">
        <Box backgroundColor={bg} opacity={'0.8'} h={'48px'} >
          <h2 className="text-center pt-3 text-lg opacity-100 ">
            {
              session.data?.user ?
                <>
                  จำนวน {chapter?.length} ตอน
                </> :
                <>
                  จำนวน {chapter?.chapter.length} ตอน
                </>
            }

          </h2>
        </Box>
      </div>
      <div>
        <ul className="flex flex-wrap Episode_episodeItem ">
          {
            session.data?.user ?
              <>
                {chapter?.sort((a, b) => b.index - a.index)
                  .map((chap) => (
                    <li className="relative  mx-[2px] my-[2px] lg:!w-[calc((98.3%-3px)/6)] md:!w-[calc((98%-3px)/5)]">
                      <a
                        className="flex flex-none flex-col h-full relative  overflow-hidden"
                        // href={`/viewer/${webtoon}/${chap._id}`}
                        onClick={() => handleCheckchapter(chap)}
                      >
                        <div className="relative w-full bg-white/5 ">
                          <div className="overflow-hidden  inset-0">
                            <picture className="flex w-full h-full">
                              <div className='absolute z-30 p-3 '>
                                {chap.status && (
                                  <span className={`rounded-full ${chap.status === 'เช่า' ? 'bg-red-500' : 'bg-green-500'}`}>
                                    <span className="px-2 text-white text-md">
                                      {chap.status === undefined ? <></> : chap.status}
                                    </span>
                                  </span>
                                )}
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
              </> :
              <>
                {chapter?.chapter?.sort((a, b) => b.index - a.index)
                  .map((chap) => (
                    <li className="relative  mx-[2px] my-[2px] lg:!w-[calc((98.3%-3px)/6)] md:!w-[calc((98%-3px)/5)]">
                      <a
                        className="flex flex-none flex-col h-full relative  overflow-hidden"
                        // href={`/viewer/${webtoon}/${chap._id}`}
                        onClick={() => handleCheckchapter(chap)}
                      >
                        <div className="relative w-full bg-white/5 ">
                          <div className="overflow-hidden  inset-0">
                            <picture className="flex w-full h-full">
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
                            {chap.status === undefined ? <></> : chap.status}
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
          }

        </ul>


      </div>
      <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Box >
              <form onSubmit={handleFormSubmit}>
                <Box display={'flex'} my={'10'} px={'5'} justifyContent={'center'} alignItems={'center'} gap={'20px'}>
                  <Text fontSize={'xl'}>คุณต้องการใช้ตั๋วเพื่อเปิดอ่าน ? </Text>
                  <Select placeholder='ประเภทตั๋ว' w={'50'}>
                    {
                      tickerRent ? <option value={rent}>ตั๋วเช่า {tickerRent}</option> :
                        <></>
                    }
                    {tickerBuy ? <option value={buy}>ตั๋วซื้อเก็บ {tickerBuy}</option> :
                      <></>
                    }
                  </Select>
                </Box>
                <input type="hidden" value={SelectedChapterId} />
                <input type="hidden" value={webtoon} />
                <Box display={'flex'} my={'5'} justifyContent={'center'} gap={'20px'}>
                  <Button size={'lg'} onClick={onClose} colorScheme='teal' variant='outline' borderRadius={'full'} px={'24'}>
                    ยกเลิก
                  </Button>
                  <Button size={'lg'} colorScheme='teal' type='submit' variant='solid' borderRadius={'full'} px={'24'}>
                    ตกลง
                  </Button>
                </Box>
              </form>
            </Box>

          </DrawerBody>


        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default Chapter