import { getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import AsideSection from '@/components/section/AsideSection'
import Navbar from '@/components/reusable/global/Navbar'
import AsideToggle from '@/components/reusable/global/AsideToggle'
import { Input } from '@/components/ui/input'
import CreatePostSection from '@/components/section/CreatePostSection'
import CardForum from '@/components/reusable/forum/CardForum'
import { trpc } from '@/utils/trpc'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getAuthUser(ctx.req.cookies?.token!)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      user
    }
  }
}

type TProps = {
  user: {
    id: string,
    username: string,
    name: string,
  }
}

const Forum: NextPage<TProps> = ({ user }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [openCreatePostInput, setOpenCreatePostInput] = useState(false)

  const posts = trpc.post.all.useQuery()

  useEffect(() => {
    if(!openCreatePostInput) posts.refetch()
  }, [openCreatePostInput, posts])

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <div className='bg-background text-foreground selection:bg-foreground selection:text-background'>

        <Navbar username={user.username} />

        <div className='flex relative items-start lg:container'>

          <AsideSection openMenu={openMenu} setOpenMenu={setOpenMenu} user={user} />

          <main className='relative lg:w-10/12 w-full h-[2000px]'>
            <AsideToggle setOpenMenu={setOpenMenu} />
            <CreatePostSection userId={user.id} openCreatePostInput={openCreatePostInput} setOpenCreatePostInput={setOpenCreatePostInput} />

            <div className='sticky z-10 top-0 py-4 container bg-white/50 backdrop-blur-md border-b'>
              <div className='flex items-start justify-between gap-4'>
                <Input
                  type='text'
                  placeholder='Apa sih yang lu pikirin?'
                  onFocus={() => setOpenCreatePostInput(true)}
                />
              </div>
            </div>


            <ul className='py-4 space-y-4 container'>
              {posts.data?.data?.map((post, idx) => (
                <li key={idx}>
                  <CardForum {...post} />
                </li>
              ))}
            </ul>

          </main>

        </div>

      </div>
    </>
  )
}

export default Forum
