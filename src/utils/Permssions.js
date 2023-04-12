import {useEffect, useState} from 'react'
import {permissionsSelector} from '../redux/reducers/CommonSelectors'

export const checkPermission = (permissions, permissionId) =>
  permissions?.data?.permission_ids?.includes(permissionId) || false

export const useCheckPermission = (permissionId) => {
  const [isAllowed, setIsAllowed] = useState(false)
  const permissions = permissionsSelector()
  useEffect(() => {
    setIsAllowed(
      permissions?.data?.permission_ids?.includes(permissionId) || false
    )
  }, [permissions?.loaded])

  return isAllowed
}
