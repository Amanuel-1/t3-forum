import CardForumDetail from '@/components/reusable/forum/CardForumDetail'
import CommentCard from '@/components/reusable/forum/CommentCard'
import RefetchData from '@/components/reusable/global/RefetchData'
import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import Loading from '@/components/reusable/skeleton/Loading'
import Layout from '@/components/section/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/lib/hooks'
import { TUser, getAuthUser } from '@/lib/utils'
import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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

const PostDetail: NextPage<TProps> = ({ user }) => {
  const router = useRouter()
  const { id } = router.query

  const { user: currentUser } = useUser(user)

  const { data: postResponse } = trpc.post.byId.useQuery(id as string)
  const { data: commentsResponse, refetch: commentRefetch, isRefetching } = trpc.comment.byPostId.useQuery(id as string)

  const [commentHasBeenEdited, setCommentHasBeenEdited] = useState(false)
  const [commentHasBeenDeleted, setCommentHasBeenDeleted] = useState(false)
  const [newCommentInserted, setNewCommentInserted] = useState(false)

  useEffect(() => {
    if (newCommentInserted) {
      commentRefetch()
      setNewCommentInserted(false)
    }

    if(commentHasBeenEdited) {
      commentRefetch()
      setCommentHasBeenEdited(false)
    }

    if(commentHasBeenDeleted) {
      commentRefetch()
      setCommentHasBeenDeleted(false)
    }
  }, [newCommentInserted, commentHasBeenEdited, commentHasBeenDeleted])

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background pb-10'>

          <SubMenuHeader
            backUrl='/forum'
            title='Postingan'
            data={user.username}
          />
          <RefetchData isRefetching={isRefetching}/>

          <div className='container py-4'>
            <Loading data={postResponse?.data} skeletonFallback={<Skeleton className='w-full h-34 rounded-md' />}>
              {postResponse?.data && (
                <CardForumDetail 
                  {...postResponse.data} 
                  currentUser={currentUser} 
                  setNewCommentInserted={setNewCommentInserted} 
                />
              )}
            </Loading>

            <div className='mt-4'>
              <ul className='space-y-2'>
                <Loading data={commentsResponse} skeletonFallback={<Skeleton className='w-full h-34 rounded-md' />}>
                  {commentsResponse?.data?.map(comment => (
                    <CommentCard key={comment.id} {...comment} setCommentHasBeenEdited={setCommentHasBeenEdited} setCommentHasBeenDeleted={setCommentHasBeenDeleted} />
                  ))}
                </Loading>
              </ul>
            </div>
          </div>

        </main>
      </Layout>
    </>
  )
}

export default PostDetail
