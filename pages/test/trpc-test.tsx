import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { trpc } from '@/utils/trpc'

const TRPCTest: NextPage = () => {

  const user = trpc.user.profile.useQuery({ username: 'adicss' })

  useEffect(() => {
    console.log('Hello')
  }, [])

  return (
    <div>Hello TRPC</div>
  )
}

export default TRPCTest
