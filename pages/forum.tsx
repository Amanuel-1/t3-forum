import { getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import CreatePostSection from '@/components/section/CreatePostSection'
import { trpc } from '@/utils/trpc'
import Layout from '@/components/section/Layout'
import { useAnonymousStore } from '@/lib/store'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const CardSkeleton = () => {
  return (
    <>
      <Skeleton className="w-[100px] h-[20px] mb-4 rounded-full" />
    </>
  )
}

const CardForum = dynamic(() => import('../components/reusable/forum/CardForum'), {
  loading: CardSkeleton
})

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

        <ul className='py-4 pb-20 space-y-4 container'>
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
