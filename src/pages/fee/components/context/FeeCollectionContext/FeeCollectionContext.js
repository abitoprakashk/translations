import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getFeeStatistics} from '../../../../../redux/actions/instituteInfoActions'
import {SECTION_WISE_FILTER} from '../../../fees.constants'
import {
  fetchFeeStatsRequestedAction,
  studentDuesRequestedAction,
} from '../../../redux/feeCollectionActions'
import feeCollectionActionTypes from '../../../redux/feeCollectionActionTypes'
import {
  useFeeCollection,
  useSliderScreen,
} from '../../../redux/feeCollectionSelectors'

const FeeCollectionContext = createContext()

export const useFeeCollectionContext = () => useContext(FeeCollectionContext)

export function FeeCollectionProvider({children}) {
  const dispatch = useDispatch()

  const {studentDues, recordPaymentDetails, submitFees} = useFeeCollection()
  const {sliderScreen, sliderData} = useSliderScreen()

  const studentsList = useSelector((state) => state.instituteStudentList)
  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)
  const isMobile = useSelector((state) => state.isMobile)
  const feeStatistics = useSelector((state) => state.feeStatistics)

  const [isSearchFieldClicked, setIsSearchFieldClicked] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [isShowClasses, setIsShowClasses] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [classId, setClassId] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false)
  const [studentListObj, setStudentListObj] = useState({})
  const [studentsData, setStudentsData] = useState([])
  const [sectionStats, setSectionStats] = useState({})
  const [studentsDataLoder, setStudentsDataLoder] = useState(false)
  const [selectedFilter, setSelectedFilters] = useState(
    SECTION_WISE_FILTER.all.value
  )

  const eventManager = useSelector((state) => state.eventManager)
  const sendClickEvent = (eventName, dataObj = {}) => {
    return eventManager.send_event(eventName, {...dataObj})
  }

  const handleCollectFeeClick = (studentId) => {
    setSelectedStudentId(studentId)
    setShowCollectFeeModal(true)
  }

  let sections = useMemo(() => {
    let temp = []
    instituteHierarchy?.children?.map((department) => {
      department?.children?.map((classname) => {
        classname?.children?.map((section) => {
          if (section?.type == 'SECTION') {
            temp.push({
              name: classname.name + '-' + section.name,
              id: section.id,
              class_id: classname.id,
            })
          }
        })
      })
    })
    return temp
  }, [instituteHierarchy])

  useEffect(() => {
    dispatch(getFeeStatistics())
    dispatch(fetchFeeStatsRequestedAction())
  }, [])

  const handleGetStudentDueRequest = () => {
    if (selectedSection) {
      setStudentsDataLoder(true)
      dispatch(studentDuesRequestedAction([selectedSection], null, 'ALL'))
    }
  }

  useEffect(() => {
    handleGetStudentDueRequest()
  }, [selectedSection])

  useEffect(() => {
    if (isShowClasses === true) {
      setIsSearchFieldClicked(true)
      if (!selectedSection) {
        if (!isMobile) {
          setSelectedSection(sections[0].id)
        }
        setClassId(sections[0].class_id)
      }
    }
  }, [isShowClasses])

  useEffect(() => {
    if (studentsList?.length > 0) {
      let studObj = studentsList.reduce((acc, curr) => {
        return {...acc, [curr._id]: curr}
      }, {})

      setStudentListObj(studObj)
    }
  }, [studentsList])

  useEffect(() => {
    if (studentListObj) {
      const studData = studentDues.students.map((dues) => {
        const student = studentListObj[dues.Id]
        let classSection = ['NA', '']
        if (student?.classroom) {
          classSection = student?.classroom?.split('-')
        }
        dues = {
          ...dues,
          class: classSection[0],
          name: student?.full_name,
          phoneNumber: student?.phone_number,
          email: student?.email,
          section: classSection[1],
          selectedSliderTab: 'FEE_HISTORY',
          pic_url: student?.img_url ?? '',
          fatherName: student?.father_name ?? '',
          fatherContactNumber: student?.father_contact_number ?? '',
          motherName: student?.mother_name ?? '',
          motherContactNumber: student?.mother_contact_number ?? '',
        }
        return dues
      })

      setStudentsData(studData)
    }
    setSectionStats({
      total_discount: studentDues.total_discount,
      total_due: studentDues.total_due,
      total_paid: studentDues.total_paid,
      total_payable: studentDues.total_payable,
      total_pending: studentDues.total_pending,
    })
    setStudentsDataLoder(false)
  }, [studentDues, studentListObj])

  const setSliderScreen = (screen) => {
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: screen,
    })
  }

  return (
    <FeeCollectionContext.Provider
      value={{
        isSearchFieldClicked,
        setIsSearchFieldClicked,
        searchValue,
        setSearchValue,
        isShowClasses,
        setIsShowClasses,
        selectedSection,
        setSelectedSection,
        selectedFilter,
        setSelectedFilters,
        classId,
        setClassId,
        selectedStudentId,
        setSelectedStudentId,
        studentListObj,
        studentsData,
        sectionStats,
        handleCollectFeeClick,
        setSliderScreen,
        sections,
        isMobile,
        sliderScreen,
        sliderData,
        showCollectFeeModal,
        setShowCollectFeeModal,
        recordPaymentDetails,
        submitFees,
        feeStatistics,
        sendClickEvent,
        studentsDataLoder,
        handleGetStudentDueRequest,
      }}
    >
      {children}
    </FeeCollectionContext.Provider>
  )
}
