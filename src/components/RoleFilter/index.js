import {useEffect, useState} from 'react'
import useRoleFilter from '../../hooks/useRoleFilter'

/**
 * @description - Conditional render on the basis of roles the user have
 * @param {Array} roles - array of roles which is going to be evaluated
 * @param {Boolean} exclude - if false it will render only if any role is found
 *                            otherwise it won't render if any role is found
 * @param {React.Component} fallback - if provided it will render this component if condition not satisfied
 */
const RoleFilter = ({exclude = false, children, fallback}) => {
  const [valid, setValid] = useState(false)

  const [hasRoles] = useRoleFilter()

  useEffect(() => {
    if (hasRoles === null) return
    if (exclude) setValid(!hasRoles)
    else setValid(hasRoles)
  }, [hasRoles])

  if (hasRoles === null) return null

  if (valid) return <>{children}</>

  return fallback ? <>{fallback}</> : null
}

export default RoleFilter
