import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { trpc } from '@/utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Head from 'next/head'
import { trimErrMessage } from '@/lib/utils'

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username lu kependekan min(3)"
  }).trim().toLowerCase(),
  password: z.string().min(8, {
    message: "Password lu kependekan bre min(8)"
  })
})

const Login: NextPage = () => {
  const router = useRouter()
  const { isLoading, mutate: login, error, data: response } = trpc.auth.login.useMutation()

  const activeAlert = response || error

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    login(values, {
      onSuccess: async ({ data, status }) => {
        if (status === 200) {
          const token = data?.token
          const setAuthToken = await fetch('/api/cookie/set', {
            method: 'POST',
            body: JSON.stringify({ token })
          })

          if (!setAuthToken.ok) return

          router.push('/forum')
        }
      }
    })

    form.reset()
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className='bg-background flex justify-center items-center min-h-screen flex-col selection:bg-foreground selection:text-background'>
        <div className='w-10/12 md:w-max'>
          {activeAlert && (
            <Alert className='w-full'>
              <AlertTitle className='tracking-wide'>Notifikasi</AlertTitle>
              <AlertDescription>{error ? trimErrMessage(error.message, 4) : response?.message}</AlertDescription>
            </Alert>
          )}

          <Card className='mt-4'>

            <CardHeader>
              <CardTitle>
                <div className='flex items-center space-x-2'>
                  <h1 className='text-foreground text-2xl font-bold'>Mulai Berdiskusi</h1>
                  <p className='text-2xl'>😋</p>
                </div>
              </CardTitle>
              <CardDescription>Aplikasi ini masih BETA btw</CardDescription>
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
                    ) : "Masuk"}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <Separator className='mb-4' />

            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/register')} className='w-full border-primary'>Belum Punya Akun?</Button>
            </CardFooter>

          </Card>
        </div>

      </main >

    </>
  )
}

export default Login
