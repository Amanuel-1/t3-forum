import { NextPage } from 'next'
import React, { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { trimErrMessage } from '@/lib/utils'

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username lu kependekan min(3)",
  }),
  name: z.string().max(20, {
    message: "Nama lu panjang amat bre max(20)"
  }).min(3, {
    message: "Nama lu kependekan min(3)"
  }),
  password: z.string().min(8, {
    message: "Password terlalu pendek min(8)"
  })
})

const Register: NextPage = () => {
  const router = useRouter()
  const { isLoading, mutate: register, error, data } = trpc.auth.register.useMutation()

  const activeAlert = data || error

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: ""
    }
  })

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    register(values)
  }

  useEffect(() => {
    if (data?.status && data.status === 201) {
      const timeout = setTimeout(() => {
        router.push('/login')
      }, 3000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [data, router])

  return (
    <>
      <main className='bg-background flex justify-center items-center min-h-screen flex-col selection:bg-foreground selection:text-background'>
        <div className='w-10/12 md:w-max'>
          {activeAlert && (
            <Alert className='w-full'>
              <AlertTitle>Notifikasi</AlertTitle>
              <AlertDescription>{error ? trimErrMessage(error.message, 4) : data?.message}</AlertDescription>
            </Alert>
          )}

          <Card className='mt-4'>

            <CardHeader>
              <CardTitle>
                <div className='flex items-center space-x-4'>
                  <h1 className='text-foreground text-2xl font-bold'>Yuk Gabung Bre</h1>
                  <p className='text-2xl'>👋</p>
                </div>
              </CardTitle>
              <CardDescription>Data lo Aman kok</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">

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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Minimal 8 Karakter" type='password' autoComplete='off' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className='w-full'>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Tunggu Bre
                      </>
                    ) : "Gabung"}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <Separator className='mb-4' />

            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/login')} className='w-full border-primary'>Udah Punya Akun?</Button>
            </CardFooter>

          </Card>
        </div>

      </main>
    </>
  )
}

export default Register
