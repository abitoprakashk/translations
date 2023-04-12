import {EmptyState, Para} from '@teachmint/krayon'
import React, {useEffect, useState} from 'react'
import {t} from 'i18next'
import AccountList from './CompanyAccount/AccountList/AccountList'

import CompanyList from './CompanyAccount/CompanyList/CompanyList'
import styles from './CompanyAndAccount.module.css'
import CreateCompanyModal from './CreateCompanyModal/CreateCompanyModal'
import EditCompanyModal from './EditCompanyModal/EditCompanyModal'
import DisableEnableCompany from './DisableEnableCompany/DisableEnableCompany'
import {useCompanyAndAccountSelector} from './selectors'
import Loader from '../../../../components/Common/Loader/Loader'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'

export default function CompanyAndAccount() {
  const {data: companies, isLoading} =
    useCompanyAndAccountSelector()?.getCompanyAccountListCA

  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null)
  const [companyList, setCompanyList] = useState([])
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] =
    useState(false)
  const [editCompany, setEditCompany] = useState(null)
  const [disableEnableCompany, setDisableEnableCompany] = useState(null)
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    let allCompanies = Object.values(companies || {})?.flat(1)
    if (allCompanies.length > 0) {
      setCompanyList(allCompanies)
      setSelectedCompanyIndex(selectedCompanyIndex || 0)
      setSelectedCompany(
        selectedCompanyIndex !== null
          ? allCompanies[selectedCompanyIndex]
          : allCompanies[0]
      )
    }
  }, [companies])

  const handleCreateModalClose = () => {
    eventManager.send_event(events.FEE_CREATE_COMPANY_CLICKED_TFI, {
      action: 'cancel',
    })
    setIsCreateCompanyModalOpen(false)
  }
  const handleEditModalClose = () => {
    setEditCompany(null)
  }

  const handleDisableEnableCompanyPopupClose = () => {
    eventManager.send_event(events.FEE_COMPANY_STATUS_CHANGED_TFI, {
      status: !disableEnableCompany?.disabled ? 'disabled' : 'enabled',
      company_id: disableEnableCompany._id,
      action: 'cancel',
    })
    setDisableEnableCompany(null)
  }

  return (
    <>
      <Loader show={isLoading} />
      {isCreateCompanyModalOpen && (
        <CreateCompanyModal
          isOpen={isCreateCompanyModalOpen}
          onClose={handleCreateModalClose}
        />
      )}
      {editCompany != null && (
        <EditCompanyModal
          isOpen={editCompany != null}
          onClose={handleEditModalClose}
          companyDetails={editCompany}
        />
      )}
      {disableEnableCompany != null && (
        <DisableEnableCompany
          isOpen={disableEnableCompany != null}
          onClose={handleDisableEnableCompanyPopupClose}
          companyDetails={disableEnableCompany}
        />
      )}

      {companyList.length === 0 ? (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.companyController_createRoute_create
          }
        >
          <EmptyState
            button={{
              category: 'primary',
              children: t('createCompany'),
              onClick: () => {
                setIsCreateCompanyModalOpen(true)
              },
              size: 'm',
              suffixIcon: '',
              type: '',
              width: '',
            }}
            iconName={'storeMallDirectory'}
            content={
              <div className={styles.emptyStateWrapper}>
                <Para>{t('companyEmptyStateLine1')}</Para>
                <Para>{t('companyEmptyStateLine2')}</Para>
              </div>
            }
          />
        </Permission>
      ) : (
        <div className={styles.companyAccountSection}>
          <CompanyList
            companies={companyList}
            selectedCompany={selectedCompany}
            setIsCreateCompanyModalOpen={setIsCreateCompanyModalOpen}
            setEditCompany={setEditCompany}
            setDisableEnableCompany={setDisableEnableCompany}
            setSelectedCompany={setSelectedCompany}
            setSelectedCompanyIndex={setSelectedCompanyIndex}
          />
          <AccountList
            accounts={selectedCompany?.accounts || []}
            selectedCompany={selectedCompany}
          />
        </div>
      )}
    </>
  )
}
