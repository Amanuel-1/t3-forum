import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import React from 'react'

const Navbar: React.FC = () => {
  return (
    <nav className='py-4 border-b-2 border-secondary'>

      <div className='container flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <h1 className='text-2xl font-bold'>Forum<span className='text-red-600'>Gw</span></h1>
          <Badge>Beta</Badge>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

    </nav>
  )
}

export default Navbar
