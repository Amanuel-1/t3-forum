import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { Textarea } from '@/components/ui/textarea'
import { TResponseData } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  content: z.string().min(3).max(255),
  isAnonymPost: z.number(),
  userId: z.string(),
  postId: z.string(),
})

type TProps = {
  userId: string,
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      isAnonymPost: 0,
      userId: '',
      postId: ''
    },
  })

  useEffect(() => {
    setAnonymousMode(isAnonymous)

    if (postId) {
      form.setValue('content', content)
      form.setValue('isAnonymPost', +isAnonymous)
      form.setValue('userId', userId)
      form.setValue('postId', postId)
    }

  }, [postId])

  const { isLoading, error, mutate: editPost } = trpc.post.edit.useMutation()

  const activeAlert = error || responseData

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    editPost({
      ...values,
      isAnonymPost: !!values.isAnonymPost
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
              {error ? error.message.split(' ').slice(0, 5).join(' ') : responseData?.message}
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={() => setAnonymousMode(!anonymousMode)} className='w-full lg:w-max' variant='outline'>
          Ubah Jadi <span className={`ml-2 font-bold ${anonymousMode ? 'text-black' : 'text-red-600'}`}>{anonymousMode ? 'Public' : 'Anonymous'} Post</span>
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
            <FormField
              control={form.control}
              name="isAnonymPost"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='hidden' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='hidden' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='hidden' {...field} />
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
                Gak Jadi
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditPostForm
