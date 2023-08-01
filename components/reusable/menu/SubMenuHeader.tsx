import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'
import Loading from '../skeleton/Loading'

type TProps = {
  backUrl: string,
  title: string,
  data: string | undefined
}

const SubMenuHeader: React.FC<TProps> = ({ backUrl, title, data }) => {
  const router = useRouter()

  return (
    <div className='flex container z-10 border-b bg-white/60 backdrop-blur-md items-center sticky top-0 py-4 justify-between lg:justify-start gap-4'>
      <Button onClick={() => router.push(backUrl)} className='w-max'>
        <ChevronLeft className='w-5 aspect-square' />
      </Button>
      <div className='flex items-center gap-2'>
        <p className='text-lg'>
          {title}
        </p>
        <Loading data={data} skeletonFallback={<Skeleton className='p-2 rounded-md text-muted'>Loading</Skeleton>}>
          <code className='p-2 bg-secondary rounded-md'>{data}</code>
        </Loading>
      </div>
    </div>
  )
}

export default SubMenuHeader
