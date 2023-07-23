import { getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import AsideSection from '@/components/section/AsideSection'
import Navbar from '@/components/reusable/global/Navbar'
import AsideToggle from '@/components/reusable/global/AsideToggle'
import { Input } from '@/components/ui/input'
import CreatePostSection from '@/components/section/CreatePostSection'

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
  const [openMenu, setOpenMenu] = useState(false)
  const [openCreatePostInput, setOpenCreatePostInput] = useState(false)

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <div className='bg-background text-foreground selection:bg-foreground selection:text-background'>

        <Navbar />

        <div className='flex relative items-start lg:container'>

          <AsideSection openMenu={openMenu} setOpenMenu={setOpenMenu} user={user} />

          <main className='relative lg:w-10/12 w-full h-[2000px]'>
            <AsideToggle setOpenMenu={setOpenMenu} />

            <div className='sticky top-0 py-4 container bg-secondary/50 backdrop-blur-md border-b'>
              <div className='flex items-start justify-between gap-4'>
                <Input
                  type='text'
                  placeholder='Apa sih yang lu pikirin?'
                  onFocus={() => setOpenCreatePostInput(true)}
                />
              </div>
            </div>

            <CreatePostSection openCreatePostInput={openCreatePostInput} setOpenCreatePostInput={setOpenCreatePostInput} />

            <ul className='py-4 container'>
              <li>Post 1</li>
              <li>Post 2</li>
            </ul>

          </main>

        </div>

      </div>
    </>
  )
}

export default Forum
