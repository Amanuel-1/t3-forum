import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { trpc } from '@/utils/trpc'
import { ChevronLeft } from 'lucide-react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { User } from '@prisma/client'
import CardForum from '@/components/reusable/forum/CardForum'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { username } = ctx.query

  return {
    props: {
      username
    }
  }
}

type TProps = {
  username: string
}

type TPost = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    username: string;
    id: string;
  } | null,
}

type TUser = Omit<User, 'password'>

const ProfileDetail: NextPage<TProps> = ({ username }) => {
  const router = useRouter()

  const { error: userError, data: userResponse } = trpc.user.profile.useQuery({ username })
  const { error: postError, data: postResponse } = trpc.post.user.useQuery({ username })

  return (
    <>
      <Head>
        <title>Profil Lo</title>
      </Head>
      <main className='bg-background text-foreground selection:bg-foreground selection:text-background'>
        <div className='container relative'>

          <div className='flex z-20 bg-white items-center sticky top-0 py-4 justify-between lg:justify-start gap-4'>
            <Button onClick={() => router.push('/forum')} className='w-max'>
              <ChevronLeft className='w-5 aspect-square' />
            </Button>
            <p className='text-lg'>Profil <code className='p-2 ml-2 bg-secondary rounded-md'>{userResponse?.data?.username}</code></p>
          </div>

          <div className='h-[2000px]'>

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

        </div>
      </main>
    </>
  )
}

export default ProfileDetail
