import ReportedPostCard from '@/components/reusable/forum/ReportedPostCard'
import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import Empty from '@/components/reusable/skeleton/Empty'
import Loading from '@/components/reusable/skeleton/Loading'
import Layout from '@/components/section/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { TUser, getAuthUser } from '@/lib/utils'
import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

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

const ReportedPost: NextPage<TProps> = ({ user }) => {
  const { data: postResponse } = trpc.post.byCategory.useQuery("3")

  return (
    <>
      <Head>
        <title>Reported Post</title>
      </Head>
      <Layout user={user}>

        <SubMenuHeader backUrl='/forum' title='Postingan Dilaporkan' data={null}/>
        <div className='container py-4'>

          <ul>
            <Loading data={postResponse?.data} skeletonFallback={<Skeleton className='w-full h-24'/>}>
              <Empty data={postResponse?.data} emptyFallback={<li className='bg-destructive p-3 rounded-r-lg rounded-bl-lg w-max text-white'>{postResponse?.message}</li>}>
                {postResponse?.data?.map(post => (
                  <ReportedPostCard key={post.id} {...post} />
                ))}
              </Empty>
            </Loading>
          </ul>

        </div>

      </Layout>
    </>
  )
}

export default ReportedPost