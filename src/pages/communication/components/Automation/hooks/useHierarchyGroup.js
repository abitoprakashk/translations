import {t} from 'i18next'
import {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {UNASSIGNED_USERS} from '../Automation.constants'
import {getHierarchyGroups, getReceiversList} from '../utils'

/**
 * Used to group receivers - from class hierarchy, selected custom class and unassigned users
 */
const useHierarchyGroup = ({ruleData, instHierarchy}) => {
  const customClasses = useSelector(
    (state) => state.communicationInfo.common?.uncategorisedClassesData
  )

  const filter = ruleData?.filter || {}

  const groups = useMemo(() => {
    const recipients = new Set(filter.recipient_node_ids || [])
    const groups = getHierarchyGroups(instHierarchy, recipients, customClasses)

    if (ruleData.filter?.include_unassigned) {
      groups[UNASSIGNED_USERS] = t('unassigned')
    }

    return groups
  }, [filter, instHierarchy, customClasses])

  return {
    groups,
    groupNames: getReceiversList(ruleData, groups),
    customClasses,
  }
}

export default useHierarchyGroup
