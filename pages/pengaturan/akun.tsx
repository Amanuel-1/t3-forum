import { getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '@/components/section/Layout'
import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import EditAccountForm from '@/components/section/EditAccountForm'
import { trpc } from '@/utils/trpc'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/trpc'
import superjson from 'superjson'

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


  // Prefetch the data
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson
  })
  await helpers.user.profile.prefetch({ username: user.username as string })

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


const PengaturanAkun: NextPage<TProps> = ({ user }) => {
  const [openEditMenu, setOpenEditMenu] = useState(false)
  const [profileHasBeenEdited, setProfileHasBeenEdited] = useState(false)

  const { data: userResponse, refetch: userRefetch } = trpc.user.profile.useQuery({
    username: user.username
  })

  useEffect(() => {
    if (profileHasBeenEdited && !openEditMenu) {
      userRefetch()
    }
  }, [profileHasBeenEdited, openEditMenu, userRefetch])

  return (
    <>
      <Head>
        <title>Pengaturan Akun</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background'>

          <SubMenuHeader backUrl='/forum' title='Pengaturan Akun' data={user.username} />
          <div className='relative'>

            <EditAccountForm user={user} {...{ openEditMenu, setOpenEditMenu, setProfileHasBeenEdited }} />

            <div className='container'>
              <div className='flex items-start gap-4 py-4'>
                {/** Preview Image */}
                <Avatar className='cursor-pointer w-14 h-14 rounded-md'>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-lg font-bold'>Ubah Foto Profil</h2>
                  <p>Maksimal cuma bisa 2MB ya bre</p>
                </div>
              </div>

              <Separator />

              <div className='mt-2'>
                <h2 className='text-lg font-bold'>Nama Lengkap</h2>
                <p className={`mt-2`}>{userResponse?.data?.name}</p>
              </div>

              <div className='mt-2'>
                <h2 className='text-lg font-bold'>Username</h2>
                <p className={`mt-2`}>{userResponse?.data?.username}</p>
              </div>

              <div className='mt-2'>
                <h2 className='text-lg font-bold'>Bio</h2>
                <p className={`mt-2 ${userResponse?.data?.bio ? '' : 'text-foreground/60'}`}>{userResponse?.data?.bio || 'Kosong'}</p>
              </div>

              <Button className='mt-4 w-full lg:w-max' onClick={() => setOpenEditMenu(true)}>
                Edit Profil
              </Button>
            </div>

          </div>

        </main>
      </Layout>
    </>
  )
}

export default PengaturanAkun
