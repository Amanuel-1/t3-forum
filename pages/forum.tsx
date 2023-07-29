import { getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import CreatePostSection from '@/components/section/CreatePostSection'
import CardForum from '@/components/reusable/forum/CardForum'
import { trpc } from '@/utils/trpc'
import Layout from '@/components/section/Layout'
import { useAnonymousStore } from '@/lib/store'

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
  const [openCreatePostInput, setOpenCreatePostInput] = useState(false)
  const isAnonymPost = useAnonymousStore((state) => state.isAnonymPost)

  const posts = trpc.post.all.useQuery()

  useEffect(() => {
    if (!openCreatePostInput) posts.refetch()
  }, [openCreatePostInput, posts])

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <Layout user={user}>
        <CreatePostSection isAnonymPost={isAnonymPost} userId={user.id} openCreatePostInput={openCreatePostInput} setOpenCreatePostInput={setOpenCreatePostInput} />

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
      </Layout>
    </>
  )
}

export default Forum
