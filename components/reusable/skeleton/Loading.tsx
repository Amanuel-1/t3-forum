import React, { useEffect } from 'react'

type TProps = {
  data?: any,
  children: React.ReactNode,
  skeletonFallback: React.ReactElement
}

const Loading: React.FC<TProps> = ({ data, children, skeletonFallback }) => {
  return (
    <>
      { data ? children : skeletonFallback }
    </>
  )
}

export default Loading
