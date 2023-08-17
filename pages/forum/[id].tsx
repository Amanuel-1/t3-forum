import CardForumDetail from '@/components/reusable/forum/CardForumDetail'
import CommentCard from '@/components/reusable/forum/CommentCard'
import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import Loading from '@/components/reusable/skeleton/Loading'
import Layout from '@/components/section/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthUser } from '@/lib/utils'
import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
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
  user: {
    id: string,
    username: string,
    name: string,
    image: string,
    bio: string
  }
}

const PostDetail: NextPage<TProps> = ({ user }) => {
  const router = useRouter()
  const { id } = router.query

  const { data: postResponse } = trpc.post.byId.useQuery(id as string)

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background pb-10 h-[2000px]'>

          <SubMenuHeader
            backUrl='/forum'
            title='Postingan'
            data={user.username}
          />

          <div className='container py-4'>
            <Loading data={postResponse?.data} skeletonFallback={<Skeleton className='w-full h-34 rounded-md' />}>
              {postResponse?.data && (
                <CardForumDetail {...postResponse.data} />
              )}
            </Loading>

            <div className='mt-4'>
              <CommentCard/>
            </div>
          </div>

        </main>
      </Layout>
    </>
  )
}

export default PostDetail
