import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { Textarea } from '@/components/ui/textarea'
import { TResponseData, trimErrMessage } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const formSchema = z.object({
  content: z.string().min(3).max(255),
})

type TProps = {
  userId: string | null,
  postId: string,
  content: string,
  isAnonymous: boolean,
  openEditMenu: boolean,
  responseData: TResponseData | null,
  setPostHasBeenEdited: (value: React.SetStateAction<boolean>) => void,
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void,
  setResponseData: (value: React.SetStateAction<TResponseData | null>) => void
}


const EditPostForm: React.FC<TProps> = ({ userId, postId, content, isAnonymous, openEditMenu, responseData, setResponseData, setOpenEditMenu, setPostHasBeenEdited }) => {

  const [anonymousMode, setAnonymousMode] = useState(isAnonymous)

  const [currentUserId, setCurrentUserId] = useState(userId)
  const [currentPostId, setCurrentPostId] = useState(postId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  useEffect(() => {
    setAnonymousMode(isAnonymous)

    if (postId) {
      form.setValue('content', content)

      setCurrentUserId(userId)
      setCurrentPostId(postId)
    }

  }, [postId])

  const { isLoading, error, mutate: editPost } = trpc.post.edit.useMutation()

  const activeAlert = error || responseData

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    // console.log({
    //   ...values,
    //   userId: currentUserId,
    //   postId: currentPostId,
    //   isAnonymPost: anonymousMode
    // })

    editPost({
      ...values,
      userId: currentUserId,
      postId: currentPostId,
      isAnonymPost: anonymousMode
    }, {
      onSuccess: (data) => {
        setPostHasBeenEdited(true)
        setResponseData(data)
      }
    })
  }

  return (
    <div className={`fixed z-30 py-4 w-full lg:w-96 lg:rounded-md right-0 lg:right-4 top-0 lg:top-4 border bg-white container transition-all ${openEditMenu ? 'translate-y-0' : '-translate-y-[200%]'}`}>
      <div className='contianer'>
        {activeAlert && (
          <Alert className='mb-4'>
            <AlertTitle>Notfikasi</AlertTitle>
            <AlertDescription>
              {error ? trimErrMessage(error.message, 4) : responseData?.message}
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={() => setAnonymousMode(!anonymousMode)} className='w-full lg:w-max space-x-2' variant='outline'>
          <ArrowLeftRight className='w-4 aspect-square' />
          <span className={`ml-1 font-bold ${anonymousMode ? 'text-red-600' : 'text-black'}`}>{anonymousMode ? 'Anonymous' : 'Public'} Post</span>
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Maksimal 100 karakter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col lg:flex-row items-center gap-2'>
              <Button type="submit" disabled={isLoading || responseData?.status === 201} className='w-full lg:w-max'>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tunggu Bre
                  </>
                ) : "Edit Post"}
              </Button>
              <Button type='button' onClick={() => setOpenEditMenu(false)} variant='outline' className='w-full lg:w-max'>
                {openEditMenu && responseData?.status === 201 ? 'Tutup Menu' : 'Gak Jadi'}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditPostForm
