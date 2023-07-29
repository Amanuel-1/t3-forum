import { getAuthUser } from '@/lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import Layout from '@/components/section/Layout'
import SubMenuHeader from '@/components/reusable/menu/SubMenuHeader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

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
    bio: string | null,
    image: string | null
  }
}

const PengaturanAkun: NextPage<TProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Pengaturan Akun</title>
      </Head>
      <Layout user={user}>
        <main className='bg-background text-foreground selection:bg-foreground selection:text-background'>

          <SubMenuHeader backUrl='/forum' title='Pengaturan Akun' data={user.username} />
          <div className='container'>

            <div className='flex items-start gap-4 py-4'>
              {/** Preview Image */}
              <Avatar className='cursor-pointer w-14 h-14 rounded-md'>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className='text-lg font-bold'>{user?.name}</h2>
                <p>{user?.username}</p>
              </div>
            </div>

            <Separator />

            <div className='mt-2'>
              <h2 className='text-lg font-bold'>Bio</h2>
              <p className={`mt-2 ${user?.bio ? '' : 'text-foreground/60'}`}>{user?.bio || 'Kosong'}</p>
            </div>

            <Button className='mt-4'>
              Edit Profil
            </Button>
          </div>


        </main>
      </Layout>
    </>
  )
}

export default PengaturanAkun
