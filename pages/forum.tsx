import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getAuthUser } from '@/lib/utils'
import { MessagesSquare, User, VenetianMask } from 'lucide-react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

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
    username: string
  }
}

const Forum: NextPage<TProps> = ({ user }) => {
  const [menu, setMenu] = useState('fyp')
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <main className='bg-background text-foreground selection:bg-foreground selection:text-background'>
        <nav className='py-4 border-b-2 border-secondary'>
          <div className='container flex justify-between items-center'>

            <h1 className='text-2xl font-bold'>Forum<span className='text-red-600'>Gw</span></h1>
            <ul className='flex items-center space-x-2'>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' className='flex items-center space-x-2'>
                      <MessagesSquare />
                      <span>Diskusi ( {menu.toUpperCase()} )</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52">
                    <DropdownMenuLabel>Kategori Diskusi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={menu} onValueChange={setMenu}>
                      <DropdownMenuRadioItem value="fyp">FYP</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dev">Dari Developer</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuLabel>Pengaturan</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='space-x-2 cursor-pointer' onClick={() => router.push('/pengaturan/akun')}>
                        <User className='w-4 aspect-square' />
                        <span>
                          Akun
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='space-x-2 cursor-pointer' onClick={() => router.push('/pengaturan/anonymous')}>
                        <VenetianMask className='w-4 aspect-square' />
                        <span>
                          Anonymous
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuLabel>Ini Elu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='space-x-2 cursor-pointer' onClick={() => router.push('/profil/adicss')}>
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-bold'>
                            {user.username}
                          </p>
                          <p className='text-xs'>Yang Punya Aplikasi</p>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>

          </div>
        </nav>
      </main>
    </>
  )
}

export default Forum
