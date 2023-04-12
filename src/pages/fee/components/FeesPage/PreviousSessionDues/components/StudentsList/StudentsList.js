import React, {useState} from 'react'
import styles from './StudentsList.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {Table, EmptyState} from '@teachmint/krayon'
import DeleteConfirmationPopup from './components/DeleteConfirmationPopup/DeleteConfirmationPopup'
import StatsContainer from './components/StatsContainer/StatsContainer'
import HeaderSection from './components/HeaderSection/HeaderSection'
import {
  StudentDetails,
  StudentDueAmount,
  StudentActions,
} from './components/TableRow/TableRow'
import feeCollectionActionTypes from '../../../../../redux/feeCollectionActionTypes'
import {SliderScreens} from '../../../../../fees.constants'
import feeStructureActionTypes from '../../../../../redux/feeStructure/feeStructureActionTypes'
import {useFeeStructure} from '../../../../../redux/feeStructure/feeStructureSelectors'
import {events} from '../../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

export default function StudentsList({
  previousSessionDue,
  setIsImportModalCSVOpen,
  setCSVModalType,
  onDeleteDependancy,
  onDeleteSuccess,
  onDeleteFailed,
}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {deletingFeeStructure} = useFeeStructure()
  const {instituteStudentList, eventManager} = useSelector((state) => state)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [studentToDelete, setStudentToDelete] = useState({})

  const getStudentDetails = (studentId) => {
    return instituteStudentList
      ? instituteStudentList.find((student) => student._id === studentId)
      : null
  }

  const handleOnDelete = () => {
    dispatch({
      type: feeStructureActionTypes.DELETE_STUDENT_PREVIOUS_SESSION_DUES,
      payload: {
        structure_id: previousSessionDue._id,
        categories:
          previousSessionDue.students[studentToDelete.index]['timestamps'][0]
            .categories,
        student_id: studentToDelete.student_id,
        onSuccess: onSuccess,
      },
    })
  }

  const onSuccess = () => {
    setIsDeletePopupOpen(false)
  }

  const handleDeletePreviousSessionDues = () => {
    eventManager.send_event(
      events.FEE_PREVIOUS_SESSION_DUES_FOR_ALL_STUDENTS_DELETE_CLICKED_TFI
    )
    dispatch({
      type: feeStructureActionTypes.DELETE_FEE_STRUCTURE_REQUESTED,
      payload: {
        _id: previousSessionDue._id,
        isPreviousSessionDue: true,
        onDeleteSuccess,
        onDeleteFailed,
        onDeleteDependancy,
      },
    })
  }

  const handleModifySingleRecord = (rowData) => {
    eventManager.send_event(events.FEE_PREVIOUS_SESSION_DUES_MODIFY_CLICKED_TFI)
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: {
        name: SliderScreens.PREVIOUS_YEAR_DUE_MODIFY_SLIDER,
        data: {
          name: rowData.student_name,
          ...rowData.student,
        },
      },
    })
  }

  const handleDeleteSingleRecord = (rowData, index) => {
    eventManager.send_event(events.FEE_PREVIOUS_SESSION_DUES_DELETE_CLICKED_TFI)
    setStudentToDelete({
      student_name: rowData.student_name,
      student_id: rowData.student.student_id,
      index: index,
    })
    setIsDeletePopupOpen(true)
  }

  const rowsData = previousSessionDue?.students?.map((student) => {
    let studentDetails = getStudentDetails(student.student_id)
    return {
      student_name: studentDetails?.full_name,
      phone_number: studentDetails?.phone_number,
      img_url: studentDetails?.img_url,
      student: student,
    }
  })

  const rows = rowsData
    ?.filter((rowData) =>
      search
        ? rowData?.student_name?.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .map((rowData, index) => {
      const studentDetails = getStudentDetails(rowData.student.student_id)
      return {
        studentDetails: (
          <StudentDetails rowData={rowData} studentDetails={studentDetails} />
        ),
        classDetails: studentDetails?.classroom || '--',
        dueAmount: <StudentDueAmount rowData={rowData} />,
        action: (
          <StudentActions
            rowData={rowData}
            index={index}
            handleModifySingleRecord={handleModifySingleRecord}
            handleDeleteSingleRecord={handleDeleteSingleRecord}
          />
        ),
      }
    })

  const cols = [
    {key: 'studentDetails', label: t('student')},
    {key: 'classDetails', label: t('class')},
    {key: 'dueAmount', label: t('importedDueAmount')},
    {key: 'action', label: t('action')},
  ]

  if (deletingFeeStructure) {
    return <div className="loader"></div>
  } else {
    return (
      <>
        <StatsContainer previousSessionDue={previousSessionDue} />
        <HeaderSection
          search={search}
          setSearch={setSearch}
          setIsImportModalCSVOpen={setIsImportModalCSVOpen}
          setCSVModalType={setCSVModalType}
          handleDeletePreviousSessionDues={handleDeletePreviousSessionDues}
        />
        <Table rows={rows} cols={cols} />
        {rows.length == 0 && (
          <div className={styles.emptyState}>
            <EmptyState
              content={t('noDuesFound')}
              button={false}
              iconName={'students'}
            />
          </div>
        )}
        {isDeletePopupOpen && (
          <DeleteConfirmationPopup
            setIsDeletePopupOpen={setIsDeletePopupOpen}
            onDelete={handleOnDelete}
            studentToDelete={studentToDelete}
          />
        )}
      </>
    )
  }
}
