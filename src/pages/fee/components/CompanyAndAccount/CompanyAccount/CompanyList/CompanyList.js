import React from 'react'
import {useSelector} from 'react-redux'
import styles from './CompanyList.module.css'
import {
  FEE_COMAPNY_ENABLED_OPTIONS,
  FEE_COMAPNY_DISABLED_OPTIONS,
} from '../../companyAccConstants'
import ListItem from '../../components/ListItem/ListItem'
import TitleAndButton from '../../components/TitleAndButton/TitleAndButton'
import classNames from 'classnames'
import {events} from '../../../../../../utils/EventsConstants'
import {t} from 'i18next'

export default function CompanyList({
  companies = [],
  selectedCompany = {},
  setIsCreateCompanyModalOpen,
  setEditCompany,
  setDisableEnableCompany,
  setSelectedCompany,
  setSelectedCompanyIndex,
}) {
  const eventManager = useSelector((state) => state.eventManager)

  const handleChange = (action, index) => {
    switch (action) {
      case 'VIEW_EDIT': {
        eventManager.send_event(events.FEE_COMPANY_KMENU_CLICKED_TFI, {
          option: 'view/edit',
        })
        setEditCompany(companies[index])
        break
      }
      case 'DISABLED_ENABLED_COMPANY': {
        eventManager.send_event(events.FEE_COMPANY_KMENU_CLICKED_TFI, {
          option: companies[index]?.disabled
            ? 'enable_company'
            : 'disable_company',
        })
        setDisableEnableCompany(companies[index])
        break
      }
      default:
        break
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.titleAndButtonSection}>
        <TitleAndButton
          text={t('companies')}
          buttonText={t('addCompany')}
          onButtonClick={() => {
            eventManager.send_event(
              events.FEE_CREATE_COMPANY_INITIALISED_TFI,
              {}
            )
            setIsCreateCompanyModalOpen(true)
          }}
        />
      </div>

      <div
        className={classNames(
          'show-scrollbar show-scrollbar-small',
          styles.companiesContainer
        )}
      >
        {companies &&
          companies.length > 0 &&
          companies.map((company, i) => (
            <ListItem
              isSelected={company?._id === selectedCompany?._id}
              key={i}
              listIndex={i}
              text={company?.name}
              isDisabled={company?.disabled}
              options={
                company?.disabled
                  ? FEE_COMAPNY_ENABLED_OPTIONS
                  : FEE_COMAPNY_DISABLED_OPTIONS
              }
              onClick={() => {
                setSelectedCompanyIndex(i)
                setSelectedCompany(company)
              }}
              handleChange={handleChange}
              classes={{section: styles.listItemSection}}
            />
          ))}
      </div>
    </div>
  )
}
