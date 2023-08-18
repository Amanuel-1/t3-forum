import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import React from 'react'

type TProps = {
  id: number,
  text: string,
  createdAt: string,
  User: {
    username: string,
    image: string | null
  }
}

const CommentCard: React.FC<TProps> = ({ id, text, createdAt, User }) => {
  const getMeta = (createdAt: string) => {
    const formattedDate = new Date(createdAt)
      .toLocaleString('id')
      .replaceAll('/', '-')
      .replaceAll('.', ':')
      .split('')

    formattedDate.splice(-3, 3)

    return formattedDate.join('')
  }

  return (
    <li className='flex gap-2'>
      <Avatar className='rounded-md'>
        <AvatarImage src={User.image ?? ''} />
        <AvatarFallback className='rounded-md'>PP</AvatarFallback>
      </Avatar>

      <Card className='grow'>
        <CardContent className='flex flex-row gap-3 space-y-0 p-2 items-start w-full'>
          <div className='w-full'>
            <div className='flex justify-between'>

              <div>
                <p className='text-sm font-bold'>{User.username}</p>
                <p className='text-xs text-foreground/60'>Dibuat {getMeta(createdAt)}</p>
              </div>

              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className='scale-75' variant='outline'>
                      <MoreHorizontal className='w-5 aspect-square' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56' side='left' sideOffset={4}>
                    <DropdownMenuItem className='space-x-3 cursor-pointer'>
                      <Pencil className='w-4 aspect-square' />
                      <p>Edit Komentar</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='space-x-3 focus:bg-destructive focus:text-white cursor-pointer'>
                      <Trash2 className='w-4 aspect-square' />
                      <p>Hapus Komentar</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>

            <p className='mt-2'>
              {text}
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}

export default CommentCard
