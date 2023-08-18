import { ArrowLeftRight, Blinds, Bug, ChevronDown, Globe, LogOut, TrendingUp, User, VenetianMask } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useRouter } from 'next/router'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { useAnonymousStore, usePostCategory } from '@/lib/store'
import { TUser } from '@/lib/utils'

type TProps = {
  user: TUser,
  openMenu: boolean,
  setOpenMenu: (value: React.SetStateAction<boolean>) => void,
}

const AsideSection: React.FC<TProps> = ({ setOpenMenu, openMenu, user }) => {

  const [menu, setMenu] = useState('fyp')
  const { isAnonymPost, setIsAnonymPost } = useAnonymousStore(state => state)
  const { setCategoryId } = usePostCategory(state => state)

  const router = useRouter()

  useEffect(() => {
    setCategoryId("1")

    if (menu === 'fyp') setCategoryId("1")
    if (menu === 'dev') setCategoryId("2")

  }, [menu, user])

  const logoutHandler = async () => {
    const req = await fetch('/api/cookie/destroy', {
      method: "DELETE"
    })

    if (req.ok) return router.push('/login')
  }

  return (
    <aside className={`
      lg:w-1/5 flex flex-col justify-between lg:sticky lg:top-0 
      py-4 lg:pr-4 lg:border-r lg:rounded-b-md 
      lg:px-0 lg:bg-transparent lg:translate-y-0
      h-screen

      fixed inset-0 z-20 px-4 bg-white ${openMenu ? 'translate-y-0' : 'translate-y-[200%]'}
      transition-all
      lg:pl-[2rem]
    `}>
      <div>

        <div className='w-full border rounded-md py-2 px-4 bg-white flex justify-between'>
          {isAnonymPost ? (
            <VenetianMask className='w-5 aspect-square' />
          ) : (
            <Globe className='w-5 aspect-square' />
          )}
          <p className={`font-bold ${isAnonymPost ? 'text-red-600' : 'text-black'}`}>{isAnonymPost ? 'Anonym Mode' : 'Public Mode'}</p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ArrowLeftRight className='w-5 aspect-square cursor-pointer' onClick={() => setIsAnonymPost(!isAnonymPost)} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Mode Julid Lo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h2 className='mt-8 text-lg font-bold'>Kategori Diskusi</h2>
        <ul className='mt-2 space-y-2'>
          <li onClick={() => {
            if(router.asPath !== '/forum') router.push('/forum')
            setMenu('fyp')
            setOpenMenu(false)
          }} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md border ${menu === 'fyp' ? 'bg-primary text-secondary' : 'bg-white hover:bg-secondary'}`}>
            <TrendingUp className='w-5 aspect-square' />
            <span className='text-md'>FYP</span>
          </li>
          <li onClick={() => {
            if(router.asPath !== '/forum') router.push('/forum')
            setMenu('dev')
            setOpenMenu(false)
          }} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md border ${menu === 'dev' ? 'bg-primary text-secondary' : 'bg-white hover:bg-secondary'}`}>
            <Bug className='w-5 aspect-square' />
            <span className='text-md'>Dari Developer</span>
          </li>
        </ul>

        <Separator className='my-4' />

        <h2 className='text-lg font-bold'>Pengaturan</h2>
        <ul className='mt-2 space-y-2'>
          <li>
            <Link href='/kelola/post' className={`flex items-center space-x-2 p-2 ${router.asPath === '/kelola/post' ? 'bg-secondary' : 'bg-white'} hover:bg-secondary rounded-md border`}>
              <Blinds className='w-5 aspect-square' />
              <span className='text-md'>Kelola Postingan</span>
            </Link>
          </li>
          <li>
            <Link href='/pengaturan/akun' className={`flex items-center space-x-2 p-2 ${router.asPath === '/pengaturan/akun' ? 'bg-secondary' : 'bg-white'} hover:bg-secondary rounded-md border`}>
              <User className='w-5 aspect-square' />
              <span className='text-md'>Akun</span>
            </Link>
          </li>
          <li>
            <Link href='/pengaturan/anonymous' className={`flex items-center space-x-2 p-2 ${router.asPath === '/pengaturan/anonymous' ? 'bg-secondary' : 'bg-white'} hover:bg-secondary rounded-md border`}>
              <VenetianMask className='w-5 aspect-square' />
              <span className='text-md'>Anonymous</span>
            </Link>
          </li>
        </ul>

      </div>

      <div className='w-full'>
        <Separator className='my-4' />

        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Avatar>
              <AvatarImage src={user?.image || ''} alt="@shadcn" />
              <AvatarFallback>{`${user?.username[0] || ''}`.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-bold'>{user?.username}</p>
              <Link href={`/profil/${user?.username}`} className='text-xs text-foreground/60 mt-0 hover:underline'>Lihat Profil</Link>
            </div>
          </div>

          <Button variant='destructive' className='space-x-2 w-max' onClick={logoutHandler}>
            <LogOut className='w-5 aspect-square' />
          </Button>
        </div>

        <Button variant='outline' className='my-4 w-full space-x-2 justify-between lg:hidden' onClick={() => setOpenMenu(false)}>
          <span>Tutup Menu Ini</span>
          <ChevronDown className='w-5 aspect-square' />
        </Button>
      </div>
    </aside>
  )
}

export default AsideSection
