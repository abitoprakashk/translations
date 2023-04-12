import {ErrorBoundary} from '@teachmint/common'
import {
  BUTTON_CONSTANTS,
  Divider,
  Dropdown,
  Heading,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {useChangeReceiptAccountSelector} from '../../selectors'
import {PASSBOOK_ROWS_LIMIT} from '../passbookConstants'
import styles from './ChangeAccountModal.module.css'

export default function ChangeAccountModal({
  isOpen = true,
  setIsOpen = () => {},
  companies,
  accountId,
  selectedReceiptId,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [selectedValue, setSeletctedValue] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const changeReceiptAccount = useChangeReceiptAccountSelector()

  const handleConfirmClick = () => {
    const successAction = () => {
      setIsOpen(false)
      dispatch(
        globalActions.getAccountPassbook.request(
          {
            account_id: accountId,
            filters: {},
            limit: PASSBOOK_ROWS_LIMIT,
            next: true,
          },
          successAction,
          failureAction
        )
      )
    }

    const failureAction = (obj) => {
      setErrorMsg(obj)
    }

    dispatch(
      globalActions.changeReceiptAccount.request(
        {
          new_account_id: selectedValue,
          current_account_id: accountId,
          receipt_id: selectedReceiptId,
        },
        successAction,
        failureAction
      )
    )
  }

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
              <Heading textSize="x_s">{t('changeAccount')}</Heading>
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
        actionButtons={[
          {
            body: t('cancel'),
            onClick: () => setIsOpen(!isOpen),
            isDisabled: changeReceiptAccount.isLoading,
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          },
          {
            body: t('confirm'),
            isDisabled: !selectedValue || changeReceiptAccount.isLoading,
            onClick: handleConfirmClick,
          },
        ]}
        footerLeftElement={
          <div className={styles.footerMessage}>{errorMsg}</div>
        }
      >
        <div className={styles.parent}>
          <div className={styles.fromAccount}>
            <span className={styles.fromText}>{t('from')}</span>
            <span className={styles.previousAccountNameText}>
              {getAccountDetails(accountId).account_name}
            </span>
            <span className={styles.previousAccountNumberText}>
              {`${t('accountNumberShortHand')} - ${
                getAccountDetails(accountId).account_number
              }`}
            </span>
          </div>
          <Icon
            name="doubleArrow"
            size={ICON_CONSTANTS.SIZES.LARGE}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            className={styles.iconWrapper}
          />

          <div className={styles.fromAccount}>
            <span className={styles.fromText}>{t('to')}</span>
            {companies && (
              <Dropdown
                fieldName="accountField"
                onChange={(obj) => setSeletctedValue(obj.value)}
                options={companies.flatMap((obj) =>
                  obj.accounts
                    .filter((account) => account._id != accountId)
                    .map((account) => ({
                      label: (
                        <div
                          className={classNames(
                            styles.flexColumn,
                            styles.dropdownOptionEllipsis
                          )}
                          title={account?.account_name}
                        >
                          {account.account_name}
                          <Para>
                            <small>{obj.name}</small>
                          </Para>
                        </div>
                      ),
                      value: account._id,
                    }))
                )}
                selectedOptions={selectedValue}
                classes={{
                  wrapperClass: styles.dropdown,
                  dropdownClass: classNames({
                    [styles.dropdownOptionWidthFitContent]: selectedValue,
                  }),
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </ErrorBoundary>
  )
}
