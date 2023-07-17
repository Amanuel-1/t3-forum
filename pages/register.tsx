import { NextPage } from 'next'
import React, { useState } from 'react'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const formSchema = z.object({
  email: z.string().email({
    message: "Email harus Valid bre",
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
      email: "",
      password: ""
    }
  })

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    register(values)
  }

  return (
    <>
      <main className='bg-background flex justify-center items-center min-h-screen flex-col selection:bg-foreground selection:text-background'>
        {activeAlert && (
          <Alert className='w-10/12 lg:w-max'>
            <AlertTitle>Notifikasi</AlertTitle>
            <AlertDescription>{error ? error.message : data}</AlertDescription>
          </Alert>
        )}

        <Card className='mt-4 w-10/12 md:w-max'>

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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="*@gmail.com" type='email' autoComplete='off' {...field} />
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
            <Button variant="outline" onClick={() => router.push('/login')} className='w-full'>Udah Punya Akun?</Button>
          </CardFooter>

        </Card>

      </main>
    </>
  )
}

export default Register
