import React, { useState } from 'react'
import Navbar from '../reusable/global/Navbar'
import AsideSection from './AsideSection'
import AsideToggle from '../reusable/global/AsideToggle'
import { useUser } from '@/lib/hooks'

type TProps = {
  user: {
    id: string,
    username: string,
    name: string,
    image: string | null,
    bio: string | null
  },
  children: React.ReactNode,
}

const Layout: React.FC<TProps> = ({ user, children }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const { user: currentUser } = useUser(user)

  return (
    <div className='bg-background text-foreground selection:bg-foreground selection:text-background'>

      <Navbar username={currentUser.username} image={currentUser.image} />

      <div className='flex relative items-start lg:container'>

        <AsideSection openMenu={openMenu} setOpenMenu={setOpenMenu} user={currentUser} />

        <main className='relative lg:w-10/12 w-full pb-10'>
          <AsideToggle setOpenMenu={setOpenMenu} />

          {children}

        </main>

      </div>

    </div>
  )
}

export default Layout
