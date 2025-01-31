'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

// import LogoImage from 'public/assets/logo.png'
import { Sidebar, SidebarBody, SidebarLink } from '#/components/sidebar'
import { IoHome, IoLogoGithub, IoPerson } from 'react-icons/io5'
import { FaEthereum } from 'react-icons/fa'
import { MdMessage } from 'react-icons/md'
import { RxExit } from 'react-icons/rx'
import ThemeSwitch from '../theme-switch'

export const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: <IoHome className='text-2xl' />
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: <IoPerson className='text-2xl' />
  },
  {
    href: '/swipe',
    label: 'Messages',
    icon: <MdMessage className='text-2xl' />
  }
]

const Navigation = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className='flex flex-col h-screen fixed top-0 left-0'>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className='justify-between gap-10 overflow-hidden'>
          <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            {open ? <Logo /> : <LogoIcon />}
            <div className='mt-8 flex flex-col gap-2'>
              {NAV_ITEMS.map((link, i) => (
                <SidebarLink key={i} link={link} />
              ))}
              <SidebarLink
                link={{
                  label: 'Disconnect Wallet',
                  href: '#',
                  icon: <RxExit className='text-2xl' />
                }}
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <ThemeSwitch sidebarOpen={open} />
            <SidebarLink
              link={{
                label: 'encrypteddegen/reimagined',
                href: 'https://github.com/encrypteddegen/reimagined',
                icon: <IoLogoGithub className='text-2xl' />
              }}
              target='_blank'
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  )
}

export const Logo = () => {
  return (
    <Link
      href='/'
      className='flex items-center flex-nowrap justify-start gap-2 w-full group/sidebar'
    >
      <div className='!w-7'>
        <FaEthereum className='text-[26px]' />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='font-medium transition-all duration-150 whitespace-pre'
      >
        Reimagined
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link href='/' className='!w-7'>
      <FaEthereum className='text-[26px]' />
    </Link>
  )
}

export default Navigation
