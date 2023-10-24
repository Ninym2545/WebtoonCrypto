"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Flex, FormControl, FormLabel, Tab, TabList, TabPanel, TabPanels, Tabs, Textarea, useColorModeValue } from '@chakra-ui/react';
import { AiOutlineCreditCard } from 'react-icons/ai'
import { CheckIcon, PhoneIcon } from '@chakra-ui/icons';
import { Input, Stack, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import Script from 'next/script'
import Swal from 'sweetalert2'
import Metamask from "../../../assets/MetaMask_Fox.svg.png";
import Image from 'next/image';
import { createEvidence } from '@/app/api/evidence/route';




const Mycomponent = () => {
  const session = useSession();
  const { status } = useSession();
  const router = useRouter();
  const bg = useColorModeValue('white', 'gray.700')
  const [files, setFiles] = useState([]);
  const [formDataContent, setFormDataContent] = useState({});

  if (status === "unauthenticated") {
    router?.push("/");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataContent({ ...formDataContent, [name]: value });
  };
    // --- image photo  --- //
    async function handleInputFiles(e) {
      const files = e.target.files;
      console.log('file --> ', files);
      const newFiles = [...files].filter(file => {
        if (file.size < 6000 * 6000 && file.type.startsWith('image/')) {
          return file;
        }
      })
      setFiles(prev => [...newFiles, ...prev])
    }

      // --- Create Contents --- // 
  const handleFormSubmit = async (e) => {

    e.preventDefault();
    const user = session.data?.user._id
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file)
    })

    try {
    const res = createEvidence(user , formDataContent, formData)
    if(res?.msg) alert('Create Evidence Success')
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 3000
    })
    setTimeout(() => {
      router.push("/"); 
  }, 3000)
               
    } catch (error) {
      console.log('contentError ---> ', error);
    }

  };

  return (
    <div className='mt-28'>
      <div className=''>
        <h1 className="text-3xl font-bold">สมัครเป็นครีเอเตอร์</h1>
      </div>
      <div className={styles.component}>
        <form onSubmit={handleFormSubmit}>
        <Box p={'30px'} rounded={'10px'} shadow={'md'} display={'grid'} gap={'10'} gridTemplateColumns={'repeat(4, 1fr)'} backgroundColor={bg} borderWidth={'1px'}>

          <Box gridColumn={'span 2'}>
            <Box mb={'5'}>
              <FormControl isRequired>
                <FormLabel>ชื่อ</FormLabel>
                <Input name='name' placeholder='First name'  onChange={handleInputChange} />
              </FormControl>
            </Box>
            <Box mb={'5'}>
              <FormControl isRequired>
                <FormLabel>เบอร์โทรศัพท์</FormLabel>
                <Input name='phone' placeholder='Phone'  onChange={handleInputChange} />
              </FormControl>
            </Box>
            <Box mb={'5'}>
              <FormLabel>ที่อยู่</FormLabel>
              <Textarea name='address' placeholder='Address'  onChange={handleInputChange} />
            </Box>
          </Box>
          <Box gridColumn={'span 2'}>
            <Box mb={'5'}>
              <FormControl >
                <FormLabel>อัพโหลดรูปภาพ</FormLabel>
                <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                  <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFiles} />
                </div>
              </FormControl>
            </Box>
            <Box mb={'5'}>
            <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Button colorScheme="green" size={'lg'} type='submit' >สมัครครีเอเตอร์</Button>
                  </Box>
            </Box>
          </Box>

        </Box>
        </form>

      </div>
    </div>
  )
}

export default Mycomponent