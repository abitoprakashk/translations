import {ALERT_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import {DateTime} from 'luxon'

/**
 * To get selected nodes as groups
 * Example groups: (Primary, Secondary, Class 12 ...)
 * */
export const getHierarchyGroups = (hierarchy, selectedSections) => {
  const groups = {}
  const CHILDREN_KEYS = ['department', 'standard', 'section']
  if (!selectedSections?.size) {
    return groups
  }

  const processNode = (node) => {
    if (node && selectedSections.has(node.id)) {
      groups[node.id] = node.name
      return true
    }

    if (node) {
      const childrenKey = CHILDREN_KEYS.find((key) => Array.isArray(node[key]))
      if (childrenKey) {
        let allSelected = true
        node[childrenKey].forEach((child) => {
          allSelected = processNode(child) && allSelected
        })

        if (allSelected) {
          node[childrenKey].forEach((child) => {
            delete groups[child.id]
          })

          groups[node.id] = node.name
          return true
        }
      }
    }

    return false
  }

  hierarchy?.department.forEach(processNode)

  return groups
}

export const getDueDates = (feeStructure) => {
  const {schedule_timestamps} = feeStructure

  if (!schedule_timestamps?.length) {
    return null
  }

  const numDueDates = schedule_timestamps.length

  return numDueDates > 1
    ? t('dueDatesCount', {count: numDueDates})
    : formatDate(schedule_timestamps[0])
}

export const validateFeeImport = (
  feeStructures,
  feeValidation,
  session,
  showImportWarning = true
) => {
  if (!feeStructures.length) {
    return null
  }

  if (feeValidation.dependency) {
    return {
      type: ALERT_CONSTANTS.TYPE.ERROR,
      message: getFeeStructureErrorMessage(feeValidation.dependency_stats),
    }
  }
  const [sessionStartTime, sessionEndTime] = getSessionStartAndEndTime(session)

  const allMinAndMaxDueDates = feeStructures.map((structure) =>
    getMinAndMaxTimeStamps(structure.schedule_timestamps)
  )

  for (const [minDueDate, maxDueDate] of allMinAndMaxDueDates) {
    if (!isWithinBounds(sessionStartTime, sessionEndTime, minDueDate)) {
      return {
        type: ALERT_CONSTANTS.TYPE.ERROR,
        message: t('importRestrictWhenSessionStartDateGreaterThanMinDueDate', {
          date: formatDate(minDueDate),
        }),
        showEditSession: true,
      }
    }
    if (!isWithinBounds(sessionStartTime, sessionEndTime, maxDueDate)) {
      return {
        type: ALERT_CONSTANTS.TYPE.ERROR,
        message: t('importRestrictWhenSessionEndDateLesserThanMaxDueDate', {
          date: formatDate(maxDueDate),
        }),
        showEditSession: true,
      }
    }
  }

  if (showImportWarning) {
    return {
      type: ALERT_CONSTANTS.TYPE.WARNING,
      message: t('importWarningIfConfigExists'),
    }
  }

  return null
}

const getFeeStructureErrorMessage = (feeStats) => {
  if (feeStats.paid) {
    return t('importRestrictForFeeCollected')
  }

  if (feeStats.fine) {
    return t('importRestrictForFineCollected')
  }
  return feeStats.discount ? t('importRestrictForDiscountApplied') : null
}

const getMinAndMaxTimeStamps = (timeStamps) => {
  let minTimeStamp = timeStamps[0]
  let maxTimeStamp = timeStamps[0]

  for (let i = 0; i < timeStamps.length; i++) {
    minTimeStamp = Math.min(minTimeStamp, timeStamps[i])
    maxTimeStamp = Math.max(maxTimeStamp, timeStamps[i])
  }

  return [minTimeStamp, maxTimeStamp]
}

export const formatDate = (timeStamp) =>
  DateTime.fromSeconds(timeStamp).toFormat('DD')

const isWithinBounds = (start, end, value) => {
  return value >= start && value <= end
}

const getSessionStartAndEndTime = (session) => [
  session.start_time / 1000,
  session.end_time / 1000,
]
