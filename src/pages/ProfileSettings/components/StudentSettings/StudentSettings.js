import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ErrorBoundary} from '@teachmint/common'
import globalActions from '../../../../redux/actions/global.actions'
import Loader from '../../../../components/Common/Loader/Loader'
import {PERSONA_STATUS} from '../../ProfileSettings.constant'
import ProfileInformation from '../ProfileInformation/ProfileInformation'
import DocumentInformation from '../DocumentInformation/DocumentInformation'
import {personaProfileSettingsSelector} from '../../redux/ProfileSettingsSelectors'
import styles from './StudentSettings.module.css'

const StudentSettings = () => {
  const dispatch = useDispatch()
  const {instituteActiveAcademicSessionId} = useSelector((state) => state)

  const {isLoading: isPersonaProfileSettingsLoading} =
    personaProfileSettingsSelector()

  useEffect(() => {
    const getProfileSettings = {
      persona: PERSONA_STATUS.STUDENT.key,
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [instituteActiveAcademicSessionId])

  return (
    <div className={styles.studentSettingsSection}>
      <ErrorBoundary>
        <Loader show={isPersonaProfileSettingsLoading} />
        <ProfileInformation persona={PERSONA_STATUS.STUDENT.key} />
        <hr className={styles.divider} />
        <DocumentInformation persona={PERSONA_STATUS.STUDENT.key} />
      </ErrorBoundary>
    </div>
  )
}

export default StudentSettings
