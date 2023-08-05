import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import Layout from '@/components/section/Layout'
import { TResponseData, TSelectedPost, getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/trpc'
import superjson from 'superjson'
import Loading from '@/components/reusable/skeleton/Loading'
import { Skeleton } from '@/components/ui/skeleton'
import CardForum from '@/components/reusable/kelola/CardForum'
import { trpc } from '@/utils/trpc'
import Empty from '@/components/reusable/skeleton/Empty'
import EditPostForm from '@/components/reusable/kelola/EditPostForm'

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

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson
  })

  await helpers.post.user.prefetch({
    username: user.username as string,
    includeAnonymous: true
  })

  return {
    props: {
      user,
      trpcState: helpers.dehydrate()
    }
  }
}

type TProps = {
  user: {
    id: string,
    username: string,
    name: string,
    bio: string | null,
    image: string | null
  }
}

const DashboardPost: NextPage<TProps> = ({ user }) => {

  const { error: postError, data: postResponse, refetch: postRefetch } = trpc.post.user.useQuery({
    username: user.username,
    includeAnonymous: true
  })

  const [selectedPost, setSelectedPost] = useState<TSelectedPost | null>(null)

  const [openEditMenu, setOpenEditMenu] = useState(false)
  const [postHasBeenEdited, setPostHasBeenEdited] = useState(false)
  const [responseData, setResponseData] = useState<TResponseData | null>(null)

  useEffect(() => {
    if(postHasBeenEdited) {
      postRefetch()
      if(!openEditMenu) setResponseData(null)
    }
  }, [postHasBeenEdited, openEditMenu])

  return (
    <>
      <Head>
        <title>Kelola Post</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background'>

          <SubMenuHeader backUrl='/forum' title='Kelola Postingan' data={null} />

          <div>
            <EditPostForm
              userId={selectedPost?.userId || null}
              postId={selectedPost?.id!}
              content={selectedPost?.content!}
              isAnonymous={selectedPost?.userId! === undefined}
              {...{
                openEditMenu,
                setOpenEditMenu,
                setPostHasBeenEdited,
                responseData,
                setResponseData
              }} />

            <div className='container'>
              <ul className='pt-4 pb-20 space-y-4'>
                <Loading data={postResponse?.data} skeletonFallback={<Skeleton className='w-full h-12 rounded-md' />}>
                  <Empty data={postResponse?.data} emptyFallback={
                    <li className='text-foreground/60'>
                      Kosong
                    </li>
                  }>
                    {postResponse?.data?.map((post, idx) => (
                      <li key={idx}>
                        <CardForum {...{ ...post, setOpenEditMenu, setSelectedPost }} />
                      </li>
                    ))}
                  </Empty>
                </Loading>
              </ul>
            </div>
          </div>

        </main>
      </Layout>
    </>
  )
}

export default DashboardPost
