"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Tabs, Button, TabList, TabPanels, Tab, TabPanel, Box, Text, FormControl, Input, Checkbox, Stack, useColorModeValue, Switch, FormLabel } from '@chakra-ui/react'
import Previewimage from './Previewimage'
import { Select } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { IoTrashBin } from 'react-icons/io5'
import Navbar from './Library/Navbar/Navbar'
import Content from './Library/Content/Contents'
import useSWR from 'swr';
import { useSession } from 'next-auth/react'
import { uploadchapter } from '../../../../app/actions/UploadAction'
import Photocardpreview from './Photocardpreview'
import PreviewDataImg from './PreviewDataImg'
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
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const MyComponent = () => {
  const session = useSession();
  const bg = useColorModeValue('white', 'gray.700')
  const route = useRouter();
  const formRef = useRef();
  const [files, setFiles] = useState([]);
  const [fileImgs, setFileImgs] = useState([]);
  const [typewt, settypewt] = useState("โรแมนซ์แฟนตาซี");
  // --- image photo fg --- //
  async function handleInputFiles(e) {
    const files = e.target.files;

    const newFiles = [...files].filter(file => {
      if (file.size < 6000 * 6000 && file.type.startsWith('image/')) {
        return file;
      }
    })
    setFiles(prev => [...newFiles, ...prev])
  }
  async function handleDeleteFile(index) {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)

  }

  async function handleInputFilesDataImg(e) {
    const fileImgs = e.target.files;

    const newFileImgs = [...fileImgs].filter(file => {
      if (file.size < 6000 * 6000 && file.type.startsWith('image/')) {
        return file;
      }
    })

    setFileImgs(prev => [...newFileImgs, ...prev])
  }

  async function handleDeleteFileDataImg(index) {
    const newFileImgs = fileImgs.filter((_, i) => i !== index)
    setFileImgs(newFileImgs)
  }


  const [dataselect, setdataselect] = useState();
  const [dataselectEdit, setdataselectEdit] = useState();
  const [dataImg, setdataImg] = useState();
  const [data, setData] = useState();
 
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      window.location.href = "/";
    }
    
    setTimeout(() => {
      fetch(`/api/contents/${session.data?.user._id}`).then(res => res.json()).then(data => {
        setData(data)
        console.log('data ---> ', data);
      })
    }, 4000);   
  }, [])

  async function selectdata(e) {
    const value = e.target.value

    const datafilter = data.find((item) => item.title == value);
    setdataselect(datafilter)


  }

  async function selectdataEdit(e) {
    const value = e.target.value

    const datafilterEdit = data.find((item) => item.title == value);
    setdataselectEdit(datafilterEdit)
  }

  async function selectdataChapter(e) {
    const value = e.target.value

    const datafilterchapter = data.find((item) => item.title == value);
    setdataselectEdit(datafilterchapter)
  }

  async function selectdataimg(e) {
    const value = e.target.value;


    if (value) {
      const response = await fetch(`/api/dataimg/${value}`);
      const data = await response.json();

      const filterimg = data?.chapter?.find((item) => item._id == value)
      setdataImg(filterimg)

    }


    // const dataimg = dataimgs.find((item) => item.title == value);
    // setdataImg(dataimg)
    // console.log('dataChapter ---> ', dataimg);
  }

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const chapternumber = e.target[2].value;
    const title = e.target[3].value;

    const formData = new FormData();
    const formDataImg = new FormData();

    files.forEach(file => {
      formData.append('files', file)
    })

    fileImgs.forEach(file => {
      formDataImg.append('files', file)
    })

    try {
      Swal.fire({
        title: 'คุณต้องแก้ไขผลงานหรือไม่',
        text: "คุณจะเปลี่ยนกลับไม่ได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'แก้ไขผลงาน'
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log('sentData');
          const res = await uploadchapter(formData, formDataImg, chapternumber, title, dataselect , isSwitchOn);

          if (res){
            
              /* Read more about handling dismissals below */
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'สร้างผลงานสำเร็จ',
                  showConfirmButton: false,
                  timer: 3000
                })
                   // เมื่อโหลดข้อมูลเสร็จแล้วทำการล้างข้อมูลอื่น ๆ และรีเซ็ตฟอร์ม
                   setFiles([]);
                   setFileImgs([]);
                   formRef.current.reset();

                   fetch(`/api/contents/${session.data?.user._id}`)
                   .then((response) => response.json())
                   .then((data) => setData(data));
          }
          // revalidatePath("/")
        }
      })



      // Send the form data (formData) to the server or perform necessary actions
      // const res = uploadcontents(formDatafg, formDatabg, formDatalogo, formDatadetail, formDataContent, user)


    } catch (error) {
      console.log('contentError ---> ', error);
    }

  };


  const [update, setUpdate] = useState();
  async function handleDeleteChapter(_id) {
    try {
      const res = await fetch("../api/createchapter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id
        })
      })
      const content = await res.json()
      console.log("content ---> ", content);
      setdataselectEdit(content)

    } catch (error) {
      console.log('error --> ', error);
    }
  }


  return (
    <div>
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>ชั้นหนังสือ</Tab>
          <Tab>อัพโหลดข้อมูล</Tab>
          <Tab>จัดการข้อมูล</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div >
              <Navbar settypewt={settypewt} typewt={typewt} />
            </div>
            <Content typewt={typewt} />
          </TabPanel>
          <TabPanel>
            <form ref={formRef} onSubmit={handleFormSubmit}>

              <div className='componentchapter'>
                <Box backgroundColor={bg} gridColumn={'span 1'} mb={'3'} borderRadius={'md'} px={'8'} py={'12'} className='scrollinputchapter'>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพหน้าปก</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex items-center justify-center w-full'>
                          <div className='flex flex-col items-center justify-center w-full h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                            <div className='mb-3'>
                              {
                                files.map((file, index) => (
                                  <Previewimage key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFile(index)} />
                                ))
                              }
                            </div>

                            <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                              <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 ' onChange={handleInputFiles} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                    <Box>
                      <Text opacity={'0.7'}>
                        ขนาดรูปภาพที่แนะนำคือ 250 x 150
                        รูปภาพไม่เกิน 500kb
                        สามารถอัพโหลดสกุล
                        JPG,JPEG และ PNG เท่านั้น
                        ชื่อไฟล์ควรเป็นภาษาอังกฤษและหมายเลขเท่านั้น
                      </Text>
                    </Box>
                  </Box>
                </Box>
                <Box backgroundColor={bg} gridColumn={'span 3'} borderRadius={'md'} gridRow={'span 4'} pt={'8'} py={'12'} px={'8'} height={{ base: '100%', sm: '100%' }}>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>ชื่อซีรี่ส์</Text>
                    <Select placeholder='ชื่อซีรี่ส์' my={'2'} onChange={selectdata} >
                      {data?.map((content) => (
                        <option key={content._id} >{content.title}</option>

                      ))}

                    </Select>
                  </Box>
                  <Box mb={'5'}>
                    <div className='flex gap-5'>
                      <label className="block ">
                        <Text fontSize='xl'>ตอนที่</Text>
                        <FormControl isRequired my={'2'}>
                          <Input type='number' name='chapternumber' width={'20'} />
                        </FormControl>
                      </label>
                      <label className="block ">
                        <Text fontSize='xl'>ชื่อตอน</Text>
                        <FormControl isRequired my={'2'}>
                          <Input placeholder='น้อยกว่า 50 ตัวอักษร' name='title' width={{ lg: 'xs', base: '21vh' }} />
                        </FormControl>
                      </label>
                      <label className="flex items-center p-5 mt-[22px]">
                      <FormControl display='flex' alignItems='center'>
                        <FormLabel htmlFor='email-alerts' fontSize={'lg'} mb='0'>
                         เปิดให้อ่านฟรี ?
                        </FormLabel>
                        <Switch  isChecked={isSwitchOn} onChange={handleSwitchChange} size={'lg'} />
                        <FormLabel  fontSize={'lg'} ml={'5'} mb='0'>
                        <Text>Switch is {isSwitchOn ? "On" : "Off"}</Text>
                        </FormLabel>
                      </FormControl>
                      </label>
                      
                      
                    

                    </div>
                  </Box>
                  <Box mb={'5'}>
                    <div className='lg:flex gap-5'>
                      <label className="block ">
                        <Text fontSize='xl'>อัพโหลดไฟล์</Text>


                        <input
                          onChange={handleInputFilesDataImg}
                          multiple
                          type="file"
                          accept='image/*'
                          className=" outline-none  flex-1 text-gray-900 border border-transparent rounded-lg  sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />



                      </label>
                      <label className="block ">
                        <Text fontSize='xl'>พรีวิว</Text>
                        <Tabs variant='soft-rounded' colorScheme='green' my={'2'}>
                          <TabList>
                            <Tab>ก่อนอัพโหลด</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>
                              <div className='flex flex-col items-center justify-center h-[500px] lg:w-[920px] lg:h-[400px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                                <div className='showdata'>
                                  <div className='flex flex-col items-center justify-center   object-scale-down p-6 border-t border-solid border-slate-200'>

                                    {
                                      fileImgs.map((file, index) => (
                                        <div key={index} className='flex items-center justify-center '>
                                          <div className='w-full'>
                                            <Photocardpreview key={index} url={URL.createObjectURL(file)} onClicks={() => handleDeleteFileDataImg(index)} />
                                          </div>
                                        </div>

                                      ))
                                    }
                                  </div>
                                </div>
                              </div>
                            </TabPanel>

                          </TabPanels>
                        </Tabs>
                      </label>
                    </div>
                    
                  </Box>

                  <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Button colorScheme="green" size={'lg'} type='submit' >สร้างผลงาน</Button>
                  </Box>
                </Box>
              </div>

            </form>
          </TabPanel>
          <TabPanel>
            <form >

              <div className='componentchapter'>
                <Box backgroundColor={bg} gridColumn={'span 2'} mb={'3'} borderRadius={'md'} px={'8'} py={'12'} className='scrollinputchapter'>
                  <Box mb={'5'}>
                    <Box mb={'5'}>
                      <Text fontSize='xl'>ชื่อซีรี่ส์</Text>
                      <Select placeholder='ชื่อซีรี่ส์' my={'2'} onChange={selectdataEdit} >
                        {data?.map((content) => (
                          <option key={content._id}>{content.title}</option>
                        ))}
                      </Select>
                    </Box>
                  </Box>
                  <Box>
                    <Text mb={'5'} fontSize='xl'>ข้อมูลการ์ตูน</Text>
                    <TableContainer>
                      <Table variant='simple'>
                        <Thead>
                          <Tr>
                            <Th>ชื่อตอน</Th>
                            <Th>ตอนที่</Th>
                            <Th isNumeric>จัดการข้อมูล</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {dataselectEdit?.chapter?.map((content) => (
                            <Tr key={content._id}>
                              <Td>{content.title}</Td>
                              <Td >{content.index}</Td>
                              <Td isNumeric><IoTrashBin onClick={() => handleDeleteChapter(content._id)} className='ml-auto mr-3 w-6 h-8 text-red-600' /></Td>
                            </Tr>
                          ))}
                        </Tbody>

                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
                <Box backgroundColor={bg} gridColumn={'span 2'} mb={'3'} borderRadius={'md'} px={'8'} py={'12'} className='scrollinputchapter'>
                  <Box mb={'5'}>

                    <Box mb={'5'}>
                      <Text fontSize='xl'>ชื่อตอน</Text>
                      {dataselectEdit ? <Select placeholder='ชื่อตอน' my={'2'} onChange={selectdataimg} >
                        {

                          dataselectEdit?.chapter.map((content) => (
                            <option key={content._id} value={content._id}>{content.title}</option>
                          ))}
                      </Select> : <Select placeholder='ชื่อตอน' my={'2'} disabled>

                      </Select>}

                    </Box>
                    <Box p={'2'}>
                      <Text fontSize='xl' mb={'3'}>ข้อมูลการ์ตูน</Text>
                      <div className='flex flex-col items-center justify-center h-[600px] lg:w-[825px] lg:h-[500px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                        {
                          dataImg ? <div className='showdata'>
                            <div className='flex flex-col items-center justify-center   object-scale-down p-6 border-t border-solid border-slate-200'>

                              {dataImg?.data_img.map((dataimg) => (
                                <img key={dataimg._id} src={dataimg.url} />
                              ))
                              }
                            </div>
                          </div> : <></>

                        }

                      </div>
                    </Box>
                  </Box>
                </Box>

              </div>

            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default MyComponent