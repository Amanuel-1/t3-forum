import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpc } from '@/utils/trpc'
import { Loader2, MoreHorizontal, Pencil, Send, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

type TProps = {
  id: number,
  text: string,
  createdAt: string,
  User: {
    username: string,
    image: string | null
  },
  setCommentHasBeenEdited: (value: React.SetStateAction<boolean>) => void,
  setCommentHasBeenDeleted: (value: React.SetStateAction<boolean>) => void
}

type TPropsEditForm = {
  commentId: number,
  commentText: string,
  setEditMode: (value: React.SetStateAction<boolean>) => void,
  setCommentHasBeenEdited: (value: React.SetStateAction<boolean>) => void,
}

const EditForm: React.FC<TPropsEditForm> = ({ commentId, commentText, setEditMode, setCommentHasBeenEdited }) => {
  const { mutate: editComment, isLoading } = trpc.comment.edit.useMutation()
  const [comment, setComment] = useState(commentText)

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    editComment({
      commentId,
      commentText: comment
    }, {
      onSuccess: () => {
        setCommentHasBeenEdited(true)
        setEditMode(false)
      }
    })
  }

  return (
    <form onSubmit={submitHandler} className='flex w-full items-center gap-2 mt-2'>
      <Input type='text' placeholder='Komentar' className='py-1 px-2 h-8' value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className='flex gap-1'>
        <Button type='submit' className='w-max h-8' disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className='w-4 aspect-square' />
          )}
        </Button>
        <Button type='button' variant='destructive' className='w-max h-8' onClick={() => setEditMode(false)}>
          <X className='w-4 aspect-square' />
        </Button>
      </div>
    </form>
  )
}

const CommentCard: React.FC<TProps> = ({ id, text, createdAt, User, setCommentHasBeenEdited, setCommentHasBeenDeleted }) => {
  const [editMode, setEditMode] = useState(false)
  const { mutate: deleteComment } = trpc.comment.delete.useMutation()

  const getMeta = (createdAt: string) => {
    const formattedDate = new Date(createdAt)
      .toLocaleString('id')
      .replaceAll('/', '-')
      .replaceAll('.', ':')
      .split('')

    formattedDate.splice(-3, 3)

    return formattedDate.join('')
  }

  const deleteHandler = () => {
    deleteComment(id, {
      onSuccess: () => {
        setCommentHasBeenDeleted(true)
      }
    })
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
                    <DropdownMenuItem onClick={() => setEditMode(true)} className='space-x-3 cursor-pointer'>
                      <Pencil className='w-4 aspect-square' />
                      <p>Edit Komentar</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={deleteHandler} className='space-x-3 focus:bg-destructive focus:text-white cursor-pointer'>
                      <Trash2 className='w-4 aspect-square' />
                      <p>Hapus Komentar</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>

            {
              editMode
                ? (<EditForm commentText={text} commentId={id} setEditMode={setEditMode} setCommentHasBeenEdited={setCommentHasBeenEdited} />)
                : (<p className='mt-2 grow'> {text} </p>)
            }
          </div>
        </CardContent>
      </Card>
    </li>
  )
}

export default CommentCard
