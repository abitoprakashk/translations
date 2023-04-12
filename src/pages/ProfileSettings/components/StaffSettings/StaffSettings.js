import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../redux/actions/global.actions'
import {ErrorBoundary} from '@teachmint/common'
import {PERSONA_STATUS} from '../../ProfileSettings.constant'
import ProfileInformation from '../ProfileInformation/ProfileInformation'
import {personaProfileSettingsSelector} from '../../redux/ProfileSettingsSelectors'
import Loader from '../../../../components/Common/Loader/Loader'
import DocumentInformation from '../DocumentInformation/DocumentInformation'
import styles from './StaffSettings.module.css'

const StaffSettings = () => {
  const dispatch = useDispatch()
  const {instituteActiveAcademicSessionId} = useSelector((state) => state)
  const {isLoading: isPersonaProfileSettingsLoading} =
    personaProfileSettingsSelector()

  useEffect(() => {
    const getProfileSettings = {
      persona: PERSONA_STATUS.STAFF.key,
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [instituteActiveAcademicSessionId])

  return (
    <div className={styles.staffSettingsSection}>
      <ErrorBoundary>
        <Loader show={isPersonaProfileSettingsLoading} />
        <ProfileInformation persona={PERSONA_STATUS.STAFF.key} />
        <hr className={styles.divider} />
        <DocumentInformation persona={PERSONA_STATUS.STAFF.key} />
      </ErrorBoundary>
    </div>
  )
}

export default StaffSettings
