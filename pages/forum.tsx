import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { getAuthUser } from '@/lib/utils'
import { ChevronLeft, LogOut, Text, User, VenetianMask } from 'lucide-react'
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

    if(req.ok) return router.push('/login')
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

            fixed inset-0 z-10 px-4 bg-secondary ${openMenu ? 'translate-y-0' : '-translate-y-full'}
            transition-all
          `}>
            <div>
              <Button variant='outline' className='mb-2 w-full space-x-2 lg:hidden' onClick={() => setOpenMenu(false)}>
                <ChevronLeft className='w-5 aspect-square' />
                <span>Tutup Menu Ini</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='flex w-full items-center space-x-2'>
                    <Text className='w-5 aspect-square' />
                    <span>Diskusi {menu.toUpperCase()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <DropdownMenuLabel>Kategori Diskusi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={menu} onValueChange={setMenu}>
                    <DropdownMenuRadioItem value="fyp">FYP</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dev">Dari Developer</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator className='my-4' />

              <h2 className='text-lg font-bold'>Pengaturan</h2>
              <ul className='mt-2 space-y-2'>
                <li>
                  <Link href='/pengaturan/akun' className='flex items-center space-x-2 p-2 hover:bg-secondary rounded-md border'>
                    <User className='w-5 aspect-square' />
                    <span className='text-md'>Akun</span>
                  </Link>
                </li>
                <li>
                  <Link href='/pengaturan/anonymous' className='flex items-center space-x-2 p-2 hover:bg-secondary rounded-md border'>
                    <VenetianMask className='w-5 aspect-square' />
                    <span className='text-md'>Anonymous</span>
                  </Link>
                </li>
              </ul>

            </div>

            <div className='w-full'>
              <Separator className='my-4' />
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-bold'>{user.username}</p>
                  <Link href={`/profil/${user.username}`} className='text-sm mt-0 hover:underline'>Lihat Profil</Link>
                </div>
              </div>

              <Button variant='destructive' className='mt-4 space-x-2 w-full' onClick={logoutHandler}>
                <LogOut className='w-5 aspect-square' />
                <span>Keluar</span>
              </Button>
            </div>
          </aside>

          <main className='py-4 relative w-full lg:w-auto h-[2000px]'>
            <div className='sticky top-4 pb-4 w-full lg:hidden'>
              <Button className='w-full' onClick={() => setOpenMenu(true)}>Buka Menu</Button>
            </div>
            <p>Main Content Goes Here</p>
          </main>

        </div>

      </div>
    </>
  )
}

export default Forum
