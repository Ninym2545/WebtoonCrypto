'use client'

import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    useColorMode,
    Link,
    Container,
} from '@chakra-ui/react'
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons'
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useSession, signOut, signIn } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function Navbar() {
    
    const session = useSession();
    // --- Dark Mode Light Mode --- //
    const { isOpen, onToggle } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <div className='fixed w-full z-[100]'>
            <Box zIndex={'100'}>
                <Container
                    display={'flex'}
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('gray.600', 'white')}
                    justify={{ base: 'center', md: 'space-between' }}
                    maxW={'7xl'}
                    minH={'60px'}
                    py={{ base: 2 }}
                    
                >
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                        <Text
                            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                            fontFamily={'heading'}
                            my={'auto'}
                            color={useColorModeValue('gray.800', 'white')}>
                            WEBTOON
                        </Text>

                        <Flex display={{ base: 'none', md: 'flex' }} ml={10} my={'auto'}  >
                            <DesktopNav />
                        </Flex>

                    </Flex>
                    <Flex alignItems={'center'} ml={'6'}>
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                    </Flex>
                    {session.status === "authenticated" && (
                        <Flex alignItems={'center'} >
                            <Flex mx={2}>
                                {session.data.user.role === "user" && (
                                    <Stack
                                        flex={{ base: 1, md: 0 }}
                                        justify={'flex-end'}
                                        direction={'row'}
                                        spacing={6}>

                                        <Button as={'a'} display={{ base: 'none', md: 'inline-flex' }} fontSize={'md'} fontWeight={400} href='/CreatorApplication'>
                                            สมัครเป็นครีเอเตอร์
                                        </Button>

                                    </Stack>
                                )}
                            </Flex>

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        name={session.data.user.name}
                                        src={session.data.user.image}

                                    />
                                </MenuButton>

                                <MenuList>
                                    <Flex p={'2'}>
                                        <Text mr={'5'}>{session.data.user.firstname}{session.data.user.lastname}</Text>
                                        <Text color={'gray.500'}>{session.data.user.coin.toLocaleString()}<span className='ml-2'>แคช</span></Text>
                                    </Flex>
                                    <MenuDivider />
                                    <Link href={'topup'}>
                                        <MenuItem > เติมแคช </MenuItem>
                                    </Link>
                                    {
                                        session.data.user.role === "creator" && (
                                            <Link href={'creator'}>
                                                <MenuItem >สร้างผลงาน</MenuItem>
                                            </Link >
                                        )
                                    }
                                    {
                                        session.data.user.role === "admin" && (
                                            <Link href={'admin'}>
                                                <MenuItem >จัดการสมาชิก</MenuItem>
                                            </Link >
                                        )
                                    }
                                    <MenuDivider />
                                    <Link href={'#'}>
                                        <MenuItem  onClick={signOut} color={'red.400'}>ออกจากระบบ</MenuItem>
                                    </Link>
                                </MenuList>
                            </Menu>


                        </Flex>


                    )}

                    {session.status === "unauthenticated" && (
                        <Stack
                        alignItems={'center'}
                            flex={{ base: 1, md: 0 }}
                            justify={'flex-end'}
                            direction={'row'}
                            ml={'2'}
                            spacing={6}>

                            <Button as={'a'}  fontSize={'md'} fontWeight={400} href='login'>
                                เข้าสู่ระบบ
                            </Button>

                        </Stack>

                    )}

                </Container>

                <Collapse in={isOpen} animateOpacity>
                    <MobileNav />
                </Collapse>
            </Box>
        </div>
    )
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')

    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Box
                                as="a"
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={'md'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Box>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    )
}

const DesktopSubNav = ({ label, href, subLabel }) => {
    return (
        <Box
            as="a"
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Box>
    )
}

const MobileNav = () => {
    return (
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    )
}

const MobileNavItem = ({ label, children, href }) => {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Box
                py={2}
                as="a"
                href={href ?? '#'}
                justifyContent="space-between"
                alignItems="center"
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')} >
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Box>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Box as="a" key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Box>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}

const NAV_ITEMS = [
    {
        label: 'หน้าแรก',
        href: '/',
        // children: [
        //   {
        //     label: 'Explore Design Work',
        //     subLabel: 'Trending Design to inspire you',
        //     href: '#',
        //   },
        //   {
        //     label: 'New & Noteworthy',
        //     subLabel: 'Up-and-coming Designers',
        //     href: '#',
        //   },
        // ],
    },
    {
        label: 'ตารางเว็บตูน',
        href: '/originalwebtoon'
        // children: [
        //   {
        //     label: 'Job Board',
        //     subLabel: 'Find your dream design job',
        //     href: '#',
        //   },
        //   {
        //     label: 'Freelance Projects',
        //     subLabel: 'An exclusive list for contract work',
        //     href: '#',
        //   },
        // ],
    },
    {
        label: 'ชั้นหนังสือ',
        href: '/my-page',
    },
    {
        label: 'หมวดหมู่',
        href: '/category',
        children: [
          {
            label: 'ค้นหาการ์ตูน',
            href: '/searchcontents',
          }
        ],
    },
]