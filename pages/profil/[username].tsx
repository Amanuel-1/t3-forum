import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { trpc } from '@/utils/trpc'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import CardForum from '@/components/reusable/forum/CardForum'
import { getAuthUser } from '@/lib/utils'
import Layout from '@/components/section/Layout'
import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/trpc'
import superjson from 'superjson'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { username } = ctx.query
  const user = await getAuthUser(ctx.req.cookies?.token!)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  // Prefetch the data
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson
  })

  await helpers.user.profile.prefetch({ username: username as string })
  await helpers.post.user.prefetch({ username: username as string })

  return {
    props: {
      username,
      user,
      trpcState: helpers.dehydrate()
    }
  }
}

type TProps = {
  username: string,
  user: {
    id: string,
    username: string,
    name: string,
  }
}

const ProfileDetail: NextPage<TProps> = ({ username, user }) => {

  const { error: userError, data: userResponse } = trpc.user.profile.useQuery({ username })
  const { error: postError, data: postResponse } = trpc.post.user.useQuery({ username })

  return (
    <>
      <Head>
        <title>Profil Lo</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background pb-10'>

          <SubMenuHeader backUrl='/forum' title='Profil' data={userResponse?.data?.username} />

          <div className='container'>

            <div className='flex items-start gap-4 py-4'>
              {/** Preview Image */}
              <Avatar className='cursor-pointer w-14 h-14 rounded-md'>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className='text-lg font-bold'>{userResponse?.data?.name}</h2>
                <p>{userResponse?.data?.username}</p>
              </div>
            </div>

            <Separator />

            <div className='mt-2'>
              <h2 className='text-lg font-bold'>Bio</h2>
              <p className={`mt-2 ${userResponse?.data?.bio ? '' : 'text-foreground/60'}`}>{userResponse?.data?.bio || 'Kosong'}</p>
            </div>

            <div className='mt-2'>
              <h2 className='text-lg font-bold'>Postingan</h2>

              <ul className='py-2 space-y-4'>
                {postResponse?.data?.map((post, idx) => (
                  <li key={idx}>
                    <CardForum {...post} />
                  </li>
                ))}

                {!postResponse?.data?.length && (
                  <li className='text-foreground/60'>
                    Kosong
                  </li>
                )}
              </ul>
            </div>

          </div>

        </main>
      </Layout>
    </>
  )
}

export default ProfileDetail
