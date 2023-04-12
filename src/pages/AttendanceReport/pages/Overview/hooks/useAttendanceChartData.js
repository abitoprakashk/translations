import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import useInstituteAssignedStudents from '../../StudentWiseAttendance/hooks/useInstituteAssignedStudents'

const STATUS = {
  NOT_MARKED: 'NM',
  PRESENT: 'P',
  ABSENT: 'A',
}

function useAttendanceChartData() {
  const {
    todayAttendance: {isLoading, loaded, data: initData, error},
  } = useSelector((state) => state.globalData)
  const activeStudentList = useInstituteAssignedStudents()

  const [data, setdata] = useState(null)

  useLayoutEffect(() => {
    if (initData && activeStudentList?.length) {
      let tempData = {}
      Object.values(STATUS).map((key) => {
        tempData[key] = 0
      })
      if (initData?.length) {
        initData.forEach((item) => {
          tempData[item.status] = item.count
        })
        tempData[STATUS.NOT_MARKED] =
          activeStudentList?.length -
            (tempData[STATUS.ABSENT] + tempData[STATUS.PRESENT]) <
          0
            ? 0
            : activeStudentList?.length -
              (tempData[STATUS.ABSENT] + tempData[STATUS.PRESENT])
      } else {
        tempData = {
          [STATUS.ABSENT]: 0,
          [STATUS.PRESENT]: 0,
          [STATUS.NOT_MARKED]: activeStudentList?.length,
        }
      }
      // use formatting for number
      setdata({
        labels: [
          ...(tempData[STATUS.ABSENT]
            ? [new Intl.NumberFormat('en-in').format(tempData[STATUS.ABSENT])]
            : []),
          ...(tempData[STATUS.PRESENT]
            ? [new Intl.NumberFormat('en-in').format(tempData[STATUS.PRESENT])]
            : []),

          ...(tempData[STATUS.NOT_MARKED]
            ? [
                new Intl.NumberFormat('en-in').format(
                  tempData[STATUS.NOT_MARKED]
                ),
              ]
            : []),
        ],
        datasets: [
          {
            borderWidth: 2,
            hoverBorderColor: 'transparent',
            data: [
              ...(tempData[STATUS.ABSENT] ? [tempData[STATUS.ABSENT]] : []),
              ...(tempData[STATUS.PRESENT] ? [tempData[STATUS.PRESENT]] : []),
              ...(tempData[STATUS.NOT_MARKED]
                ? [tempData[STATUS.NOT_MARKED]]
                : []),
            ],
            backgroundColor: [
              ...(tempData[STATUS.ABSENT] ? ['#F19A8E'] : []),
              ...(tempData[STATUS.PRESENT] ? ['#A8D793'] : []),
              ...(tempData[STATUS.NOT_MARKED] ? ['#CCCCCC'] : []),
            ],
          },
        ],
        metaData: tempData,
      })
    }
  }, [isLoading, loaded, initData, error, activeStudentList])

  return {isLoading, loaded, data, error}
}

export default useAttendanceChartData
