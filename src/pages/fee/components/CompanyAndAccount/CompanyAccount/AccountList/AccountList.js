import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import styles from './AccountList.module.css'
import CompanyListStyles from '../CompanyList/CompanyList.module.css'
import TitleAndButton from '../../components/TitleAndButton/TitleAndButton'
import ListItem from '../../components/ListItem/ListItem'
import {
  FEE_ACCOUNT_ENABLED_OPTIONS,
  FEE_ACCOUNT_DISABLED_OPTIONS,
} from '../../companyAccConstants'
import {EmptyState, Para} from '@teachmint/krayon'
import AccountCreateModal from './AccountCreateModal/AccountCreateModal'
import AccountEditModal from './AccountEditModal/AccountEditModal'
import DisableEnableAccount from './DisableEnableAccount/DisableEnableAccount'
import classNames from 'classnames'
import {t} from 'i18next'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function AccountList({accounts = [], selectedCompany = {}}) {
  const history = useHistory()
  const {path} = useRouteMatch()
  const url = (link) => (link ? `${path}/${link}` : path)
  const eventManager = useSelector((state) => state.eventManager)

  const [isCreateModalOopen, setIsCreateModalOopen] = useState(false)
  const [editAccount, setEditAccount] = useState(null)
  const [disableEnableAccount, setDisableEnableAccount] = useState(null)

  const handleCreateAccountBtnClick = () => {
    eventManager.send_event(events.FEE_ADD_ACCOUNT_INITIALISED_TFI, {})
    setIsCreateModalOopen(true)
  }
  const handleCreateModalClose = () => {
    eventManager.send_event(events.FEE_ADD_ACCOUNT_CLICKED_TFI, {
      action: 'cancel',
    })
    setIsCreateModalOopen(false)
  }
  const handleEditModalClose = () => {
    setEditAccount(null)
  }
  const handleDisableEnableAccountPopupClose = () => {
    eventManager.send_event(events.FEE_ACCOUNT_STATUS_CHANGED_TFI, {
      status: !disableEnableAccount?.disabled ? 'disabled' : 'enabled',
      action: 'cancel',
      account_id: disableEnableAccount?._id,
    })
    setDisableEnableAccount(null)
  }

  const handleChange = (action, index) => {
    switch (action) {
      case 'VIEW_EDIT': {
        eventManager.send_event(events.FEE_ACCOUNT_KMENU_CLICKED_TFI, {
          option: 'view/edit',
        })
        setEditAccount(accounts[index])
        break
      }
      case 'DISABLED_ENABLED_COMPANY': {
        eventManager.send_event(events.FEE_ACCOUNT_KMENU_CLICKED_TFI, {
          option: accounts[index]?.disabled
            ? 'enable_account'
            : 'disable_account',
        })
        setDisableEnableAccount(accounts[index])
        break
      }
      case 'PASSBOOK': {
        eventManager.send_event(events.FEE_ACCOUNT_KMENU_CLICKED_TFI, {
          option: 'passbook',
        })
        history.push(
          `${url('account-passbook')}?acc_id=${accounts[index]?._id}`
        )
        break
      }
      default:
        break
    }
  }

  return (
    <>
      {isCreateModalOopen && (
        <AccountCreateModal
          isOpen={isCreateModalOopen}
          onClose={handleCreateModalClose}
          company_id={selectedCompany?._id}
        />
      )}
      {editAccount != null && (
        <AccountEditModal
          isOpen={editAccount != null}
          onClose={handleEditModalClose}
          company_id={selectedCompany?._id}
          accountDetails={editAccount}
        />
      )}
      {disableEnableAccount != null && (
        <DisableEnableAccount
          isOpen={disableEnableAccount != null}
          onClose={handleDisableEnableAccountPopupClose}
          accountDetails={disableEnableAccount}
        />
      )}

      <div
        className={
          accounts?.length === 0 ? styles.emptySection : styles.section
        }
      >
        <div
          className={`${CompanyListStyles.titleAndButtonSection} ${
            accounts?.length === 0 ? styles.visibilityHidden : ''
          }`}
        >
          <TitleAndButton
            text={t('accountHeader', {name: selectedCompany?.name})}
            buttonText={t('addAccount')}
            onButtonClick={handleCreateAccountBtnClick}
            classes={{
              wrapper: classNames(
                styles.titleAndButtonWrapper,
                styles.higherspecifisity
              ),
              buttonClasses: {button: styles.buttonClass},
            }}
          />
        </div>

        {accounts?.length > 0 ? (
          <div
            className={classNames(
              'show-scrollbar show-scrollbar-small',
              styles.accountsContainer
            )}
          >
            {accounts.map((account, i) => (
              <ListItem
                key={account?._id}
                text={account?.account_name}
                description={account?.account_number}
                isDisabled={account?.disabled}
                listIndex={i}
                options={
                  account?.disabled
                    ? FEE_ACCOUNT_ENABLED_OPTIONS
                    : FEE_ACCOUNT_DISABLED_OPTIONS
                }
                handleChange={handleChange}
                classes={{
                  section: classNames(
                    styles.listItemSection,
                    styles.higherspecifisity
                  ),
                }}
              />
            ))}
          </div>
        ) : (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.accountController_createRoute_create
            }
          >
            <div className={styles.emptyList}>
              <EmptyState
                button={{
                  category: 'primary',
                  children: t('addAccount'),
                  onClick: handleCreateAccountBtnClick,
                  size: 'm',
                  suffixIcon: '',
                  type: '',
                  width: '',
                }}
                iconName={'accountBalance'}
                content={
                  <div className={styles.emptyStateCompanyHelperText}>
                    <Para>
                      {t('accountEmptyStateText', {
                        name: selectedCompany?.name,
                      })}
                    </Para>
                  </div>
                }
              />
            </div>
          </Permission>
        )}
      </div>
    </>
  )
}
