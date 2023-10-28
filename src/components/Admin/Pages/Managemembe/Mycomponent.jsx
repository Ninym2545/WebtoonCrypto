"use client"
import { Box, Button, CircularProgress, CircularProgressLabel, Text, useColorModeValue } from '@chakra-ui/react'
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
import { DateHelper } from '../../../DateHelper/DataFormat'
import Swal from 'sweetalert2'
import { revalidate } from '@/app/api/evidence/route'



const MyComponent = ({ projects }) => {
    const bg = useColorModeValue('white', 'gray.700')
    const session = useSession();
    // ผู้ขอเป็น Creator
    const [evidence, setEvidence] = useState([]);
    // สถานะของผู้ใช้ในระบบ
    const [creator, setCreator] = useState([]);
    const [prending, setPrending] = useState([]);
    const [user, setUser] = useState([]);

    const [filterUser, setFilterUser] = useState([]);

    useEffect(() => {
        fetch(`/api/evidence`, { cache: 'no-store' })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed to fetch data');
          }
        })
        .then((data) => {
          const creatorStatus = data.filter((item) => item.status === 'prending');
          console.log('cretor',creatorStatus );
          setEvidence(creatorStatus)
          // ทำอะไรกับข้อมูลต่อไปที่คุณต้องการ
        })
        .catch((error) => {
          console.error(error);
          // จัดการข้อผิดพลาดที่เกิดขึ้นในกรณีที่การเรียก API ล้มเหลว
        });
        fetch(`/api/user`, { cache: 'no-store' }).then(res => res.json()).then(data => {
            // Status Creator
            const creatorfilter = data.filter((item) => item.role == 'creator');
            setCreator(creatorfilter)
            console.log('creator -->', creatorfilter);
            // Status Prending
            const prendingfilter = data.filter((item) => item.role == 'prending');
            setPrending(prendingfilter)
            console.log('prending -->', prendingfilter);
            // Status User
            const userfilter = data.filter((item) => item.role == 'user');
            setUser(userfilter)
            console.log('user -->', userfilter);

            const filter = data.filter((item) => item.role != 'admin');
            setFilterUser(filter)
            console.log('filter -->', filter);
        })
        if (session?.status === "unauthenticated") {
            window.location.href = "/";
        }
    }, [])


    async function handleDeleteChapter(_id) {
        try {
            const res = await fetch("../api/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id
                })
            });
            if (res) {
                const content = await res.json();
                // console.log('res ' , content);
                const NewData = content.data
                // location.reload()
                console.log('res ', NewData);
                const evidenceFilter = evidence.filter(item => item._id !== content.evidence._id)
                console.log('resfilter', evidenceFilter);
                setEvidence(evidenceFilter);

                const creatorfilter = NewData.filter((item) => item.role == 'creator');
                console.log('creatorStatus ---> ', creatorfilter);
                setCreator(creatorfilter)
                const prendingfilter = NewData.filter((item) => item.role == 'prending');
                console.log('prendingStatus ---> ', prendingfilter);
                setPrending(prendingfilter)
                const userfilter = NewData.filter((item) => item.role == 'user');
                console.log('userStatus ---> ', userfilter);
                setUser(userfilter)
                const filter = NewData.filter((item) => item.role !== 'admin');
                console.log('allUser ---> ', filter);
                setFilterUser(filter);

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'อนุมัติสำเร็จ',
                    showConfirmButton: false,
                    timer: 3000
                })
            }


        } catch (error) {
            console.log('error -->', error);
        }
    }

    return (
        <Box p={'5'}>
            <Text fontSize='2xl' mb={'5'} fontWeight={'medium'}>จัดการข้อมูลสมาชิก</Text>
            <div className='component'>
                <Box
                    backgroundColor={bg}
                    gridColumn={'span 2'}
                    gridRow={'span 1'}
                    padding={'5'}
                    borderRadius={'xl'}
                    boxShadow={'md'}
                >
                    <Text fontSize='xl'>ผู้สมัครเป็นครีเอเตอร์</Text>
                    <TableContainer p={'5'}>
                        <Table variant='simple'>

                            <Thead>
                                <Tr>
                                    <Th>ชื่อ</Th>
                                    <Th>เบอร์โทรศัพท์</Th>
                                    <Th>วันที่สมัคร</Th>
                                    <Th>รูปภาพหลักฐาน</Th>
                                    <Th isNumeric>multiply by</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {evidence?.map((approve) => (
                                    <Tr key={approve._id}>
                                        <Td>{approve.user_name}</Td>
                                        <Td>{approve.tel}</Td>
                                        <Td>{DateHelper.convertJsDateToSqlDateFormat(new Date(approve.createdAt), false)}</Td>
                                        <Td>
                                            <img src={approve.Evidence} width={'80px'} className='ml-[10px] rounded-md' />
                                        </Td>
                                        <Td isNumeric>
                                            <Button colorScheme='teal' variant='outline' onClick={() => handleDeleteChapter(approve.user_id)}>Approve</Button>
                                        </Td>
                                    </Tr>
                                ))
                                }

                            </Tbody>

                        </Table>
                    </TableContainer>
                </Box>
                <Box
                    backgroundColor={bg}
                    gridColumn={'span 2'}
                    gridRow={'span 1'}
                    padding={'5'}
                    borderRadius={'xl'}
                    boxShadow={'md'}
                >
                    <Text fontSize='xl'>จำนวนผู้ใช้ทั้งหมด</Text>
                    <div className='flex gap-10 p-5 justify-center'>
                        <Box >
                            <CircularProgress value={creator?.length} color='yellow.500' size={'200px'}>
                                <CircularProgressLabel>{creator?.length}</CircularProgressLabel>
                            </CircularProgress>
                            <div className='mx-auto my-2 flex justify-center'>
                                <h2 className='mx-auto text-lg'>ครีเอเตอร์</h2>
                            </div>
                        </Box>
                        <Box>
                            <CircularProgress value={prending?.length} color='red.400' size={'200px'}>
                                <CircularProgressLabel>{prending?.length}</CircularProgressLabel>
                            </CircularProgress>
                            <div className='mx-auto my-2 flex justify-center'>
                                <h2 className='mx-auto text-lg'>กำลังดำเนินการ</h2>
                            </div>
                        </Box>
                        <Box>
                            <CircularProgress value={user?.length} color='green.400' size={'200px'}>
                                <CircularProgressLabel>{user?.length}</CircularProgressLabel>
                            </CircularProgress>
                            <div className='mx-auto my-2 flex justify-center'>
                                <h2 className='mx-auto text-lg'>ผู้ใช้งานทั่วไป</h2>
                            </div>
                        </Box>
                    </div>
                </Box>
            </div>
            <Text fontSize='2xl' my={'5'} fontWeight={'medium'}>สมาชิกทั้งหมด</Text>
            <Box
                backgroundColor={bg}
                gridColumn={'span 3'}
                gridRow={'span 1'}
                padding={'5'}
                borderRadius={'xl'}
                boxShadow={'md'}
            >
                <Text fontSize='xl'>ผู้ใช้ทั้งหมด</Text>
                <TableContainer p={'5'}>
                    <Table variant='simple'>

                        <Thead>
                            <Tr>
                                <Th>ชื่อ</Th>
                                <Th>อีเมลล์</Th>
                                <Th>วันที่สมัคร</Th>
                                <Th >ตำแหน่ง</Th>
                                <Th isNumeric>ล็อคอินผ่าน</Th>

                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                filterUser?.map((user) => (
                                    <Tr key={user._id}>
                                        <Td>{user.name}</Td>
                                        <Td>{user.email}</Td>
                                        <Td> {DateHelper.convertJsDateToSqlDateFormat(new Date(user.createdAt), false)}</Td>
                                        <Td >{user.role}</Td>
                                        <Td isNumeric>{user.provider}</Td>


                                    </Tr>
                                ))
                            }

                        </Tbody>

                    </Table>
                </TableContainer>
            </Box>
        </Box>

    )
}

export default MyComponent