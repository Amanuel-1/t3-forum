import { TUser, getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import CreatePostSection from '@/components/section/CreatePostSection'
import { trpc } from '@/utils/trpc'
import Layout from '@/components/section/Layout'
import { useAnonymousStore, usePostCategory } from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'
import CardForum from '@/components/reusable/forum/CardForum'
import Loading from '@/components/reusable/skeleton/Loading'
import Empty from '@/components/reusable/skeleton/Empty'

const CardSkeleton = () => {
  return (
    <>
      <Skeleton className="w-full h-24 mb-4 rounded-md" />
    </>
  )
}

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
  user: TUser
}

const Forum: NextPage<TProps> = ({ user }) => {
  const [openCreatePostInput, setOpenCreatePostInput] = useState(false)
  const isAnonymPost = useAnonymousStore((state) => state.isAnonymPost)
  
  const { categoryId } = usePostCategory(state => state)

  const { data: postResponse, refetch: postRefetch } = trpc.post.byCategory.useQuery(categoryId)

  useEffect(() => {
    postRefetch()
    if (!openCreatePostInput) postRefetch()
  }, [openCreatePostInput, postResponse, categoryId])

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <Layout user={user}>
        <CreatePostSection 
          {...{ 
            userId: user.id,
            username: user.username,
            isAnonymPost, 
            openCreatePostInput, 
            setOpenCreatePostInput 
          }} />

        <div className='sticky z-10 top-0 py-4 container bg-white/50 backdrop-blur-md'>
          <div className='flex items-start justify-between gap-4'>
            <Input
              type='text'
              placeholder='Apa sih yang lu pikirin?'
              onFocus={() => setOpenCreatePostInput(true)}
            />
          </div>
        </div>

        <ul className='py-4 pb-20 space-y-4 container'>
          <Loading data={postResponse?.data} skeletonFallback={<CardSkeleton />}>
            <Empty data={postResponse?.data} emptyFallback={<li className='p-3 text-primary bg-secondary w-max rounded'>{postResponse?.message}</li>}>
                {postResponse?.data?.map((post, idx) => (
                  <li key={idx}>
                    <CardForum {...post} />
                  </li>
                ))}
            </Empty>
          </Loading>
        </ul>
      </Layout>
    </>
  )
}

export default Forum
