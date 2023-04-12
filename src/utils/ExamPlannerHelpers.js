import {DateTime} from 'luxon'
import {EXAM_TYPES, TIME_FORMAT} from './ExamPlannerConstants'
export const createTableStructure = (examDetails, examSelectedClasses) => {
  let tableStructure = []
  let globalTimeslotsTemp = []
  let startDate = DateTime.fromSeconds(Number(examDetails?.starts_on))
  let endDate = DateTime.fromSeconds(Number(examDetails?.ends_on))

  while (startDate <= endDate) {
    const cols = []
    examSelectedClasses?.forEach(({_id, name}) => {
      const subjects = []

      examDetails?.subject_details?.forEach((item) => {
        if (item?.date === startDate.toSeconds() && item?.standard_id === _id) {
          // Create global timeslot table if not holiday
          if (item?.status !== 2) {
            let timeslotIndex = globalTimeslotsTemp.findIndex(
              ({startTime, endTime}) => {
                const tsst = DateTime.fromSeconds(Number(startTime))
                const tset = DateTime.fromSeconds(Number(endTime))
                const ist = DateTime.fromSeconds(Number(item?.start_time))
                const iet = DateTime.fromSeconds(Number(item?.end_time))

                return (
                  tsst.hour === ist.hour &&
                  tsst.minute === ist.minute &&
                  tset.hour === iet.hour &&
                  tset.minute === iet.minute
                )
              }
            )
            // Add Timeslot to global timeslot list if not already added
            if (timeslotIndex === -1) {
              timeslotIndex = globalTimeslotsTemp.length
              const startTimeString = DateTime.fromSeconds(
                Number(item?.start_time)
              )?.toFormat(TIME_FORMAT)
              const endTimeString = DateTime.fromSeconds(
                Number(item?.end_time)
              )?.toFormat(TIME_FORMAT)

              globalTimeslotsTemp.push({
                startTime: item?.start_time,
                endTime: item?.end_time,
                key: globalTimeslotsTemp.length,
                startTimeString,
                endTimeString,
                value: `${startTimeString} - ${endTimeString}`,
              })
            }

            // Add Subject to class date mapping
            // Add to 0th index if subject is draft
            if (item?.status === EXAM_TYPES.DRAFT)
              subjects.splice(0, 0, {...item, timeslotIndex})
            else subjects.push({...item, timeslotIndex})
          } else {
            // Add Subject to class date mapping
            subjects.push({...item})
          }
        }
      })
      cols.push({_id, name, subjects})
    })
    tableStructure.push({date: startDate, classes: cols})
    startDate = startDate.plus({day: 1})
  }

  return {tableStructure, globalTimeslotsTemp}
}

export const getAssessmentsAgainstClassId = (examDetails) => {
  const assessmentsAgainstClassId = {}

  examDetails?.subject_details?.forEach((item) => {
    if (assessmentsAgainstClassId[item?.standard_id]) {
      assessmentsAgainstClassId[item.standard_id].push(item)
    } else {
      assessmentsAgainstClassId[item?.standard_id] = [item]
    }
  })

  return assessmentsAgainstClassId
}
