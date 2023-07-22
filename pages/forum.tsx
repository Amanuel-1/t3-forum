import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getAuthUser } from '@/lib/utils'
import { AlignJustify, Bug, ChevronDown, LogOut, TrendingUp, User, VenetianMask } from 'lucide-react'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getAuthUser(ctx.req.cookies?.token!)

  return {
    props: {
      user
    }
  }
}

type TProps = {
  user: {
    username: string,
    name: string,
  }
}

const Forum: NextPage<TProps> = ({ user }) => {
  const [menu, setMenu] = useState('fyp')
  const [openMenu, setOpenMenu] = useState(false)

  const router = useRouter()

  const logoutHandler = async () => {
    const req = await fetch('/api/cookie/destroy', {
      method: "DELETE"
    })

    if (req.ok) return router.push('/login')
  }

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <div className='bg-background text-foreground selection:bg-foreground selection:text-background'>
        <nav className='py-4 border-b-2 border-secondary'>

          <div className='container flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <h1 className='text-2xl font-bold'>Forum<span className='text-red-600'>Gw</span></h1>
              <Badge>Beta</Badge>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

        </nav>

        <div className='flex relative items-start container gap-4 '>

          <aside className={`
            lg:w-2/12 flex flex-col justify-between lg:sticky lg:top-0 
            py-4 lg:pr-2 lg:border-r-2 lg:border-b-2 lg:rounded-b-md 
            lg:border-secondary lg:px-0 lg:bg-transparent lg:translate-y-0
            h-screen

            fixed inset-0 z-10 px-4 bg-secondary ${openMenu ? 'translate-y-0' : 'translate-y-full'}
            transition-all
          `}>
            <div>

              <h2 className='text-lg font-bold'>Kategori Diskusi</h2>
              <ul className='mt-2 space-y-2'>
                <li onClick={() => setMenu('fyp')} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md border ${menu === 'fyp' ? 'bg-primary text-secondary' : 'bg-white hover:bg-secondary'}`}>
                  <TrendingUp className='w-5 aspect-square' />
                  <span className='text-md'>FYP</span>
                </li>
                <li onClick={() => setMenu('dev')} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md border ${menu === 'dev' ? 'bg-primary text-secondary' : 'bg-white hover:bg-secondary'}`}>
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

          <main className='py-4 relative w-full lg:w-auto h-[2000px]'>
            <div className='fixed inset-x-0 bottom-0 p-4 bg-secondary/50 border-t-2 border-secondary backdrop-blur-md w-full lg:hidden'>
              <Button className='w-full flex items-center justify-between space-x-2' onClick={() => setOpenMenu(true)}>
                <span>Buka Menu</span>
                <AlignJustify className='w-5 aspect-square' />
              </Button>
            </div>
            <p>Main Content Goes Here</p>
          </main>

        </div>

      </div>
    </>
  )
}

export default Forum
