"use client"
import React, { use, useEffect, useRef, useState } from 'react'
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
  const [originaChapters, setOriginaChapters] = useState([])
  const [orders, setOrders] = useState([]);
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
        // console.log("ดิบ", content?.chapter);
        setTickerBuy(session?.data?.user.ticker_buy)
        setTickerRent(session?.data?.user.ticker_rent)
        if (content?.chapter) {
          setOriginaChapters(content?.chapter)
          // console.log('MyChapter', session?.data?.user.buyrent);
          const myorders = session?.data?.user.buyrent;
          setOrders(myorders)
        }
    
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [webtoon]);


  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tickerBuy, setTickerBuy] = useState()
  const [tickerRent, setTickerRent] = useState()
  const [SelectChapter , setSelectChapter] = useState()
  const rent = 'เช่า'
  const buy = 'ซื้อเก็บ'

  async function handleCheckchapter(chap) {
    const result =isCanOpen(orders,chap)
    if (session?.status === "unauthenticated") {
      window.location.href = "/";
    }
    if(result){
      route.push(`/viewer/${webtoon}/${chap._id}`)
    }else{
      const user = session?.data?.user;
      if (user?.ticker_buy === 0 && user.ticker_rent === 0) {
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
              setSelectChapter(chap._id);
              console.log(SelectChapter);
              onOpen();
            }
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
        location.reload();
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
  const isCanOpen = (orders, chap) => {
    console.log('chap' ,chap);
    if(chap.upload === true){
      return true
    }else{
      const today = new Date()
      const chek = orders?.some(order =>
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
    <div>
      <div className="mx-auto  pb-0  items-center mt-6 mb-1">
        <Box backgroundColor={bg} opacity={'0.8'} h={'48px'} >
          <h2 className="text-center pt-3 text-lg opacity-100 ">
            {
              session.data?.user.buyrent.length > 0 ?
                <>
                  จำนวน {originaChapters?.length} ตอน
                </> :
                <>
                  จำนวน {originaChapters?.length} ตอน
                </>
            }

          </h2>
        </Box>
      </div>
      <div>
    
        <ul className="flex flex-wrap Episode_episodeItem ">
          <>
            {originaChapters?.sort((a, b) => b.index - a.index).map((chap) => (
              <li className="relative  mx-[2px] my-[2px] lg:!w-[calc((98.3%-3px)/6)] md:!w-[calc((98%-3px)/5)]">
                <a
                  className="flex flex-none flex-col h-full relative  overflow-hidden"
                  onClick={() => handleCheckchapter(chap)}
                >
                  <div className="relative w-full bg-white/5 ">
                    <div className="overflow-hidden  inset-0">
                      <picture className="flex w-full h-full">
                        <div className='absolute z-30 p-3 '>
                          {
                            displayStatus(orders, chap)
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
                <input type="hidden" value={SelectChapter} />
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