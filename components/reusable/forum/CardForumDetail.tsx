import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TUser } from '@/lib/utils'
import { trpc } from '@/utils/trpc'
import { AlertOctagon, Forward, Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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
  currentUser: TUser,
  setNewCommentInserted: (value: React.SetStateAction<boolean>) => void
}

const CardForumDetail: React.FC<TProps> = ({ id, content, createdAt, User, Anonymous, currentUser, setNewCommentInserted }) => {
  const router = useRouter()

  const [comment, setComment] = useState('')
  const [response, setResponse] = useState({})

  const { mutate: insertNewComment, isLoading } = trpc.comment.store.useMutation()

  const getMeta = (createdAt: string) => {
    const formattedDate = new Date(createdAt)
      .toLocaleString('id')
      .replaceAll('/', '-')
      .replaceAll('.', ':')
      .split('')

    formattedDate.splice(-3, 3)

    return formattedDate.join('')
  }

  useEffect(() => {
    console.log(response)
  }, [response])

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    insertNewComment({
      postId: id,
      userId: currentUser.id,
      commentText: comment
    }, {
      onSuccess: data => {
        setComment('')
        setResponse(data)
        setNewCommentInserted(true)
      }
    })
  }

  return (
    <Card>
      <CardHeader className='px-4 py-2' onClick={() => router.push('/profil/' + User?.username)}>

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
      <CardFooter className='p-2 gap-2 flex flex-col lg:flex-row items-start w-full'>

        <div className='w-full flex lg:w-max space-x-2 lg:order-2'>
          <div className='w-1/2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' className='w-full space-x-2 lg:space-x-0'>
                    <Forward className='w-5 aspect-square' />
                    <p className='lg:hidden'>Bagikan</p>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bagikan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className='w-1/2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='destructive' className='w-full space-x-2 lg:space-x-0'>
                    <AlertOctagon className='w-5 aspect-square' />
                    <p className='lg:hidden'>Lapor Pedo</p>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lapor Pedo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <form onSubmit={submitHandler} className='flex gap-2 w-full lg:w-max lg:grow lg:order-1'>
          <Input type='text' placeholder='Komentar..' onChange={e => setComment(e.target.value)} required value={comment} />
          <Button type='submit' className='w-max' disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className='w-5 aspect-square' />
            )}
          </Button>
        </form>

      </CardFooter>
    </Card>
  )
}

export default CardForumDetail
