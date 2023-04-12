import {
  Button,
  Divider,
  Dropdown,
  Icon,
  ICON_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import useSendEvent from '../../../../../pages/AttendanceReport/hooks/useSendEvent'
import {events} from '../../../../../utils/EventsConstants'
import {sortSessionsByCreationDate} from '../../../../../utils/sessionUtils'
import {utilsGetInstituteHierarchy} from '../../../../../routes/instituteSystem'
import {
  showErrorOccuredAction,
  showErrorToast,
} from '../../../../../redux/actions/commonAction'
import Loader from '../../../../Common/Loader/Loader'
import styles from './SelectImportSession.module.css'

const SelectImportSession = ({selectedSessionId, onImport, isEditActive}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [sourceSessionId, setSourceSessionId] = useState(null)
  const [loading, setLoading] = useState(false)

  const instituteInfo = useSelector((state) => state.instituteInfo)
  const instituteAcademicSessionInfo = useSelector(
    (state) => state.instituteAcademicSessionInfo
  )

  const sendEvent = useSendEvent()
  const isCreateFlow = !selectedSessionId

  const availableSessions = getSessionOptions(
    instituteAcademicSessionInfo || [],
    selectedSessionId
  )

  if (!availableSessions.length) {
    return null
  }

  const handleImport = () => {
    sendEvent(events.IMPORT_SESSION_CLICKED_TFI, {
      from_session_id: sourceSessionId,
      session_id: selectedSessionId,
    })
    setLoading(true)
    utilsGetInstituteHierarchy(instituteInfo._id, null, sourceSessionId)
      .then(({status, obj}) => {
        if (status) {
          if (!obj.children?.length) {
            dispatch(
              showErrorToast(t('importErrorWhenSourceSessionHasNoStructures'))
            )
          } else {
            onImport(sourceSessionId)
          }
        } else {
          dispatch(showErrorToast(t('genericErrorMessage')))
        }
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() => setLoading(false))
  }

  return (
    <div className={styles.moreActions}>
      <Loader show={loading} />
      <div className={styles.importConfigHeader}>
        {t('importConfigTitle')}
        <Button
          type="text"
          prefixIcon={<Icon name="play1" type="primary" size="xx_s" />}
          onClick={() => {
            const newWindow = window.open(
              'https://youtu.be/WiQXyTqqxgg',
              '_blank',
              'noopener,noreferrer'
            )
            if (newWindow) newWindow.opener = null
          }}
        >
          {t('helpVideoCap')}
        </Button>
      </div>
      <div className={styles.importContainer}>
        {(isCreateFlow || isEditActive) && (
          <Tooltip
            toolTipId="disabledInfo"
            place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
            toolTipBody={
              isCreateFlow
                ? t('importDisabledAsCreateInProgress')
                : t('importDisabledAsUpdateInProgress')
            }
          />
        )}
        <div className={styles.paddedBox}>
          <div className={styles.importFromLabel}>{t('importFromLabel')}</div>
          <div className={styles.selectSession}>
            <div data-for="disabledInfo" data-tip>
              <Dropdown
                options={getSessionOptions(
                  instituteAcademicSessionInfo,
                  selectedSessionId
                )}
                selectedOptions={sourceSessionId}
                onChange={({value}) => {
                  setSourceSessionId(value)
                  sendEvent(events.IMPORT_SESSION_SELECTED_DROPDOWN_TFI, {
                    from_session_id: value,
                  })
                }}
                classes={{
                  wrapperClass: styles.dropdownWrapper,
                  dropdownClass: styles.dropdown,
                }}
                isDisabled={isCreateFlow || isEditActive}
                placeholder={t('selectPreviousSessionLabel')}
              />
            </div>
            <Button
              isDisabled={!sourceSessionId}
              onClick={() => handleImport(sourceSessionId)}
            >
              {t('importStartLabel')}
            </Button>
          </div>
        </div>
        <Divider spacing="0" />
        <div className={styles.infoContainer}>
          <Icon
            name="info"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
          />
          <span>{t('importConfigDesc')}</span>
        </div>
      </div>
    </div>
  )
}

const getSessionOptions = (allSessions, selectedSessionId) =>
  sortSessionsByCreationDate(allSessions)
    .filter(
      (session) => !selectedSessionId || session._id !== selectedSessionId
    )
    .map((session) => ({
      label: session.name,
      value: session._id,
    }))

export default SelectImportSession
