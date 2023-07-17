import { trpc } from "@/utils/trpc"

export default function Home() {
  const hello = trpc.hello.useQuery('Adi Cahya Saputra')

  if (!hello.data) <h1>Loading...</h1>

  return (
    <h1>{hello.data}</h1>
  )
}
