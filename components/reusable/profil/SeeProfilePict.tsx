import { X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type TProps = {
  image: string,
  seeProfilePict: boolean,
  setSeeProfilePict: (value: React.SetStateAction<boolean>) => void
}

const SeeProfilePict: React.FC<TProps> = ({ image, seeProfilePict, setSeeProfilePict }) => {
  return (
    <div className={`fixed items-center justify-center inset-0 bg-secondary/60 z-30 ${seeProfilePict ? 'flex' : 'hidden'}`}>
      <div className='flex flex-col items-end gap-4'>
        <X onClick={() => setSeeProfilePict(false)} className='cursor-pointer' />
        <Image
          src={image}
          alt='Profile Pict'
          width={300}
          height={300}
          objectFit='cover'
          className='overflow-hidden'
        />
      </div>
    </div>
  )
}

export default SeeProfilePict
