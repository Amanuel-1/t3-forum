import React, { useState } from 'react'
import Navbar from '../reusable/global/Navbar'
import AsideSection from './AsideSection'
import AsideToggle from '../reusable/global/AsideToggle'

type TProps = {
  user: {
    id: string,
    username: string,
    name: string,
  },
  children: React.ReactNode,
}

const Layout: React.FC<TProps> = ({ user, children }) => {
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <div className='bg-background text-foreground selection:bg-foreground selection:text-background'>

      <Navbar username={user.username} />

      <div className='flex relative items-start lg:container'>

        <AsideSection openMenu={openMenu} setOpenMenu={setOpenMenu} user={user} />

        <main className='relative lg:w-10/12 w-full pb-10'>
          <AsideToggle setOpenMenu={setOpenMenu} />

          {children}

        </main>

      </div>

    </div>
  )
}

export default Layout
