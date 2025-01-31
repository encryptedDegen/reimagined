'use client'

import { cn } from '#/lib/utilities'
import { FiX } from 'react-icons/fi'
import { IoMenu } from 'react-icons/io5'
import Link, { type LinkProps } from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'

interface Links {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <motion.div
      className={cn(
        'h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral flex-shrink-0',
        className
      )}
      animate={{
        width: animate ? (open ? '300px' : '60px') : '300px',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MobileSidebar: React.FC<React.ComponentProps<'div'>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className={cn(
        'h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full'
      )}
      {...props}
    >
      <div className="flex justify-end z-20 pt-4 w-full">
        <IoMenu className="text-3xl" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className={cn(
              'fixed h-full w-full inset-0 bg-neutral dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between',
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <FiX className="text-2xl" />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SidebarLink = ({
  link,
  target,
  className,
  ...props
}: {
  link: Links
  className?: string
  target?: string
  props?: LinkProps
}) => {
  const { open, animate } = useSidebar()

  const pathname = usePathname()
  const isActive = pathname === link.href

  return (
    <Link
      href={link.href}
      target={target}
      className={cn(
        'flex items-center flex-nowrap h-10 justify-start gap-2 w-full group/sidebar py-2',
        isActive ? 'text-blue-400 dark:text-neutral-200' : 'text-text',
        className
      )}
      {...props}
    >
      <div className="!w-7">{link.icon}</div>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="transition duration-150 text-nowrap group-hover/sidebar:translate-x-1 overflow-hidden"
      >
        {link.label}
      </motion.span>
    </Link>
  )
}
