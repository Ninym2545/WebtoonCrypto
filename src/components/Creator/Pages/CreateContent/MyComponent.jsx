"use client"
import { Box, Button, FormControl, Input, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import Previewimage from './Previewimage'
import Previewinput from './Previewinput'
import { Textarea } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { updatecontents, uploadcontents } from '@/app/api/createcontent/route'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import useSWR from 'swr';


const MyComponent = () => {
  const bg = useColorModeValue('white', 'gray.700')
  const formRef = useRef();
  const session = useSession();
  const route = useRouter();

  // --- Checkbox --- //
  const [isChecked, setIsChecked] = useState(false);
  const [formDataContent, setFormDataContent] = useState({});

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataContent({ ...formDataContent, [name]: value });
  };

  // --- file image --- //
  const [files, setFiles] = useState([]);
  const [filesbg, setFilebg] = useState([]);
  const [fileslogo, setFilelogo] = useState([]);
  const [filesdetail, setFiledetail] = useState([]);
  const [error, setError] = useState('');
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
  // --- image photo bg --- //
  async function handleInputFilebg(e) {
    const files = e.target.files;

    const newFilesbg = [...files].filter(file => {
      if (file.size < 6000 * 6000 && file.type.startsWith('image/')) {
        return file;
      }
    })
    setFilebg(prev => [...newFilesbg, ...prev])
  }
  async function handleDeleteFilebg(index) {
    const newFilesbg = filesbg.filter((_, i) => i !== index)
    setFilebg(newFilesbg)

  }
  // --- image photo logo --- //
  async function handleInputFilelogo(e) {
    const files = e.target.files;

    const newFileslogo = [...files].filter(file => {
      if (file.size < 6000 * 6000 && file.type.startsWith('image/')) {
        return file;
      }
    })
    setFilelogo(prev => [...newFileslogo, ...prev])
  }
  async function handleDeleteFilelogo(index) {
    const newFileslogo = fileslogo.filter((_, i) => i !== index)
    setFilelogo(newFileslogo)

  }
  // --- image photo maximage --- //
  async function handleInputFiledetail(e) {
    const files = e.target.files;

    const newFilesdetail = [...files].filter(file => {
      if (file.size < 6000 * 6000 && file.type.startsWith('image/')) {
        return file;
      }
    })
    setFiledetail(prev => [...newFilesdetail, ...prev])
  }
  async function handleDeleteFiledetail(index) {
    const newFilesdetail = filesdetail.filter((_, i) => i !== index)
    setFiledetail(newFilesdetail)
  }

  // --- Create Contents --- // 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = session.data?.user._id
    const username = session.data?.user.name

    const formDatafg = new FormData();
    const formDatabg = new FormData();
    const formDatalogo = new FormData();
    const formDatadetail = new FormData();

    files.forEach(file => {
      formDatafg.append('files', file)
    })
    filesbg.forEach(file => {
      formDatabg.append('files', file)
    })
    fileslogo.forEach(file => {
      formDatalogo.append('files', file)
    })
    filesdetail.forEach(file => {
      formDatadetail.append('files', file)
    })

    try {
      if (isChecked) {
        Swal.fire({
          title: 'คุณต้องการสร้างผลงานหรือไม่',
          text: "คุณจะเปลี่ยนกลับไม่ได้!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ยกเลิก',
          confirmButtonText: 'สร้างผลงาน'
        }).then((result) => {
          if (result.isConfirmed) {
            const res = uploadcontents(formDatafg, formDatabg, formDatalogo, formDatadetail, formDataContent, user, username)
            if (res?.msg) alert('Create Content success')
            let timerInterval
            Swal.fire({
              title: "กำลังสร้างผลงาน",
              timer: 3000,
              didOpen: () => {
                  Swal.showLoading()
                },
                willClose: () => {
                  clearInterval(timerInterval)
                }
          }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                  Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'สร้างผลงานสำเร็จ',
                      showConfirmButton: false,
                      timer: 2000
                    }) 
                    setTimeout(() => {
                      route.push("/creator/mycontents"); 
                  }, 1000)
              }
          
              
            })
            if (res?.errMsg) alert(`Error: ${res?.errMsg}`)
          }
        })
        formRef.current.reset()

        revalidate("/")
        // Send the form data (formData) to the server or perform necessary actions
        // const res = uploadcontents(formDatafg, formDatabg, formDatalogo, formDatadetail, formDataContent, user)
      } else {
        setError('Please check the box before submitting.');

      }
    } catch (error) {
      console.log('contentError ---> ', error);
    }

  };
 

  const [dataselect , setdataselect] = useState();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, isLoading } = useSWR(
      `/api/contents/${session?.data?.user._id}`,
      fetcher
  );

  async function selectdata(e) {
    const value = e.target.value

    const datafilter = data.find((item) => item.title == value);
    setdataselect(datafilter)
    console.log('datafillter --> ', datafilter);

     document.querySelector("#show-author").value = datafilter.author.toString();
     document.querySelector("#show-desc").value = datafilter.desc.toString();
     document.querySelector("#show-date").innerHTML = " <option value='option1'>"+datafilter.day.toString()+"</option> " 
     document.querySelector("#show-category").innerHTML = " <option value='option1'>"+datafilter.category.toString()+"</option> "  

}

 // --- Update Contents --- // 
 const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  const user = session.data?.user._id

  const formDatafg = new FormData();
  const formDatabg = new FormData();
  const formDatalogo = new FormData();
  const formDatadetail = new FormData();

  files.forEach(file => {
    formDatafg.append('files', file)
  })
  filesbg.forEach(file => {
    formDatabg.append('files', file)
  })
  fileslogo.forEach(file => {
    formDatalogo.append('files', file)
  })
  filesdetail.forEach(file => {
    formDatadetail.append('files', file)
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
      }).then((result) => {
        if (result.isConfirmed) {
          const res = updatecontents(formDatafg, formDatabg, formDatalogo, formDatadetail, formDataContent, user , dataselect)

          if (res?.msg) alert('Update Content success')
          let timerInterval
          Swal.fire({
            title: "กำลังแก้ไข",
            timer: 4000,
            didOpen: () => {
                Swal.showLoading()
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'แก้ไขผลงานสำเร็จ',
                    showConfirmButton: false,
                    timer: 2000
                  }) 
                  setTimeout(() => {
                    route.push("/creator/mycontents"); 
                }, 1000)
            }
        
            
          })
          if (res?.errMsg) alert(`Error: ${res?.errMsg}`)
        }
      })
      formRef.current.reset()

      revalidate("/")
      // Send the form data (formData) to the server or perform necessary actions
      // const res = uploadcontents(formDatafg, formDatabg, formDatalogo, formDatadetail, formDataContent, user)
  
  } catch (error) {
    console.log('contentError ---> ', error);
  }

};


  return (
    <div>

      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>สร้างผลงาน</Tab>
          <Tab>แก้ไขผลงาน</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <form ref={formRef} onSubmit={handleFormSubmit}>
              <div className='component'>
                <Box backgroundColor={bg} gridColumn={'span 1'} mb={'3'} gridRow={'span 4'} borderRadius={'md'} px={'8'} py={'12'} className='scrollinputimage'>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพหน้าปก</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex items-center justify-center w-full'>
                          <div className='flex flex-col items-center justify-center w-full h-[500px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
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
                        ขนาดรูปภาพที่แนะนำคือ 248 x 520
                        รูปภาพไม่เกิน 500kb
                        สามารถอัพโหลดสกุล
                        JPG,JPEG และ PNG เท่านั้น
                      </Text>
                    </Box>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพพื้นหลัง</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex flex-col items-center justify-center w-full h-[500px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  '>
                          <div className='mb-3'>
                            {
                              filesbg.map((file, index) => (
                                <Previewimage key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFilebg(index)} />
                              ))
                            }
                          </div>

                          <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                            <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFilebg} />
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Text opacity={'0.7'}>
                          ขนาดรูปภาพที่แนะนำคือ 375 x 812
                          รูปภาพไม่เกิน 500kb
                          สามารถอัพโหลดสกุล
                          JPG,JPEG และ PNG เท่านั้น
                        </Text>
                      </Box>
                    </>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>โลโก้</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex items-center justify-center w-full'>
                          <div className='flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                            <div className='mb-3'>
                              {
                                fileslogo.map((file, index) => (
                                  <Previewinput key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFilelogo(index)} />
                                ))
                              }
                            </div>

                            <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                              <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFilelogo} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Text opacity={'0.7'}>
                          ขนาดรูปภาพที่แนะนำคือ 248 x 180
                          รูปภาพไม่เกิน 500kb
                          สามารถอัพโหลดสกุล
                          JPG,JPEG และ PNG เท่านั้น
                        </Text>
                      </Box>
                    </>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพปกขนาดใหญ่</Text>
                    <>
                      <div className="relative my-2">
                        <div className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                          <div className='mb-3'>
                            {
                              filesdetail.map((file, index) => (
                                <Previewinput key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFiledetail(index)} />
                              ))
                            }
                          </div>

                          <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                            <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFiledetail} />
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Text opacity={'0.7'}>
                          ขนาดรูปภาพที่แนะนำคือ 390 x 329
                          รูปภาพไม่เกิน 500kb
                          สามารถอัพโหลดสกุล
                          JPG,JPEG และ PNG เท่านั้น
                        </Text>
                      </Box>
                    </>
                  </Box>
                </Box>
                <Box backgroundColor={bg} gridColumn={'span 3'} borderRadius={'md'} gridRow={'span 4'} pt={'8'} py={'12'} px={'8'} height={{ base: '100%', lg: '84vh' }}>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>ชื่อผลงาน</Text>
                    <FormControl isRequired my={'2'}>
                      <Input name='title' placeholder='น้อยกว่า 50 ตัวอักษร' onChange={handleInputChange} />
                    </FormControl>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>ผู้แต่ง</Text>
                    <FormControl isRequired my={'2'}>
                      <Input name='author' placeholder='น้อยกว่า 50 ตัวอักษร' onChange={handleInputChange} />
                    </FormControl>
                  </Box>
                  <Box mb={'5'}>
                    <div className='flex gap-2'>
                      <label className="block ">
                        <label for="category" className="block text-lg font-medium ">หมวดหมู่</label>
                        <Select placeholder='หมวดหมู่ผลงาน' name='category' id='category' my={'2'} onChange={handleInputChange}>
                          <option value='โรแมนซ์แฟนตาซี'>โรแมนซ์แฟนตาซี</option>
                          <option value='โรแมนซ์'>โรแมนซ์</option>
                          <option value='แอ็กชัน'>แอ็กชัน</option>
                          <option value='ดราม่า'>ดราม่า</option>
                          <option value='สยองขวัญ'>สยองขวัญ</option>
                          <option value='ตลก'>ตลก</option>
                        </Select>
                      </label>
                      <label className="block ">
                        <label for="week" className="block text-lg font-medium ">วันที่อัพโหลด</label>
                        <Select placeholder='วันที่อัพโหลด' name='upload' id='upload' my={'2'} onChange={handleInputChange}>
                          <option value='จันทร์'>จันทร์</option>
                          <option value='อังคาร'>อังคาร</option>
                          <option value='พุธ'>พุธ</option>
                          <option value='พฤหัสบดี'>พฤหัสบดี</option>
                          <option value='ศุกร์'>ศุกร์</option>
                          <option value='เสาร์'>เสาร์</option>
                          <option value='อาทิตย์'>อาทิตย์</option>
                        </Select>
                      </label>
                    </div>
                  </Box>

                  <Box mb={'5'}>
                    <Text fontSize='xl'>เรื่องย่อ</Text>
                    <Textarea name='Synopsis' placeholder='น้อยกว่า 500 ตัวอักษร' height={'44'} my={'2'} onChange={handleInputChange} />
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='lg' color={'green.300'}>ข้อควรระวัง</Text>
                    <Text opacity={'0.7'}>
                      เราไม่อนุญาตให้มีเนื่อหาที่มีภาพโป๊เปลือยหรือจงใจยั่วยุทางเพศ ซึ่งรวมถึงแต่ไม่จำกัดเพียงภาพที่มีความโป๊เปลือยเต็มตัวหรือบางส่วน
                      รวมถึงภาพที่แสดงออกถึงกิจกรรมทางเพศ นอกจากนี้เรายังไม่อนุญาตให้มีเนื้อหาที่มีความรุนแรงที่สร้างความตื่นตระหนกและความขุ่นเคืองแก่ผู้อ่าน
                      ซึ่งรวมถึงฉากที่แสดงถึงความโหดร้ายและเลือดหรืออวัยวะภายในร่างกายมากเกินไป
                    </Text>
                  </Box>
                  <Box mb={{ base: '10', md: '10' }}>
                    <Stack spacing={5} direction='row'>
                      <Checkbox colorScheme='green' size={'lg'} borderRadius={'full'} checked={isChecked} onChange={handleCheckboxChange} />
                      <Text>ข้าพเจ้าเห็นด้วยกับ <span className='text-blue-500'>นโยบายการดำเนินงาน</span> และ <span className='text-blue-500'>นโยบายความเป็นส่วนตัว</span> ของ WEBTOON เรื่องข้อจำกัดสำหรับทุกคนที่อายุต่ำกว่า 14 ปี ในการเผยแพร่ผลงาน</Text>
                    </Stack>
                    <Stack ml={'10'}>
                    {error && <div className='text-sm text-red-500 opacity-80' >{error}</div>}
                    </Stack>
                  </Box>
                  {isChecked ? <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Button colorScheme="green" size={'lg'} type='submit' >สร้างผลงาน</Button>
                  </Box>:
                  
                  <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Button colorScheme="gray" cursor={'not-allowed'} size={'lg'} >สร้างผลงาน</Button>
                  </Box>
                  }
                </Box>

              </div>

            </form>
          </TabPanel>
          <TabPanel>
            <form ref={formRef} onSubmit={handleUpdateSubmit}>

              <div className='component'>
                <Box backgroundColor={bg} gridColumn={'span 1'} mb={'3'} gridRow={'span 4'} borderRadius={'md'} px={'8'} py={'12'} className='scrollinputimage'>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพหน้าปก</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex items-center justify-center w-full'>
                          <div className='flex flex-col items-center justify-center w-full h-[500px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
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
                        ขนาดรูปภาพที่แนะนำคือ 248 x 520
                        รูปภาพไม่เกิน 500kb
                        สามารถอัพโหลดสกุล
                        JPG,JPEG และ PNG เท่านั้น
                      </Text>
                    </Box>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพพื้นหลัง</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex flex-col items-center justify-center w-full h-[500px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  '>
                          <div className='mb-3'>
                            {
                              filesbg.map((file, index) => (
                                <Previewimage key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFilebg(index)} />
                              ))
                            }
                          </div>

                          <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                            <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFilebg} />
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Text opacity={'0.7'}>
                          ขนาดรูปภาพที่แนะนำคือ 375 x 812
                          รูปภาพไม่เกิน 500kb
                          สามารถอัพโหลดสกุล
                          JPG,JPEG และ PNG เท่านั้น
                        </Text>
                      </Box>
                    </>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>โลโก้</Text>
                    <>
                      <div className="relative my-3">
                        <div className='flex items-center justify-center w-full'>
                          <div className='flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                            <div className='mb-3'>
                              {
                                fileslogo.map((file, index) => (
                                  <Previewinput key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFilelogo(index)} />
                                ))
                              }
                            </div>

                            <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                              <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFilelogo} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Text opacity={'0.7'}>
                          ขนาดรูปภาพที่แนะนำคือ 248 x 180
                          รูปภาพไม่เกิน 500kb
                          สามารถอัพโหลดสกุล
                          JPG,JPEG และ PNG เท่านั้น
                        </Text>
                      </Box>
                    </>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>รูปภาพปกขนาดใหญ่</Text>
                    <>
                      <div className="relative my-2">
                        <div className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer '>
                          <div className='mb-3'>
                            {
                              filesdetail.map((file, index) => (
                                <Previewinput key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFiledetail(index)} />
                              ))
                            }
                          </div>

                          <div className='md:text-base mx-auto border-2 border-dashed text-xs rounded-xl p-1 lg:text-base m-2 lg:mx-auto lg:border-2 lg:border-dashed lg:rounded-xl lg:p-1 lg:m-2'>
                            <input type='file' className=' file:mr-4 file:py-2  file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' onChange={handleInputFiledetail} />
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Text opacity={'0.7'}>
                          ขนาดรูปภาพที่แนะนำคือ 390 x 329
                          รูปภาพไม่เกิน 500kb
                          สามารถอัพโหลดสกุล
                          JPG,JPEG และ PNG เท่านั้น
                        </Text>
                      </Box>
                    </>
                  </Box>
                </Box>
                <Box backgroundColor={bg} gridColumn={'span 3'} borderRadius={'md'} gridRow={'span 4'} pt={'8'} py={'12'} px={'8'} height={{ base: '100%', lg: '84vh' }}>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>ชื่อผลงาน</Text>
                    <Select placeholder='หมวดหมู่ผลงาน' my={'2'} onChange={selectdata}>
                    {isLoading
                        ? "loading"
                        : data?.map((content) => (
                          <option >{content.title}</option>

                        ))}
                    </Select>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='xl'>ผู้แต่ง</Text>
                    <FormControl isRequired my={'2'}>
                      <Input placeholder='น้อยกว่า 50 ตัวอักษร' id="show-author" disabled/>
                    </FormControl>
                  </Box>
                  <Box mb={'5'}>
                    <div className='flex gap-2'>
                      <label className="block ">
                        <label for="category" className="block text-lg font-medium ">หมวดหมู่</label>
                        <Select id="show-category"   my={'2'} disabled>
                          <option value='โรแมนซ์แฟนตาซี'>โรแมนซ์แฟนตาซี</option>
                          <option value='โรแมนซ์'>โรแมนซ์</option>
                          <option value='แอ็กชัน'>แอ็กชัน</option>
                          <option value='ดราม่า'>ดราม่า</option>
                          <option value='สยองขวัญ'>สยองขวัญ</option>
                          <option value='ตลก'>ตลก</option>
                        </Select>
                      </label>
                      <label className="block ">
                        <label for="week" className="block text-lg font-medium ">วันที่อัพโหลด</label>
                        <Select id="show-date"  my={'2'} disabled>
                          <option value='จันทร์'>จันทร์</option>
                          <option value='อังคาร'>อังคาร</option>
                          <option value='พุธ'>พุธ</option>
                          <option value='พฤหัสบดี'>พฤหัสบดี</option>
                          <option value='ศุกร์'>ศุกร์</option>
                          <option value='เสาร์'>เสาร์</option>
                          <option value='อาทิตย์'>อาทิตย์</option>
                        </Select>
                      </label>

                    </div>
                  </Box>

                  <Box mb={'5'}>
                    <Text fontSize='xl'>เรื่องย่อ</Text>
                    <Textarea id="show-desc" placeholder='น้อยกว่า 500 ตัวอักษร' height={'44'} my={'2'} disabled/>
                  </Box>
                  <Box mb={'5'}>
                    <Text fontSize='lg' color={'green.300'}>ข้อควรระวัง</Text>
                    <Text opacity={'0.7'}>
                      เราไม่อนุญาตให้มีเนื่อหาที่มีภาพโป๊เปลือยหรือจงใจยั่วยุทางเพศ ซึ่งรวมถึงแต่ไม่จำกัดเพียงภาพที่มีความโป๊เปลือยเต็มตัวหรือบางส่วน
                      รวมถึงภาพที่แสดงออกถึงกิจกรรมทางเพศ นอกจากนี้เรายังไม่อนุญาตให้มีเนื้อหาที่มีความรุนแรงที่สร้างความตื่นตระหนกและความขุ่นเคืองแก่ผู้อ่าน
                      ซึ่งรวมถึงฉากที่แสดงถึงความโหดร้ายและเลือดหรืออวัยวะภายในร่างกายมากเกินไป
                    </Text>
                  </Box>

                  <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Button colorScheme="yellow" size={'lg'} type='submit'>แก้ไขผลงาน</Button>
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