import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Check, Loader2, Trash } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { useReportPost } from '@/lib/hooks'
import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { trpc } from '@/utils/trpc'

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
  } | null,
  setPostHasNotBeenReported: (value: React.SetStateAction<boolean>) => void
}

const ReportedPostCard: React.FC<TProps> = ({ id, content, createdAt, User, Anonymous, setPostHasNotBeenReported }) => {
  const router = useRouter()
  const { toast } = useToast()
  const toastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const { postIsSafety, safetyPostLoading, postHasNotBeenReported } = useReportPost()
  const { mutate: deletePost } = trpc.post.delete.useMutation()

  const getMeta = (createdAt: string) => {
    const formattedDate = new Date(createdAt)
      .toLocaleString('id')
      .replaceAll('/', '-')
      .replaceAll('.', ':')
      .split('')

    formattedDate.splice(-3, 3)

    return formattedDate.join('')
  }

  const deletePostHandler = () => {
    deletePost(id, {
      onSuccess: (data) => {
        console.log(data)
        setPostHasNotBeenReported(true)
      }
    })
  }

  useEffect(() => {
    if(postHasNotBeenReported && toastTriggerRef.current) {
      toastTriggerRef.current.click()
      setPostHasNotBeenReported(true)
    }
  }, [postHasNotBeenReported, toastTriggerRef])

  return (
    <Card>
      <CardHeader className='px-4 py-2'>

        <Button ref={toastTriggerRef} className='hidden' onClick={() => toast({
          title: 'Notifikasi',
          description: 'Ok berarti aman yah bre'
        })}>{''}</Button>

        <CardTitle onClick={() => {
          if (!Anonymous) router.push('/profil/' + User?.username)
        }} className={`${Anonymous ? 'cursor-default' : 'cursor-pointer'} flex items-center gap-4`}>

          <Avatar>
            <AvatarImage src={User?.image ?? ''} alt="@shadcn"/>
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
      <CardFooter className='p-2 gap-2 flex'>

        <Button disabled={safetyPostLoading} variant='default' onClick={() => postIsSafety(id)} className='space-x-2 grow md:grow-0'>
          {
            safetyPostLoading 
            ? (<Loader2 className='w-5 aspect-square animate-spin'/>)
            : (<Check className='w-5 aspect-square' />)
          }
          <p>Aman Post Ini mah</p>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' className='space-x-2 grow md:grow-0'>
              <Trash className='w-5 aspect-square' />
              <p>Takedown Postingan</p>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Takedown Postingan ?</AlertDialogTitle>
              <AlertDialogDescription>
                Kalo dah ke takedown g bisa di back up lagi bre
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

export default ReportedPostCard