import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {PERMISSION_CONSTANTS} from '../utils/permission.constants'
import {checkPermission} from '../utils/Permssions'

const useRoleFilter = () => {
  const [hasRoles, setHasRoles] = useState(null)

  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  useEffect(() => {
    const hasRoles = checkPermission(
      userRolePermission,
      PERMISSION_CONSTANTS.adminLeaveController_getUserList_read
    )

    setHasRoles(hasRoles)
  }, [userRolePermission])
  return [hasRoles]
}

export default useRoleFilter
