import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TSelectedPost } from '@/lib/utils'
import { PenBox, Trash2 } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'

type TProps = {
  id: string,
  content: string,
  createdAt: string,
  User?: {
    name: string
    username: string
    id: string
  } | null,
  Anonymous?: {
    username: string
    id: string
  } | null,
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void,
  setSelectedPost: (value: React.SetStateAction<TSelectedPost | null>) => void
}

const CardForum: React.FC<TProps> = ({ id, content, User, createdAt, Anonymous, setOpenEditMenu, setSelectedPost }) => {

  const router = useRouter()
  const deletePostHandler = () => {
    console.log('delete ' + id)
  }

  return (
    <Card>
      <CardHeader className='px-4 py-2'>

        <CardTitle onClick={() => {
          if (!Anonymous) router.push('/profil/' + User?.username)
        }} className={`${Anonymous ? 'cursor-default' : 'cursor-pointer'} flex items-center gap-4`}>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className='font-bold text-base'>{User ? User.name : 'Anonymous'}</p>
            <p className='text-foreground/60 text-base'>{User ? User.username : Anonymous ? Anonymous.username : 'si-eek'}</p>
          </div>

        </CardTitle>

      </CardHeader>
      <CardContent className='px-4 py-2'>
        <p>{content}</p>
      </CardContent>
      <Separator />
      <CardFooter className='p-2 space-x-2'>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' onClick={() => {
                setOpenEditMenu(true)
                setSelectedPost({
                  id, content, userId: User?.id!
                })
              }}>
                <PenBox className='w-5 aspect-square' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>


        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <Trash2 className='w-5 aspect-square' />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Postingan ?</AlertDialogTitle>
              <AlertDialogDescription>
                Kalo dah ke hapus g bisa di back up lagi bre
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Gk Jadi</AlertDialogCancel>
              <AlertDialogAction onClick={deletePostHandler}>Yaudh Sih</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

        </AlertDialog>

      </CardFooter>
    </Card>
  )
}

export default CardForum
