"use client"
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
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

const MyComponent = () => {
  const bg = useColorModeValue('white', 'gray.700')
  const session = useSession();

  useEffect(() => {
    var options = {
      series: [{
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100]
    }, {
      name: 'series2',
      data: [11, 32, 45, 32, 34, 52, 41]
    }],
      chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  },[])
  
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: history } = useSWR(session?.data?.user._id ? `/api/history/${session?.data?.user._id}` : null, fetcher , { suspense: true })
  const { data: contents } = useSWR(session?.data?.user._id ? `/api/contents/${session?.data?.user._id}` : null, fetcher , { suspense: true })



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
          <Text fontSize='xl'>ยอดการซื้อตั๋ว</Text>
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
          <Text fontSize='xl'>แคชของฉัน</Text>

        </Box>
        <Box
          backgroundColor={bg}
          gridColumn={'span 1'}
          gridRow={'span 1'}
          padding={'5'}
          borderRadius={'xl'}
          boxShadow={'md'}
        >
          <Text fontSize='xl'>ตั๋วของฉัน</Text>

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

    </Box>

  )
}

export default MyComponent