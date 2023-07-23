import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRouter } from 'next/router'
import React from 'react'

type TProps = {
  username: string
}

const Navbar: React.FC<TProps> = ({ username }) => {
  const router = useRouter()

  return (
    <nav className='py-4 border-b-2 border-secondary'>

      <div className='container flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <h1 className='text-2xl font-bold'>Forum<span className='text-red-600'>Gw</span></h1>
          <Badge>Beta</Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar onClick={() => router.push('/profil/' + username)} className='cursor-pointer'>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lihat Profil</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </nav>
  )
}

export default Navbar
