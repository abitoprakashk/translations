import {useSelector} from 'react-redux'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import styles from './EditStructure.module.css'
import ToggleSwitch from '../../../pages/fee/components/ToggleSwitch/ToggleSwitch'
import classNames from 'classnames'
import {useState, useEffect} from 'react'
import {Button} from '@teachmint/common'
import {utilsEditInstituteStructure} from '../../../routes/login'
import produce from 'immer'
import {v4 as uuidv4} from 'uuid'
import {showErrorToast, showToast} from '../../../redux/actions/commonAction'
import {useDispatch} from 'react-redux'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {useFeeStructure} from '../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import feeStructureActionTypes from '../../../pages/fee/redux/feeStructure/feeStructureActionTypes'
import alertCircleRedIcon from '../../../assets/images/icons/alert-circle-red.svg'
import {getCalendarData} from '../../../pages/YearlyCalendar/apiService'
import {INSTITUTE_TYPES} from '../../../constants/institute.constants'
import {events} from '../../../utils/EventsConstants'
import {t} from 'i18next'
import {Trans} from 'react-i18next'

export default function SliderEditStructure({
  setShowEditSlider,
  departments,
  getInstituteHierarchy,
  eventManager,
}) {
  const tAddDepartment = t('addDepartment')
  const tAddClass = t('addClass')

  const dispatch = useDispatch()
  let standardDetails = {}
  departments.forEach((element) => {
    element.children.forEach(
      (child) =>
        (standardDetails[child.id] = {
          status: child.status === 1 ? true : false,
          name: child.name,
        })
    )
  })
  const {instituteInfo} = useSelector((state) => state)
  const close = () => setShowEditSlider(null)
  const [oldClassObj, setOldClassObj] = useState({})
  const [newClassObj, setNewClassObj] = useState({})
  const [disabled, setDisabled] = useState(true)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [showDependencyPopup, setShowDependencyPopup] = useState(false)
  const [examList, setExamList] = useState([])
  const {feeStructures} = useFeeStructure()
  const [warningTitle, setWarningTitle] = useState('')
  const [warningDesc, setWarningDesc] = useState('')

  useEffect(() => {
    dispatch({type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_REQUESTED})
    getExamScheduleList()
  }, [])

  const getExamScheduleList = () => {
    if (instituteInfo?._id) {
      getCalendarData(4)
        .then(({obj}) => {
          let examIds = []
          obj.forEach((exam) => (examIds = [...examIds, ...exam.node_ids]))
          setExamList(examIds)
        })
        .catch(() => {
          dispatch(showErrorToast(t('couldNotFetchExamList')))
        })
    }
  }

  const handleChange = ({id, name, status}, fieldname, value) => {
    if (fieldname === 'name') {
      eventManager.send_event(events.EDIT_CLASSROOM_NAME_CLICKED_TFI)
    }
    const temp = produce(oldClassObj, (draft) => {
      if (!draft[id]) draft[id] = {id, name, status}
      draft[id][fieldname] = value
      return draft
    })
    setOldClassObj(temp)
    setDisabled(false)
  }

  const handleNewClassAddition = (parentId) => {
    eventManager.send_event(events.ADD_CLASSROOM_TO_INSTITUTE_CLICKED_TFI)
    const temp = produce(newClassObj, (draft) => {
      if (!draft[parentId]) draft[parentId] = []
      draft[parentId].push({
        name: 'New Class',
        status: true,
        parent_id: parentId,
      })
      return draft
    })
    setNewClassObj(temp)
    setDisabled(false)
  }

  const validateInput = (value) => {
    eventManager.send_event(events.CLASSROOM_NAME_EDITED_TFI)
    if (value.length === 0 || value.length > 100 || value?.includes('-')) {
      setDisabled(true)
      if (value.length === 0) {
        dispatch(showErrorToast(t('nameFieldCantBeEmpty')))
      }
      if (value.length > 100) {
        dispatch(showErrorToast(t('nameCantBeLongerThatCharacters')))
      }
      if (value?.includes('-')) {
        dispatch(showErrorToast(t('nameIsAlphaNumeric')))
      }
    } else setDisabled(false)
  }
  const handleNewClassChange = (parentId, index, fieldname, value) => {
    const temp = produce(newClassObj, (draft) => {
      draft[parentId][index][fieldname] = value
      return draft
    })
    setNewClassObj(temp)
  }

  const handleUpdate = async () => {
    eventManager.send_event(events.UPDATE_SCHOOL_STRUCTURE_POPUP_CLICKED_TFI)
    let res = await utilsEditInstituteStructure({
      old_classes: oldClassObj,
      new_classes: newClassObj,
    })
    if (res.status && res.obj === true) {
      eventManager.send_event(events.SCHOOL_STRUCTURE_UPDATED_TFI)
      getInstituteHierarchy()
      close()
      dispatch(
        showToast({type: 'success', message: t('allChangesMadeSuccessfully')})
      )
    } else {
      dispatch(showToast({type: 'error', message: res?.obj?.error_message}))
      getInstituteHierarchy()
    }
  }

  const checkDependency = ({id, name, status}, value) => {
    const classroomNameCantBeDeleted = (
      <Trans i18nKey={'classroomNameCantBeDeleted'}>
        Classroom {{name}} can’t be deleted
      </Trans>
    )

    if (value)
      eventManager.send_event(
        events.CLASSROOM_FROM_INSTITUTE_ACTIVE_CLICKED_TFI
      )
    else
      eventManager.send_event(
        events.CLASSROOM_FROM_INSTITUTE_INACTIVE_CLICKED_TFI
      )
    const structures = feeStructures?.classView?.filter(
      (ele) => ele.class_id === id
    )[0]
    if (
      structures?.fee_structures?.length > 0 &&
      !value &&
      !examList.includes(id)
    ) {
      setWarningTitle(classroomNameCantBeDeleted)
      setWarningDesc(t('deleteClassroomWarning'))
      setShowDependencyPopup(true)
    } else if (
      structures?.fee_structures?.length > 0 &&
      !value &&
      examList.includes(id)
    ) {
      setWarningTitle(classroomNameCantBeDeleted)
      setWarningDesc(t('deleteClassroomAndExamWarning'))
      setShowDependencyPopup(true)
    } else if (
      !structures?.fee_structures?.length > 0 &&
      !value &&
      examList.includes(id)
    ) {
      setWarningTitle(classroomNameCantBeDeleted)
      setWarningDesc(t('removeExamWarning'))
      setShowDependencyPopup(true)
    } else handleChange({id, name, status}, 'status', value)
  }

  return (
    <>
      <SliderScreen setOpen={() => close()}>
        <>
          <SliderScreenHeader
            icon={
              'https://storage.googleapis.com/tm-assets/icons/primary/edit-pen-primary.svg'
            }
            title={t('editStructure')}
          />

          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div className={styles.topTextContainer}>
              <span className={styles.toptext}>
                {t('addOrRemoveClassesFromYourInstituteOrEditTheClassName')}
              </span>
            </div>
            <div className={styles.departmentConatiner}>
              {departments.map(({id, name, children}) => (
                <div key={id}>
                  <span className={styles.departmentName}>{name}</span>
                  {children.map((ele) => (
                    <div
                      key={ele.id}
                      className={styles.toogleAccordionContainer}
                    >
                      <div className={styles.toggleTitleContainer}>
                        <span
                          className={classNames(
                            'tm-para-16',
                            'tm-color-text-primary',
                            styles.width
                          )}
                        >
                          <input
                            className={styles.inputBgColor}
                            value={
                              oldClassObj[ele.id]
                                ? oldClassObj[ele.id].name
                                : standardDetails[ele.id].name
                            }
                            onChange={(e) =>
                              handleChange(ele, 'name', e.target.value)
                            }
                            onBlur={(e) => validateInput(e.target.value)}
                          />
                        </span>
                        {!(oldClassObj[ele.id]
                          ? oldClassObj[ele.id].status
                          : standardDetails[ele.id].status) && (
                          <span className={styles.inactiveText}>
                            {t('inactive')}
                          </span>
                        )}
                      </div>
                      <ToggleSwitch
                        id={ele.id}
                        checked={
                          oldClassObj[ele.id]
                            ? oldClassObj[ele.id].status
                            : standardDetails[ele.id].status
                        }
                        small={true}
                        onChange={(value) => checkDependency(ele, value)}
                      />
                    </div>
                  ))}

                  {newClassObj?.[id]?.map((newClassItem, index) => (
                    <div
                      key={index}
                      className={styles.toogleAccordionContainer}
                    >
                      <div className={styles.toggleTitleContainer}>
                        <span
                          className={classNames(
                            'tm-para-16',
                            'tm-color-text-primary',
                            styles.width
                          )}
                        >
                          <input
                            className={styles.inputBgColor}
                            value={newClassItem?.name}
                            onChange={(e) => {
                              handleNewClassChange(
                                id,
                                index,
                                'name',
                                e.target.value
                              )
                            }}
                            onBlur={(e) => validateInput(e.target.value)}
                          />
                        </span>
                        {/* {!newClassItem.status && (
                        <span className={styles.inactiveText}>Inactive</span>
                      )} */}
                      </div>
                      <ToggleSwitch
                        id={uuidv4()}
                        checked={newClassItem?.status}
                        small={true}
                        onChange={(value) =>
                          handleNewClassChange(id, index, 'status', value)
                        }
                      />
                    </div>
                  ))}

                  {departments.length === 1 && (
                    <div
                      onClick={() => handleNewClassAddition(id)}
                      className="tm-cr-bl-2 cursor-pointer"
                    >
                      {instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
                        ? `+${tAddDepartment}`
                        : `+${tAddClass}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button
            className={classNames(styles.updateButton)}
            onClick={() => {
              setShowConfirmationPopup(true)
              eventManager.send_event(
                events.UPDATE_SCHOOL_STRUCTURE_CLICKED_TFI
              )
            }}
            disabled={disabled}
          >
            {t('update')}
          </Button>
        </>
      </SliderScreen>
      {showConfirmationPopup && (
        <ConfirmationPopup
          onAction={handleUpdate}
          onClose={setShowConfirmationPopup}
          title={`${t('updateClassStructure')}?`}
          desc={t('deactiveClassWontVisibleToTeacherStudentDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('update')}
        />
      )}
      {showDependencyPopup && (
        <ConfirmationPopup
          onClose={setShowDependencyPopup}
          icon={alertCircleRedIcon}
          primaryBtnText={t('okay')}
          primaryBtnStyle={'tm-btn2-red w-9/10'}
          title={warningTitle}
          desc={warningDesc}
        />
      )}
    </>
  )
}
