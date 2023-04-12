import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {t} from 'i18next'
import {
  Modal,
  Para,
  MODAL_CONSTANTS,
  Table,
  PARA_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
} from '@teachmint/krayon'
import {isAdmin} from '../../../utils/helpers'
import styles from './LeadFollowups.module.css'
import {useFollowups} from '../../../redux/admissionManagement.selectors'
import globalActions from '../../../../../redux/actions/global.actions'
import {admissionCrmFollowupStatus} from '../../../utils/constants'

export default function LeadFollowups({showModal, setShowModal, leadId}) {
  const dispatch = useDispatch()
  const leadFollowups = useFollowups()
  const instituteAdminList = useSelector((state) => state.instituteAdminList)

  useEffect(() => {
    dispatch(globalActions.getFollowups.request(leadId))
    return () => dispatch(globalActions.getFollowups.success([]))
  }, [])

  const renderBadge = (followup) => {
    let badgeData = {}
    if (followup.status === admissionCrmFollowupStatus.COMPLETED) {
      badgeData = {
        label: t('completed'),
        type: BADGES_CONSTANTS.TYPE.SUCCESS,
      }
    } else if (followup.followup_timestamp > DateTime.now().toSeconds()) {
      badgeData = {
        label: t('leadProfileFollowupStatusPlanned'),
        type: BADGES_CONSTANTS.TYPE.PRIMARY,
      }
    } else {
      badgeData = {
        label: t('leadProfileFollowupStatusMissed'),
        type: BADGES_CONSTANTS.TYPE.ERROR,
      }
    }
    return (
      <Badges
        inverted={false}
        showIcon={false}
        type={badgeData.type}
        label={badgeData.label}
        className={styles.badgeStyling}
        size={BADGES_CONSTANTS.SIZE.LARGE}
      />
    )
  }

  const cols = [
    {
      key: 'date',
      label: (
        <div className={styles.dateColumnStyle}>
          <Para>{t('leadProfileDateTimeFollowUp')}</Para>
        </div>
      ),
    },
    {key: 'studentDetails', label: t('note')},
    {key: 'action', label: t('createdBy')},
    {key: 'status', label: t('status')},
  ]

  const rows = leadFollowups?.data?.map((followup) => ({
    date: (
      <div className={styles.tableDateColumn}>
        <span>
          {DateTime.fromSeconds(followup.followup_timestamp).toFormat(
            'dd LLL, yyyy'
          )}
        </span>
        <Para
          children={DateTime.fromSeconds(followup.followup_timestamp).toFormat(
            'hh:mm a'
          )}
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.DateTimeColumn}
        />
      </div>
    ),
    studentDetails: (
      <div className={styles.tableNoteColumn}>
        <span>{followup.note}</span>
      </div>
    ),
    action: (
      <div className={styles.tableCreatorColumn}>
        <span>{isAdmin(followup.c_by, instituteAdminList)?.full_name}</span>
      </div>
    ),
    status: (
      <div className={styles.tableTimeColumn}>{renderBadge(followup)}</div>
    ),
  }))

  return (
    <Modal
      isOpen={showModal}
      header={t('followUpOverview')}
      onClose={() => setShowModal(!showModal)}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      classes={{
        content: styles.content,
        modal: styles.modalTable,
        header: styles.headers,
      }}
    >
      {leadFollowups.isLoading ? (
        <div className="loader"></div>
      ) : (
        <Table
          rows={rows}
          cols={cols}
          isSelectable={false}
          classes={{td: styles.cell}}
        />
      )}
    </Modal>
  )
}
