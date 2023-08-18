import { TResponseData, TUser, getAuthUser } from '@/lib/utils'
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
import Loading from '@/components/reusable/skeleton/Loading'
import { Skeleton } from '@/components/ui/skeleton'
import RefetchData from '@/components/reusable/global/RefetchData'
import EditProfilePicture from '@/components/reusable/akun/EditProfilePicture'
import { useUser } from '@/lib/hooks'

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
  user: TUser
}

const PengaturanAkun: NextPage<TProps> = ({ user }) => {
  const { user: currentUser, setUser } = useUser(user)

  const [openEditMenu, setOpenEditMenu] = useState(false)
  const [profileHasBeenEdited, setProfileHasBeenEdited] = useState(false)

  const [openEditPictMenu, setOpenEditPictMenu] = useState(false)

  const [responseData, setResponseData] = useState<TResponseData | null>(null)

  const { isRefetching, refetch: userRefetch, data: userResponse } = trpc.user.profile.useQuery({
    username: user.username
  })

  useEffect(() => {
    if (profileHasBeenEdited) {
      userRefetch().then((res) => {
        if (res.data?.data) {
          console.log('new user')
          setUser(res.data.data)
        }
      })
      if (!openEditMenu) setResponseData(null)
    }

  }, [profileHasBeenEdited, openEditPictMenu, openEditMenu, userResponse])

  return (
    <>
      <Head>
        <title>Pengaturan Akun</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background'>

          <SubMenuHeader backUrl='/forum' title='Pengaturan Akun' data={currentUser.username} />
          <RefetchData isRefetching={isRefetching} />

          <EditProfilePicture
            {...{
              openEditPictMenu,
              setOpenEditPictMenu,
              setProfileHasBeenEdited,
              user: currentUser
            }} />

          <div className='relative'>

            <EditAccountForm
              {...{
                openEditMenu,
                setOpenEditMenu,
                setProfileHasBeenEdited,
                responseData,
                setResponseData
              }} />

            <div className='container'>
              <div className='flex items-start gap-4 py-4'>
                {/** Preview Image */}
                <Avatar onClick={() => setOpenEditPictMenu(true)} className='cursor-pointer w-14 h-14 rounded-md'>
                  <AvatarImage src={(currentUser.image || null) ?? ''} alt="@shadcn" />
                  <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-lg font-bold'>Ubah Foto Profil</h2>
                  <p>Maksimal cuma bisa 2MB ya bre</p>
                </div>
              </div>

              <Separator />

              <div className='mt-2'>
                <h2 className='text-lg font-bold'>Nama Lengkap</h2>
                <Loading data={currentUser.name} skeletonFallback={<Skeleton className='w-24 p-2 rounded-md mt-2' />}>
                  <p className={`mt-2`}>{currentUser.name}</p>
                </Loading>
              </div>

              <div className='mt-2'>
                <h2 className='text-lg font-bold'>Username</h2>
                <Loading data={currentUser.username} skeletonFallback={<Skeleton className='w-24 p-2 rounded-md mt-2' />}>
                  <p className={`mt-2`}>{currentUser.username}</p>
                </Loading>
              </div>

              <div className='mt-2'>
                <h2 className='text-lg font-bold'>Bio</h2>
                <Loading data={currentUser.bio} skeletonFallback={<Skeleton className='w-24 p-2 rounded-md mt-2' />}>
                  <p className={`mt-2 ${currentUser.bio ? '' : 'text-foreground/60'}`}>{currentUser.bio || 'Kosong'}</p>
                </Loading>
              </div>

              <Button className='mt-4 w-full lg:w-max' onClick={() => setOpenEditMenu(true)}>
                Edit Profil Ini
              </Button>
            </div>

          </div>

        </main>
      </Layout>
    </>
  )
}

export default PengaturanAkun
