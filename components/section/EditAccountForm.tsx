import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { Textarea } from '../ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { TResponseData } from '@/lib/utils'
import { useCurrentUserStore } from '@/lib/store'

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username kependekan bre min(3)'
  }).max(100, {
    message: 'Kepanjangan bre yakali max(100)'
  }),
  name: z.string().min(3, {
    message: 'Nama lengkap lu pendek bet dah min(3)'
  }).max(100, {
    message: 'Disingkat aja deh max(100)'
  }),
  bio: z.string().max(100, {
    message: 'Batas nya cuma segitu bre max(100)'
  }).min(0),
})

type TProps = {
  openEditMenu: boolean,
  responseData: TResponseData | null,
  setProfileHasBeenEdited: (value: React.SetStateAction<boolean>) => void,
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void,
  setResponseData: (value: React.SetStateAction<TResponseData | null>) => void
}


const EditAccountForm: React.FC<TProps> = ({ openEditMenu, responseData, setResponseData, setOpenEditMenu, setProfileHasBeenEdited }) => {
  const { isLoading, mutate: editUser, error } = trpc.user.editAccount.useMutation()

  const user = useCurrentUserStore((state) => state.user)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      username: user?.username,
      bio: user?.bio || ''
    }
  })

  const activeAlert = error || responseData

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    editUser({ ...values, image: user?.image || null }, {
      onSuccess: (data) => {
        setProfileHasBeenEdited(true)
        setResponseData(data)
      }
    })
  }

  return (
    <div className={`absolute z-10 py-4 inset-x-0 top-0 h-max bg-white container transition-all ${openEditMenu ? 'translate-y-0' : '-translate-y-[200%]'}`}>
      {activeAlert && (
        <Alert className='w-full mb-2'>
          <AlertTitle>Notifikasi</AlertTitle>
          <AlertDescription>{error ? error.message.split(' ').slice(0, 5).join(' ') : responseData?.message}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Adi Cahya Saputra" type='text' autoComplete='off' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Huruf kecil semua" type='text' autoComplete='off' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Maksimal 100 karakter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col lg:flex-row items-center gap-2'>
            <Button type="submit" disabled={isLoading || responseData?.status === 200} className='w-full lg:w-max'>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tunggu Bre
                </>
              ) : "Edit Profil"}
            </Button>
            <Button type='button' onClick={() => setOpenEditMenu(false)} variant='outline' className='w-full lg:w-max'>
              {openEditMenu && responseData?.status === 200 ? 'Tutup Menu' : 'Gak Jadi'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditAccountForm
