import {useState, useEffect} from 'react'

export function useGetUser(memberId, userList) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (memberId) {
      setUser(userList.find((item) => item._id === memberId))
    }
  }, [memberId])

  return user
}
