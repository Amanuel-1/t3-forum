import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertOctagon, Forward, Send } from 'lucide-react'
import React from 'react'

type TProps = {
  id: string,
  content: string,
  createdAt: string,
  User?: {
    name: string
    username: string,
    image: string | null,
    id: string
  } | null,
  Anonymous?: {
    username: string
    id: string
  } | null
}

const CardForumDetail: React.FC<TProps> = ({ id, content, createdAt, User, Anonymous }) => {
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
    <Card>
      <CardHeader className='px-4 py-2'>

        <CardTitle className={`${Anonymous ? 'cursor-default' : 'cursor-pointer'} flex items-center gap-4`}>

          <Avatar>
            <AvatarImage src={User?.image ?? ''} alt="@shadcn" />
            <AvatarFallback>{User ? User.username[0].toUpperCase() : Anonymous ? Anonymous.username[3].toUpperCase() : 'K'}</AvatarFallback>
          </Avatar>
          <div>
            <p className='font-bold text-base'>{User ? User.name : 'Anonymous'}</p>
            <p className='text-foreground/60 text-base'>{User ? User.username : Anonymous ? Anonymous.username : 'si-eek'}</p>
          </div>

        </CardTitle>

        <CardDescription className='pt-2'>
          Dibuat {getMeta(createdAt)}
        </CardDescription>

      </CardHeader>
      <CardContent className='px-4 py-2'>
        <p>{content}</p>
      </CardContent>
      <Separator />
      <CardFooter className='p-2 space-x-2 flex w-full'>

        <form className='grow flex gap-2'>
          <Input type='text' placeholder='Komentar..' />
          <Button className='w-max'>
            <Send className='w-5 aspect-square'/>
          </Button>
        </form>

        <div className='w-max space-x-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline'>
                  <Forward className='w-5 aspect-square' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bagikan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='destructive'>
                  <AlertOctagon className='w-5 aspect-square' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lapor Pedo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </CardFooter>
    </Card>
  )
}

export default CardForumDetail
