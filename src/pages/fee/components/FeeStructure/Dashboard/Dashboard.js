import {useEffect, useMemo, useState} from 'react'
import {Button, ErrorOverlay, Icon} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import styles from './Dashboard.module.css'
import Radio from '../../tfi-common/Radio/Radio'
import CreateStructureModal from '../CreateStructureModal/CreateStructureModal'
import {showEditSessionAction} from '../../../../../redux/actions/commonAction'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import {events} from '../../../../../utils/EventsConstants'
import feeStructureActionTypes from '../../../redux/feeStructure/feeStructureActionTypes'
import {FEE_STRUCTURE_VIEWS, HELP_VIDEOS} from '../../../fees.constants'
import StructuresList from './StructuresList'
import {useTranslation} from 'react-i18next'
import {
  fetchFeeCategoriesRequestedAction,
  fetchFeeStructuresRequestedAction,
} from '../../../redux/feeStructure/feeStructureActions'
import classNames from 'classnames'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useLocation} from 'react-router-dom'

export default function Dashboard() {
  const {t} = useTranslation()
  const {
    eventManager,
    instituteInfo,
    instituteHierarchy,
    instituteAcademicSessionInfo,
    instituteAcademicSessionLoading,
    instituteActiveAcademicSessionId,
    instituteAcademicSessionError,
  } = useSelector((state) => state)
  const search = useLocation().search
  const createFee = useMemo(
    () => new URLSearchParams(search)?.get('createFee'),
    [search]
  )
  const {feeStructuresLoading, feeStructures} = useFeeStructure()
  const departments = instituteHierarchy && instituteHierarchy.children
  const [showCreateFeeStructureModal, setShowCreateFeeStructureModal] =
    useState(createFee)

  const [showClassView, setShowClassView] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFeeCategoriesRequestedAction())
    dispatch(fetchFeeStructuresRequestedAction())
  }, [])

  const handleImportSession = () => {
    dispatch(showEditSessionAction(true))
  }

  if (feeStructuresLoading || instituteAcademicSessionLoading || !departments) {
    return <div className="loading"></div>
  }

  const handleViewChange = (isClassView) => {
    eventManager.send_event(events.FEE_STRUCTURE_VIEW_CHANGED_TFI, {
      view: isClassView ? 'class_view' : 'structure_view',
    })
    setShowClassView(!!isClassView)
  }

  const handleDownloadCSVClick = () => {
    dispatch({
      type: feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_REQUESTED,
      payload: {
        instituteInfo,
        eventManager,
        sessionRange: instituteAcademicSessionInfo.find(
          (session) => session._id == instituteActiveAcademicSessionId
        ),
      },
    })
  }

  return (
    <div className={styles.mainContainer}>
      {showCreateFeeStructureModal && (
        <CreateStructureModal
          showCreateFeeStructureModal={showCreateFeeStructureModal}
          setShowCreateFeeStructureModal={setShowCreateFeeStructureModal}
        />
      )}
      {Object.keys(feeStructures.structureView).length === 0 ? (
        <div className={styles.mainContainer}>
          <div className={styles.noFeeStructure}>
            <span>{t('noFeeStructureText')}</span>
            <div>
              <iframe
                width="560"
                height="315"
                src={HELP_VIDEOS.RECURRING_STRUCTURE}
                title={t('howToSetupRecurringFeeStructure')}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className={styles.emptyStateButtons}>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.feeModuleController_feeStructure_create
                }
              >
                <Button
                  className={styles.createNew}
                  size="big"
                  type="border"
                  onClick={() => setShowCreateFeeStructureModal(true)}
                >
                  {t('createFeeStructure')}
                </Button>
              </Permission>
              <Button
                className={styles.createNew}
                size="big"
                type="primary"
                onClick={handleImportSession}
              >
                {t('importFeeStructureLabel')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.headerContent}>
            <div className={styles.multiViewFlex}>
              <Radio type={'heading'} onChange={handleViewChange}>
                {FEE_STRUCTURE_VIEWS.map((view) => {
                  return (
                    <option
                      key={view.value}
                      selected={showClassView === !!view.value}
                      value={view.value}
                    >
                      {view.label}
                    </option>
                  )
                })}
              </Radio>
              {false && (
                <div
                  className={styles.downloadCsvBtn}
                  onClick={handleDownloadCSVClick}
                >
                  <Icon
                    className={classNames(
                      styles.higherSpecificityFont,
                      styles.higherSpecificitySize,
                      styles.downloadIcon
                    )}
                    name="download"
                    color="primary"
                  />
                </div>
              )}
            </div>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.feeModuleController_feeStructure_create
              }
            >
              <Button
                className={styles.addNew}
                size="big"
                type="primary"
                onClick={() => setShowCreateFeeStructureModal(true)}
              >
                {t('plusSignNewStructure')}
              </Button>
            </Permission>
          </div>
          <StructuresList
            showClassView={showClassView}
            feeStructures={feeStructures}
          />
        </div>
      )}
      {instituteAcademicSessionError && (
        <div className={styles.error}>
          <ErrorOverlay>
            <div>{t('failedToLoadConfigurations')}</div>
          </ErrorOverlay>
        </div>
      )}
    </div>
  )
}
