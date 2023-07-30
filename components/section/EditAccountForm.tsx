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
  user: {
    id: string,
    username: string,
    name: string,
    bio: string | null,
    image: string | null
  },
  openEditMenu: boolean,
  setProfileHasBeenEdited: (value: React.SetStateAction<boolean>) => void,
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void
}

const EditAccountForm: React.FC<TProps> = ({ user, openEditMenu, setOpenEditMenu, setProfileHasBeenEdited }) => {
  const { isLoading, mutate: editUser, error, data } = trpc.user.editAccount.useMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio || ''
    }
  })

  const activeAlert = error || data

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    editUser({ ...values, image: null }, {
      onSuccess: (data) => {
        setProfileHasBeenEdited(true)
      }
    })
  }

  return (
    <div className={`absolute z-10 py-4 inset-x-0 top-0 h-max bg-white container transition-all ${openEditMenu ? 'translate-y-0' : '-translate-y-[200%]'}`}>
      {activeAlert && (
        <Alert className='w-full mb-2'>
          <AlertTitle>Notifikasi</AlertTitle>
          <AlertDescription>{error ? error.message.split(' ').slice(0, 5).join(' ') : data?.message}</AlertDescription>
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
            <Button type="submit" disabled={isLoading || data?.status === 200} className='w-full lg:w-max'>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tunggu Bre
                </>
              ) : "Edit Profil"}
            </Button>
            <Button onClick={() => setOpenEditMenu(false)} variant='outline' className='w-full lg:w-max'>
              Gak Jadi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditAccountForm
