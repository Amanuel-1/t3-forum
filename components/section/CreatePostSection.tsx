import React from 'react'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'

type TProps = {
  openCreatePostInput: boolean,
  setOpenCreatePostInput: (value: React.SetStateAction<boolean>) => void
}

const CreatePostSection: React.FC<TProps> = ({ openCreatePostInput, setOpenCreatePostInput }) => {
  return (
    <div className={`fixed inset-0 z-20 transition-all bg-secondary/40 backdrop-blur-md flex justify-center items-center ${openCreatePostInput ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className='p-4 bg-white w-10/12 lg:w-max border-2 rounded-md'>

        <h1 className='text-2xl flex justify-between items-center font-bold'>
          <span>Buat Postingan</span>
          <span className='text-md'>🚀</span>
        </h1>

        <Separator className='my-4' />

        <div className="grid w-full gap-1.5">
          <Textarea placeholder="Tulis isi Postingan" id="message" />
        </div>

        <div className='space-x-2 mt-4'>
          <Button>
            Buat Postingan
          </Button>
          <Button variant='outline' onClick={() => setOpenCreatePostInput(false)}>
            Gak Jadi Deh
          </Button>
        </div>

      </div>
    </div>
  )
}

export default CreatePostSection
