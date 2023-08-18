import React from 'react'

type TProps = {
  data?: Array<any>,
  children: React.ReactNode,
  emptyFallback: React.ReactElement
}

const Empty: React.FC<TProps> = ({ data, children, emptyFallback }) => {
  return (
    <>
      {data?.length || 0 ? children : emptyFallback}
    </>
  )
}

export default Empty
