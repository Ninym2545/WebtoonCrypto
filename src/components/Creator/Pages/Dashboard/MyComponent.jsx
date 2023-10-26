"use client"
import { Box, Button, Input, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ApexCharts from 'apexcharts'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { DateHelper } from '../../../DateHelper/DataFormat'
import Swal from 'sweetalert2'
const MyComponent = () => {
  const bg = useColorModeValue('white', 'gray.700')
  const session = useSession();


  const [history, setHistory] = useState(null);
  const [withdraw, setWithdraw] = useState(null);
  const [withdrawComplete, setWithdrawComplete] = useState(null);
  const [contents, setContents] = useState(null);
  const [buyrent, setBuyRent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rent, setRent] = useState([]);
  const [buy, setBuy] = useState([]);
  const [dates, setDated] = useState([]);

  const userId = session?.data?.user?._id;

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      window.location.href = "/";
    }
    if (userId) {
      fetch(`/api/history/${userId}`)
        .then((response) => response.json())
        .then((data) => setHistory(data));

      fetch(`/api/withdraw/${userId}`)
        .then((response) => response.json())
        .then((data) => setWithdraw(data));
      
      fetch(`/api/withdraw/${userId}`).then(res => res.json()).then(data => {
          const creatorStatus = data.filter((item) => item.status == 'Complete');
          setWithdrawComplete(creatorStatus)
      })

      fetch(`/api/contents/${userId}`)
        .then((response) => response.json())
        .then((data) => setContents(data));

      fetch(`/api/buy-rent/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setBuyRent(data)
          // สร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูล series1 และ series2
          var series1Data = [];
          var series2Data = [];

          // สร้าง Object เพื่อเก็บข้อมูลของเช่าและซื้อเก็บเก็บตามวันที่
          var priceByDate = {};

          // สร้างอาร์เรย์เพื่อเก็บวันที่
          var dates = [];

          // วนลูปผ่านข้อมูล JSON เพื่อนำข้อมูลมาเพิ่มใน Object ตามวันที่และประเภท
          data.forEach(function (item) {
            // แปลง createdAt เป็นวันที่และเก็บในอาร์เรย์ categories
            var createdAt = new Date(item.createdAt);
            var formattedDate = createdAt.toISOString().substring(0, 10);

            if (!dates.includes(formattedDate)) {
              dates.push(formattedDate);
            }

            if (item.type === "เช่า") {
              if (!priceByDate[formattedDate]) {
                priceByDate[formattedDate] = {
                  "เช่า": 0,
                  "ซื้อเก็บ": 0,
                };
              }
              priceByDate[formattedDate]["เช่า"] += item.price;
            } else if (item.type === "ซื้อเก็บ") {
              if (!priceByDate[formattedDate]) {
                priceByDate[formattedDate] = {
                  "เช่า": 0,
                  "ซื้อเก็บ": 0,
                };
              }
              priceByDate[formattedDate]["ซื้อเก็บ"] += item.price;
            }
          });

          // แปลง Object เป็นอาร์เรย์ของ {} โดยแต่ละ {} มีข้อมูลเช่าหรือซื้อเก็บตามวันที่
          var categories = Object.keys(priceByDate);
          categories.forEach(function (date) {
            series1Data.push(priceByDate[date]["เช่า"]);
            series2Data.push(priceByDate[date]["ซื้อเก็บ"]);
          });

          console.log(series1Data);
          console.log(series2Data);
          console.log(dates);
          // ตัวแปร dates จะเก็บวันที่
          dates.sort(); // เรียงลำดับวันที่
          setRent(series1Data)
          setBuy(series2Data)
          setDated(dates)
        });
    }
  }, [userId]);

  useEffect(() => {
    const options = {
      series: [
        {
          name: 'เช่า',
          data: rent,
        },
        {
          name: 'ซื้อเก็บ',
          data: buy,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: dates,
      },
      yaxis: {
        title: {
          text: ' (รายได้รวม)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' แคช';
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      chart.destroy();
    };
  }, [rent, buy, dates]);

  const [totalCash, setTotalCash] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    // คำนวณค่ารวมของฟิลด์ "cash" เมื่อข้อมูลมีการเปลี่ยนแปลง
    const cashTotal = withdrawComplete?.reduce((total, item) => total + item.cash, 0);
    const result = totalPrice - cashTotal
    setTotalCash(result);
  }, [withdrawComplete, totalPrice]);



  useEffect(() => {
    console.log(totalCash);
    // ดึงข้อมูลของเดือนนี้ (เดือนปัจจุบัน)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const filteredData = buyrent?.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate.getMonth() === currentMonth;
    });

    // คำนวณราคาทั้งหมดของข้อมูลที่ถูกกรอง
    const total = filteredData?.reduce((acc, item) => {
      return acc + item.price;
    }, 0);

    setTotalPrice(total);
  }, [buyrent]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const Wallet = e.target[0].value;
    const Coin = e.target[1].value;
    const user_id = session.data?.user._id
    if(Coin > 3600 && Coin <= totalCash ){
      try {
        const res = await fetch("../api/withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Wallet,
            Coin,
            user_id
          })
        })
        if (res.ok) {
          const responseData = await res.json();
          console.log("res ---> ", responseData);
  
          fetch(`/api/withdraw/${userId}`)
            .then((response) => response.json())
            .then((data) => setWithdraw(data));
  
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `ซื้อตอนสำเร็จ`,
          });
          onClose();
  
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to send data. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error with withdrawal:", error);
      }
    }else{
      onClose();
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'จำนวนแคชน้อยเกินไป หรือ คุณใส่จำนวนเงินเกินจากรายได้',
      })
    }
  
  };


  return (
    <Box p={'5'}>
      <Text fontSize='2xl' mb={'5'} fontWeight={'medium'}>Dashboard</Text>
      <div className='component'>
        <Box
          backgroundColor={bg}
          gridColumn={'span 2'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Text fontSize='xl'>ยอดการซื้อ - เช่า</Text>
          <div className='' id="chart">
          </div>
        </Box>
        <Box
          backgroundColor={bg}
          gridColumn={'span 1'}

          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Text fontSize='xl'>รายได้ของฉัน</Text>
          <Box m={'3'} py={'2'} px={'5'} shadow={'md'} borderRadius={'xl'}>
            <Box display={'flex'} justifyContent={'space-between'} >
              <Text fontSize='lg'>รายได้ของเดือนนี้ :</Text>
              <Text fontSize='lg'> {totalPrice} แคช</Text>
            </Box>
            <Box display={'flex'} my={'3'} justifyContent={'space-between'} >
              <Text fontSize='lg'>คำนวณเป็นเงินจริง :</Text>
              <Text fontSize='lg'> {totalPrice / 100} บาท</Text>
            </Box>
            <Box display={'flex'} my={'1'} justifyContent={'space-between'} >
              <Text fontSize='lg'></Text>
              <Text fontSize='sm' textColor={'red.500'} fontWeight={'semibold'}>*ยอดที่ถอนได้ควรมากกว่า 36 บาท</Text>
            </Box>
          </Box>
          <Text fontSize='xl' mt={'5'}>ยอดที่ถอนได้</Text>
          <Box m={'3'} py={'2'} px={'5'} shadow={'md'} borderRadius={'xl'}>
            <Box display={'flex'} justifyContent={'space-between'} >
              <Text fontSize='lg'>ยอดเงินคงเหลือ :</Text>
              <Text fontSize='lg'> {totalCash} แคช</Text>
            </Box>
            <Box display={'flex'} my={'3'} justifyContent={'space-between'} >
              <Text fontSize='lg'>คำนวณเป็นเงินจริง :</Text>
              <Text fontSize='lg'> {totalCash / 100} บาท</Text>
            </Box>
            <Box display={'flex'} my={'1'} justifyContent={'space-between'} >
              <Text fontSize='lg'></Text>
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'center'} px={'5'} py={'2'}>
            <Button onClick={onOpen} w={'full'} borderRadius={'full'}>ถอนเงิน</Button>
          </Box>
        </Box>
        <Box
          backgroundColor={bg}
          gridColumn={'span 1'}
          gridRow={'span 1'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Text fontSize='xl'>สถานะการถอนเงิน</Text>
          <Box my={'3'}>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>

                    <Th>วันที่</Th>
                    <Th isNumeric>สถานะ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    withdraw?.map((withdraw) => (
                      <Tr>
                        <Td>{DateHelper.convertJsDateToSqlDateFormat(new Date(withdraw.createdAt), false)}</Td>
                        <Td isNumeric>{withdraw.status}</Td>
                      </Tr>
                    ))
                  }


                </Tbody>

              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box
          backgroundColor={bg}
          gridColumn={'span 2'}
          gridRow={'span 1'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Box padding={'5'}>
            <Text fontSize='xl' mb={'5'}>ผลงานของฉัน</Text>
            <Box>
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>

                      <Th>ชื่อเรื่อง</Th>
                      <Th isNumeric>จำนวนตอน</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      contents?.map((content) => (
                        <Tr>
                          <Td>{content.title}</Td>
                          <Td isNumeric>{content.chapter.length}</Td>
                        </Tr>
                      ))
                    }

                  </Tbody>

                </Table>
              </TableContainer>
            </Box>
          </Box>

        </Box>
        <Box
          backgroundColor={bg}
          gridColumn={'span 2'}
          gridRow={'span 1'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Box padding={'5'}>
            <Text fontSize='xl' mb={'5'}>ประวัติการเติมแคช</Text>
            <Box>
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th>วันที่</Th>
                      <Th isNumeric>จำนวนแคช</Th>
                      <Th isNumeric>ราคา</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      history?.map((history) => (
                        <Tr>
                          <Td>{DateHelper.convertJsDateToSqlDateFormat(new Date(history.createdAt), false)}</Td>
                          <Td isNumeric>{history.coin.toLocaleString()}</Td>
                          <Td isNumeric>{history.price.toLocaleString()}</Td>
                        </Tr>
                      ))
                    }



                  </Tbody>

                </Table>
              </TableContainer>
            </Box>
          </Box>

        </Box>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ถอนเงิน</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleWithdrawal} >
            <ModalBody>
              <Box m={'3'} py={'2'} px={'5'} shadow={'md'} borderRadius={'xl'}>
                <Box display={'flex'} justifyContent={'space-between'} >
                  <Text fontSize='lg'>ยอดเงินคงเหลือ :</Text>
                  <Text fontSize='lg'> {totalCash} แคช</Text>
                </Box>
                <Box display={'flex'} my={'3'} justifyContent={'space-between'} >
                  <Text fontSize='lg'>คำนวณเป็นเงินจริง :</Text>
                  <Text fontSize='lg'> {totalCash / 100} บาท</Text>
                </Box>
                <Box display={'flex'} my={'1'} justifyContent={'space-between'} >
                  <Text fontSize='lg'></Text>
                </Box>
              </Box>
              <Box p={'4'}>
                <Text fontSize='lg' mb={'3'}>กรอกจำนวนเงินที่ต้องการถอน</Text>
                <Input placeholder='Metamask Wallet' />
                <Input placeholder='จำนวนแคช' my={'3'} />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost' type='submit' colorScheme='teal' >ถอนเงิน</Button>
            </ModalFooter>
          </form>

        </ModalContent>
      </Modal>
    </Box>

  )
}

export default MyComponent