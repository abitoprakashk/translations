import {ErrorBoundary} from '@teachmint/common'
import {
  Divider,
  Heading,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  EmptyState,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {TRANSLATIONS_CA} from '../../companyAccConstants'
import HistoryCard from '../../components/HistoryCard/HistoryCard'
import {useAccountChangeHistorySelector} from '../../selectors'
import styles from './AccountChangeHistoryModal.module.css'

export default function AccountChangeHistory({
  isOpen = true,
  setIsOpen = () => {},
  selectedReceiptId,
  companies,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [historyData, setHistoryData] = useState([])
  const instituteAdmin = useSelector((state) => state.instituteAdminList)
  const accountChangeHistory = useAccountChangeHistorySelector()

  const instituteAdmins = useMemo(() => {
    let admins = {}
    instituteAdmin.forEach((admin) => {
      admins[admin.user_id] = {name: admin.name, imgUrl: admin.imgUrl}
    })
    return admins
  }, [instituteAdmin])

  useEffect(() => {
    const successAction = (obj) => {
      setHistoryData(obj.history)
    }

    dispatch(
      globalActions.accountChangeHistory.request(
        {receiptId: selectedReceiptId},
        successAction,
        () => {}
      )
    )
  }, [])

  function getAccountDetails(accountId) {
    let accountDetails = {account_name: '', account_number: ''}
    const account = companies.find(
      (obj) => obj.accounts.filter((acc) => acc._id === accountId).length > 0
    )

    if (account) {
      const matchedAccount = account.accounts.find(
        (acc) => acc._id === accountId
      )
      accountDetails.account_name = matchedAccount.account_name
      accountDetails.account_number = matchedAccount.account_number
    }

    return accountDetails
  }

  return (
    <ErrorBoundary>
      <Modal
        size={MODAL_CONSTANTS.SIZE.MEDIUM}
        isOpen={isOpen}
        header={
          <>
            <div className={styles.modalHeadingSection}>
              <Heading textSize="x_s">
                {t('accountChangeHistoryHeading')}
              </Heading>
              <div>
                <button onClick={() => setIsOpen(false)}>
                  <Icon
                    name="close"
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    version={ICON_CONSTANTS.VERSION.OUTLINED}
                  />
                </button>
              </div>
            </div>
            <Divider length="100%" spacing="0px" thickness="1px" />
          </>
        }
      >
        {accountChangeHistory.isLoading ? (
          <div className="loading" />
        ) : (
          <div
            className={classNames(styles.historyCard, {
              [styles.emptyStateWrapperCenter]: historyData.length === 0,
            })}
          >
            {historyData.map((element) => {
              return (
                <HistoryCard
                  key={element.id}
                  imgScr={instituteAdmins[element?.u_by]?.imgUrl}
                  name={instituteAdmins[element?.u_by]?.name ?? '-'}
                  content={
                    <div className={styles.contentText}>
                      <span className={styles.boldText}>
                        {instituteAdmins[element?.u_by]?.name ?? '-'}
                      </span>{' '}
                      {t('accountChangeHistoryText', {
                        prevBank: getAccountDetails(element.previous_account_id)
                          .account_name,
                        nextBank: getAccountDetails(element.next_account_id)
                          .account_name,
                      })}
                    </div>
                  }
                  timestamp={element.u}
                />
              )
            })}
            {historyData.length === 0 && (
              <EmptyState
                button={false}
                iconName={'history'}
                content={TRANSLATIONS_CA.accountChangeHistoryEmptyStateMsg}
              />
            )}
          </div>
        )}
      </Modal>
    </ErrorBoundary>
  )
}
