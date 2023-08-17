import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import React from 'react'

type Props = {}

const CommentCard: React.FC = (props: Props) => {
  const getMeta = (createdAt: string) => {
    const formattedDate = createdAt
      .replaceAll('/', '-')
      .replaceAll('.', ':')
      .split('')

    formattedDate.splice(-3, 3)

    return formattedDate.join('')
  }

  return (
    <div className='flex gap-2'>
      <Avatar className='rounded-md'>
        <AvatarImage />
        <AvatarFallback className='rounded-md'>A</AvatarFallback>
      </Avatar>

      <Card className='grow'>
        <CardContent className='flex flex-row gap-3 space-y-0 p-2 items-start w-full'>
          <div className='w-full'>
            <div className='flex justify-between'>

              <div>
                <p className='text-sm font-bold'>Adicss</p>
                <p className='text-xs text-foreground/60'>Dibuat {getMeta(new Date(2023, 2, 12).toLocaleString('id'))}</p>
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
                      <Pencil className='w-4 aspect-square'/>
                      <p>Edit Komentar</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='space-x-3 focus:bg-destructive focus:text-white cursor-pointer'>
                      <Trash2 className='w-4 aspect-square'/>
                      <p>Hapus Komentar</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>

            <p className='mt-2'>
              Komentar Orang
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CommentCard
