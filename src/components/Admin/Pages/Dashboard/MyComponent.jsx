"use client"
import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react'
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
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { DateHelper } from '../../../DateHelper/DataFormat'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

const MyComponent = () => {
  const bg = useColorModeValue('white', 'gray.700')
  const session = useSession();
  const route = useRouter();
  const [history, setHistory] = useState(null);
  const [withdraw, setWithdraw] = useState(null);
  const [contents, setContents] = useState(null);
  const [buyrent, setBuyRent] = useState(null);

  const [rent, setRent] = useState([]);
  const [buy, setBuy] = useState([]);
  const [dates, setDated] = useState([]);

  useEffect(() => {

    if (session?.status === "unauthenticated") {
      window.location.href = "/";
    }
    fetch(`/api/history`)
      .then((response) => response.json())
      .then((data) => setHistory(data));

    fetch(`/api/withdraw`).then(res => res.json()).then(data => {
      const creatorStatus = data.filter((item) => item.status == 'Prending');
      setWithdraw(creatorStatus)
    })

    fetch(`/api/contents`)
      .then((response) => response.json())
      .then((data) => setContents(data));

    fetch(`/api/buy-rent`)
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

        // ตัวแปร dates จะเก็บวันที่
        dates.sort(); // เรียงลำดับวันที่
        setRent(series1Data)
        setBuy(series2Data)
        setDated(dates)
      });

  }, []);

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

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // const { data: history } = useSWR(`/api/history` , fetcher , { suspense: true })
  // const { data: contents } = useSWR(`/api/contents`, fetcher , { suspense: true })
  async function handleDeleteChapter(_id) {

    try {

      const res = await fetch("../api/approveTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id
        })
      })
      if (res.ok) {
        const content = await res.json();
        console.log('contents ---> ', content);


        fetch(`/api/withdraw`).then(res => res.json()).then(data => {
          const creatorStatus = data.filter((item) => item.status == 'Prending');
          setWithdraw(creatorStatus)
        })
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `โอนเงินเสร็จสิ้น`,
        });
      }


    } catch (error) {
      console.log('error -->', error);
    }
  }

  return (
    <Box p={'5'}>
      <Box display={'flex'} justifyContent={'space-between'} px={'5'}>
        <Text fontSize='2xl' mb={'5'} fontWeight={'medium'}>Dashboard</Text>
      
      </Box>
      <div className='component'>
        <Box
          backgroundColor={bg}
          gridColumn={'span 2'}
          gridRow={'span 1'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Text fontSize='xl'>ยอดการซื้อตั๋ว</Text>
          <div className='' id="chart">
          </div>
        </Box>
        <Box
          backgroundColor={bg}
          gridColumn={'span 2'}
          gridRow={'span 1'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Text fontSize='xl'>คำร้องถอนเงิน</Text>
          <Box my={'4'}>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>

                    <Th>วันที่</Th>
                    <Th >รหัสผู้ใช้</Th>
                    <Th >สถานะ</Th>
                    <Th isNumeric>จัดการข้อมูล</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    withdraw?.map((history) => (
                      <Tr>
                        <Td>{DateHelper.convertJsDateToSqlDateFormat(new Date(history.createdAt), false)}</Td>
                        <Td >{history.user_id}</Td>
                        <Td >{history.status}</Td>
                        <Td isNumeric>
                          <Button colorScheme='teal' variant='outline' onClick={() => handleDeleteChapter(history._id)}>Approve</Button>
                        </Td>

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
          gridRow={'span 2'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
          height={'60vh'}
        >
          <Box padding={'5'}>
            <Text fontSize='xl' mb={'5'}>ผลงานทั้งหมด</Text>
            <Box>
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>

                      <Th>ชื่อเรื่อง</Th>
                      <Th isNumeric>จำนวนตอน</Th>
                      <Th isNumeric>ผู้สร้าง</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      contents?.map((content) => (
                        <Tr>
                          <Td>{content.title}</Td>
                          <Td isNumeric>{content.chapter.length}</Td>
                          <Td isNumeric>{content.creater_name}</Td>
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
          gridRow={'span 2'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
          height={'60vh'}
        >
          <Box padding={'5'}>
            <Text fontSize='xl' mb={'5'}>ประวัติการเติมแคช</Text>
            <Box>
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th>วันที่</Th>
                      <Th >จำนวนแคช</Th>
                      <Th >ราคา</Th>
                      <Th >ช่องทาง</Th>
                      <Th isNumeric>ผู้ใช้</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      history?.map((history) => (
                        <Tr>
                          <Td>{DateHelper.convertJsDateToSqlDateFormat(new Date(history.createdAt), false)}</Td>
                          <Td >{history.coin.toLocaleString()}</Td>
                          <Td >{history.price.toLocaleString()}</Td>
                          <Td >{history.txHash ? 'Metamask' : 'บัตรเครดิต'}</Td>
                          <Td isNumeric>{history.user_name}</Td>
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

    </Box>

  )
}

export default MyComponent