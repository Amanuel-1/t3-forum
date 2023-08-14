import { useEffect } from "react"
import { useCurrentUserStore } from "./store"
import { trpc } from "@/utils/trpc"

type TUser = {
  id: string,
  name: string,
  username: string,
  image: string | null,
  bio: string | null,
}

export const useUser = (user: TUser) => {
  const { user: currentUser, setUser } = useCurrentUserStore(state => state)
  const { data: userResponse } = trpc.user.profile.useQuery({
    id: user.id,
    username: user.username
  })

  useEffect(() => {
    if(userResponse?.data) {
      setUser(userResponse.data)
    }
  }, [userResponse])

  return {
    user: currentUser ?? user,
    setUser
  }
}
