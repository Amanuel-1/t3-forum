import { Loader2 } from 'lucide-react'
import React from 'react'

type TProps = {
  isRefetching: boolean
}

const RefetchData: React.FC<TProps> = ({ isRefetching }) => {
  return (
    <div className={`transition-all z-30 ${isRefetching ? 'translate-y-0' : '-translate-y-[200%]'} fixed inset-x-4 p-4 top-4 flex items-center gap-2 bg-secondary border rounded-md text-foreground`}>
      <Loader2 className='aspect-square w-4 animate-spin' />
      <p>Update data bentar bre</p>
    </div>
  )
}

export default RefetchData
