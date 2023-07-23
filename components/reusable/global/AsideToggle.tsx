import { Button } from '@/components/ui/button'
import { AlignJustify } from 'lucide-react'
import React from 'react'

type TProps = {
  setOpenMenu: (value: React.SetStateAction<boolean>) => void
}

const AsideToggle: React.FC<TProps> = ({ setOpenMenu }) => {
  return (
    <div className='fixed inset-x-0 bottom-0 p-4 bg-secondary/50 border-t-2 border-secondary backdrop-blur-md w-full lg:hidden'>
      <Button className='w-full flex items-center justify-between space-x-2' onClick={() => setOpenMenu(true)}>
        <span>Buka Menu</span>
        <AlignJustify className='w-5 aspect-square' />
      </Button>
    </div>
  )
}

export default AsideToggle
