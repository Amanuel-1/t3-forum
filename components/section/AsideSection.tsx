import { Bug, ChevronDown, LogOut, TrendingUp, User, VenetianMask } from 'lucide-react'
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useRouter } from 'next/router'

type TProps = {
  user: {
    username: string,
    name: string,
  },
  openMenu: boolean,
  setOpenMenu: (value: React.SetStateAction<boolean>) => void,
}

const AsideSection: React.FC<TProps> = ({ setOpenMenu, openMenu, user }) => {

  const [menu, setMenu] = useState('fyp')
  const router = useRouter()

  const logoutHandler = async () => {
    const req = await fetch('/api/cookie/destroy', {
      method: "DELETE"
    })

    if (req.ok) return router.push('/login')
  }

  return (
    <aside className={`
      lg:w-2/12 flex flex-col justify-between lg:sticky lg:top-0 
      py-4 lg:pr-2 lg:border-r-2 lg:border-b-2 lg:rounded-b-md 
      lg:border-secondary lg:px-0 lg:bg-transparent lg:translate-y-0
      h-screen

      fixed inset-0 z-20 px-4 bg-secondary ${openMenu ? 'translate-y-0' : 'translate-y-full'}
      transition-all
    `}>
      <div>

        <h2 className='text-lg font-bold'>Kategori Diskusi</h2>
        <ul className='mt-2 space-y-2'>
          <li onClick={() => {
            setMenu('fyp')
            setOpenMenu(false)
          }} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md border ${menu === 'fyp' ? 'bg-primary text-secondary' : 'bg-white hover:bg-secondary'}`}>
            <TrendingUp className='w-5 aspect-square' />
            <span className='text-md'>FYP</span>
          </li>
          <li onClick={() => {
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
            <Link href='/pengaturan/akun' className='flex items-center space-x-2 p-2 bg-white hover:bg-secondary rounded-md border'>
              <User className='w-5 aspect-square' />
              <span className='text-md'>Akun</span>
            </Link>
          </li>
          <li>
            <Link href='/pengaturan/anonymous' className='flex items-center space-x-2 p-2 bg-white hover:bg-secondary rounded-md border'>
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
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-bold'>{user.username}</p>
              <Link href={`/profil/${user.username}`} className='text-sm text-foreground/60 mt-0 hover:underline'>Lihat Profil</Link>
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
