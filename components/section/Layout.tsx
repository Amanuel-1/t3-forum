import React, { useState } from 'react'
import Navbar from '../reusable/global/Navbar'
import AsideSection from './AsideSection'
import AsideToggle from '../reusable/global/AsideToggle'
import { trpc } from '@/utils/trpc'

type TProps = {
  user: {
    username: string,
  },
  children: React.ReactNode,
}

const Layout: React.FC<TProps> = ({ user, children }) => {
  const [openMenu, setOpenMenu] = useState(false)

  const { data: response } = trpc.user.profile.useQuery({
    username: user.username
  })

  return (
    <div className='bg-background text-foreground selection:bg-foreground selection:text-background'>

      <Navbar username={response?.data?.username || ''} image={response?.data?.image || null} />

      <div className='flex relative items-start lg:container'>

        {/* @ts-ignore */}
        <AsideSection openMenu={openMenu} setOpenMenu={setOpenMenu} user={response?.data} />

        <main className='relative lg:w-10/12 w-full pb-10'>
          <AsideToggle setOpenMenu={setOpenMenu} />

          {children}

        </main>

      </div>

    </div>
  )
}

export default Layout
