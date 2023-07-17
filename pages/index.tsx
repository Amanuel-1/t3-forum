import { trpc } from "@/utils/trpc"

export default function Home() {
  const hello = trpc.hello.useQuery('Adi Cahya Saputra')

  // const isBerhasil = trpc.auth.register.useQuery({
  //   name: 'Adi Cahya Saputra',
  //   email: 'adics@gmail.com',
  //   password: 'hehe1234'
  // })
  //
  // if (!hello.data) <h1>Loading...</h1>
  // if (!isBerhasil.data) <h1>Loading...</h1>

  return (
    <>
      <h1>{hello.data}</h1>
    </>
  )
}
