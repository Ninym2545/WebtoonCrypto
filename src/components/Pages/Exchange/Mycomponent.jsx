"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Flex, FormControl, FormLabel, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import { AiOutlineCreditCard } from 'react-icons/ai'
import { CheckIcon, PhoneIcon } from '@chakra-ui/icons';
import { Input, Stack, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import Swal from 'sweetalert2'
// import * as Omise from 'omise';

async function getData() {
    const res = await fetch("http://localhost:3000/api/rate", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}


const rent = [
    { rate: 200, ticker: 1, type: 'rent' },
    { rate: 1000, ticker: 5, type: 'rent' },
    { rate: 1800, ticker: 10, type: 'rent' },
    { rate: 3600, ticker: 20, type: 'rent' },
]
const buy = [
    { rate: 400, ticker: 1, type: 'buy' },
    { rate: 2000, ticker: 5, type: 'buy' },
    { rate: 3600, ticker: 10, type: 'buy' },
    { rate: 7200, ticker: 20, type: 'buy' },
]


const Mycomponent = () => {
    const session = useSession();
    const { status } = useSession();
    const router = useRouter();
    const bg = useColorModeValue('white', 'gray.700')
    const payment = useColorModeValue('white', 'gray.500')
    const form = useColorModeValue('gray.100', 'gray.600')


    if (status === "unauthenticated") {
        router?.push("/");
    }

    async function handleRentTicket(index) {
        try {
            const user = session.data.user;

            if (user.coin === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'แคชของคุณไม่เพียงพอ',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        const windowFeatures = 'width=1200,height=800'; // Set the desired window dimensions
                        window.open('/topup', '_blank', windowFeatures);
                    }
                  });
            } else {
                const confirmResult = await Swal.fire({
                    title: 'Confirm Ticket Exchange',
                    text: "You won't be able to go back!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm Exchange'
                });

                if (confirmResult.isConfirmed) {
                    const res = await fetch("../api/exchange", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            index,
                            user_id: user._id,
                            user_name: user.name,
                        }),
                    });
                    if (res.ok) {
                        Swal.fire({
                            title: "Processing, please wait...",
                            timer: 5000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        }).then(async (result) => {
                            const content = await res.json();
                            Swal.fire(
                                'Exchange Successful!',
                                `You bought ${content.ticket} tickets successfully. Please wait a moment.`,
                                'success'
                            );
                            // You can add more logic here if needed
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Exchange Failed',
                            text: 'An error occurred during the exchange.',
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    async function handleBuyTicket(index) {
        try {
            const user = session.data.user;

            if (user.coin < 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'แคชของคุณไม่เพียงพอ',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        const windowFeatures = 'width=500,height=800'; // Set the desired window dimensions
                        window.open('/topup', '_blank', windowFeatures);
                    }
                  });
            } else {
                const confirmResult = await Swal.fire({
                    title: 'Confirm Ticket Exchange',
                    text: "You won't be able to go back!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm Exchange'
                });

                if (confirmResult.isConfirmed) {
                    const res = await fetch("../api/exchange", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            index,
                            user_id: user._id,
                            user_name: user.name,
                        }),
                    });
                    if (res.ok) {
                        Swal.fire({
                            title: "Processing, please wait...",
                            timer: 5000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        }).then(async (result) => {
                            const content = await res.json();
                            Swal.fire(
                                'Exchange Successful!',
                                `You bought ${content.ticket} tickets successfully. Please wait a moment.`,
                                'success'
                            );
                            // You can add more logic here if needed
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Exchange Failed',
                            text: 'An error occurred during the exchange.',
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className='mt-36'>
            <div className='flex'>
                <h1 className="text-3xl font-bold">แลกตั๋ว</h1>
            </div>
            <div className={styles.component}>
                <div className={styles.scroll}>
                    <Box px={{ base: '5', sm: '7' }} mr={'4'} gridColumn={'span 4'} backgroundColor={bg} py={'5'} >
                        <Box display={'flex'} justifyContent={'space-between'} my={'2'}>
                            <Text>ตั๋วเช่าที่มี</Text>
                            <Text>{session.data?.user.ticker_rent} <span className='ml-2'>ตั๋ว</span></Text>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} my={'2'}>
                            <Text>ตั๋วซื้อเก็บที่มี</Text>
                            <Text>{session.data?.user.ticker_buy} <span className='ml-2'>ตั๋ว</span></Text>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} my={'2'}>
                            <Text>แคชที่มี</Text>
                            <Text>{session.data?.user.coin.toLocaleString()} <span className='ml-2'>แคช</span></Text>
                        </Box>
                        <Text fontSize={'3xl'} mt={'10'} mb={'5'}>แลก<span className='text-purple-600'>ตั๋วเช่า</span></Text>
                        {rent?.map((ticket) => (
                            <div key={ticket.ticker}>
                                <Box display={'flex'} justifyContent={'space-between'} my={'5'} alignItems={'center'}>
                                    <Text fontSize={'xl'}>{ticket.ticker} ตั๋ว</Text>
                                    <Button colorScheme='purple' borderRadius={'full'} px={'8'} size={'lg'} w={'40'} onClick={() => handleRentTicket(ticket)}>{ticket.rate.toLocaleString()} แคช</Button>
                                </Box>
                            </div>
                        ))}

                        <Text fontSize={'3xl'} mt={'10'} mb={'5'}>แลก<span className='text-blue-600'>ตั๋วซื้อเก็บ</span></Text>
                        {buy?.map((ticket) => (
                            <div key={ticket.ticker}>
                                <Box display={'flex'} justifyContent={'space-between'} my={'5'} alignItems={'center'}>
                                    <Text fontSize={'xl'}>{ticket.ticker} ตั๋ว</Text>
                                    <Button colorScheme='blue' borderRadius={'full'} px={'8'} size={'lg'} w={'40'} onClick={() => handleBuyTicket(ticket)}>{ticket.rate.toLocaleString()} แคช</Button>
                                </Box>
                            </div>
                        ))}


                    </Box>
                </div>

            </div>
        </div>
    )
}

export default Mycomponent