'use client'
import { AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  useColorMode,
  Link,
} from '@chakra-ui/react'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiBook,
  FiChevronDown,
} from 'react-icons/fi'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { FaBook } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const LinkItems = [
  { name: 'หน้าแรก', icon: FiHome, url: '/creator' },
  { name: 'สร้างผลงาน', icon: AiOutlineAppstoreAdd, url: '/creator/createcontent' },
  { name: 'ผลงานของฉัน', icon: FaBook, url: '/creator/mycontents' },
  { name: 'คู่มือ', icon: FiBook, url: '#' },
]
const LinkItemsAdmin = [
  { name: 'หน้าแรก', icon: FiHome, url: '/admin' },
  { name: 'จัดการสมาชิก', icon: AiOutlineAppstoreAdd, url: '/admin/managemember' },
]

const SidebarContent = ({ onClose, ...rest }) => {
  const session = useSession();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Webtoon
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {
        session.data?.user.role === "creator" && (
          <>
            {LinkItems.map((link) => (
              <NavItem key={link.name} icon={link.icon} url={link.url}>
                {link.name}
              </NavItem>
            ))}
          </>
        )
      }
      {
        session.data?.user.role === "admin" && (
          <>
            {LinkItemsAdmin.map((link) => (
              <NavItem key={link.name} icon={link.icon} url={link.url}>
                {link.name}
              </NavItem>
            ))}
          </>
        )
      }

    </Box>
  )
}

const NavItem = ({ icon, children, url, ...rest }) => {
  return (
    <Box
      as="a"
      href={url}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>


        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}

      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  const session = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        WEBTOON
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Button onClick={toggleColorMode} size={'lg'} variant="ghost"  >
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Flex alignItems={'center'}>

          <Menu>

            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  name={session.data?.user.name}
                  size={'sm'}
                  src={session.data?.user.image}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{session.data?.user.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {session.data?.user.role}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Link href={'/'}>
                <MenuItem display={{ base: 'none', md: 'inline-flex' }} >กลับสู่หน้าหลัก</MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem>ออกจากระบบ</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

const Sidebar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
        {children}
      </Box>
    </Box>
  )
}

export default Sidebar