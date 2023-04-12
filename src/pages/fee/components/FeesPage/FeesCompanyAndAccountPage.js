import {HeaderTemplate, Icon, TabGroup, ButtonDropdown} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React, {Suspense, useCallback, useEffect, useMemo, useState} from 'react'
import {
  matchPath,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import {
  COMPANY_ACC_TAB_OPTIONS,
  COMPANY_ACC_TAB_OPTIONS_IDS,
  ACCOUNT_ACTIVITY_FILTER_TYPES,
  ACCOUNT_ACTIVITY_FILTER_OPTIONS,
  TRANSLATIONS_CA,
} from '../CompanyAndAccount/companyAccConstants'
import CompanyAndAccount from '../CompanyAndAccount/CompanyAndAccount'
import styles from './FeesPage.module.css'
import {useHistory} from 'react-router-dom'
import AccountMapping from '../CompanyAndAccount/AccountMapping/AccountMapping'
import {ErrorBoundary} from '@teachmint/common'
import Loader from '../../../../components/Common/Loader/Loader'
import Passbook from '../CompanyAndAccount/Passbook/Passbook'
import AccountActivity from '../CompanyAndAccount/AccountActivity/AccountActivity'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../redux/actions/global.actions'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import examMobileImage from '../../../../assets/images/dashboard/exam-mobile.svg'
import {DASHBOARD} from '../../../../utils/SidebarItems'
import {useCompanyAndAccountSelector} from '../CompanyAndAccount/selectors'
import useQueryParam from '../../../AttendanceReport/pages/TodaysDetailedReport/hooks/useQueryParam'
import {getAccountsList} from '../CompanyAndAccount/helpers'
import {events} from '../../../../utils/EventsConstants'

export default function FeesCompanyAndAccountPage() {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const {path} = useRouteMatch()
  const url = (link) => (link ? `${path}/${link}` : path)
  const eventManager = useSelector((state) => state.eventManager)

  const ROUTES = {
    DEFAULT: url(''),
    COMPANY_ACCOUNT: url(''),
    ACCOUNT_ACTIVITY: url('account-activity'),
    ACCOUNT_MAPPING: url('account-mapping'),
    ACCOUNT_PASSBOOK: url('account-passbook'),
  }

  const isHeaderTemplateShown = matchPath(location.pathname, {
    path: [ROUTES.DEFAULT, ROUTES.ACCOUNT_MAPPING],
    exact: true,
    strict: false,
  })

  const [selectedTab, setSelectedTab] = useState(
    COMPANY_ACC_TAB_OPTIONS_IDS.companyAndAccount
  )
  const [selectedFilterType, setSelectedFilterType] = useState(
    ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_WEEK
  )
  const [passbookName, setPassbookName] = useState('')

  const {data: companies} =
    useCompanyAndAccountSelector()?.getCompanyAccountListCA
  const accountId = useQueryParam('acc_id')
  useEffect(() => {
    if (accountId && companies?.companies) {
      const accountsList = getAccountsList(companies?.companies, {
        withDisabled: true,
      })
      const findAccount = accountsList.find((acc) => acc?._id === accountId)
      setPassbookName(findAccount?.account_name)
    }
  }, [accountId, companies])

  const autoSelectTab = () => {
    // tab selection
    let tabId = COMPANY_ACC_TAB_OPTIONS_IDS.companyAndAccount
    switch (location.pathname) {
      case ROUTES.ACCOUNT_MAPPING:
        tabId = COMPANY_ACC_TAB_OPTIONS_IDS.accountMapping
        break

      default:
        tabId = COMPANY_ACC_TAB_OPTIONS_IDS.companyAndAccount
        break
    }
    setSelectedTab(tabId)
  }

  const breadCrumbs = useCallback(() => {
    autoSelectTab()
    const isBreadCrumShown = matchPath(location.pathname, {
      path: [ROUTES.ACCOUNT_PASSBOOK, ROUTES.ACCOUNT_ACTIVITY],
      exact: true,
      strict: false,
    })

    if (isBreadCrumShown?.path === ROUTES.ACCOUNT_PASSBOOK) {
      return [
        {
          label: TRANSLATIONS_CA.companyAndAccount,
          onClick: () => {
            history.push(ROUTES.DEFAULT)
          },
        },
        {
          label: TRANSLATIONS_CA.passbook + ' - ' + passbookName,
          to: '/x2',
        },
      ]
    } else if (isBreadCrumShown?.path === ROUTES.ACCOUNT_ACTIVITY) {
      return [
        {
          label: TRANSLATIONS_CA.companyAndAccount,
          onClick: () => {
            history.push(ROUTES.DEFAULT)
          },
        },
        {
          label: TRANSLATIONS_CA.activity,
          to: '/x2',
        },
      ]
    } else {
      return []
    }
  }, [location.pathname, passbookName])

  useEffect(() => {
    dispatch(globalActions.getCompanyAccountListCA.request())
  }, [])

  const headerTempProps = useMemo(() => {
    let breadcrumbObj = {
      className: styles.breadcrumbLink,
      paths: breadCrumbs(),
      prefixPathSize: 1,
      suffixPathSize: 2,
      textSize: 'l',
    }
    switch (location?.pathname) {
      case ROUTES.ACCOUNT_ACTIVITY:
        return {
          breadcrumbObj,
          headerTemplateRightElement: (
            <ButtonDropdown
              buttonObj={{
                buttonClasses: '',
                children: t(
                  ACCOUNT_ACTIVITY_FILTER_OPTIONS[selectedFilterType].label
                ),
                suffixIcon: 'downArrow',
                type: 'outline',
                classes: {
                  button: styles.buttonDropdownButton,
                },
              }}
              classes={{
                dropdownContainer: styles.buttonDropdownContainer,
              }}
              handleOptionClick={(e) => handleFilterChange(e.value)}
              options={Object.keys(ACCOUNT_ACTIVITY_FILTER_OPTIONS).map(
                (key) => {
                  return {
                    id: ACCOUNT_ACTIVITY_FILTER_OPTIONS[key].id,
                    label: t(ACCOUNT_ACTIVITY_FILTER_OPTIONS[key].label),
                  }
                }
              )}
            />
          ),
          mainHeading: <span>{TRANSLATIONS_CA.accountActivityHeading}</span>,
        }
      case ROUTES.ACCOUNT_PASSBOOK:
        return {
          breadcrumbObj,
          mainHeading: (
            <span>
              {TRANSLATIONS_CA.passbook} - {passbookName}
            </span>
          ),
        }
      default:
        return {
          actionButtons: [
            // {
            //   category: 'primary',
            //   children: (
            //     <div className={styles.viewActivityBtn}>
            //       <Icon name="videoList2" size="x_s" type="error" />
            //       <div
            //         className={classNames(
            //           styles.headerBtnHelpLabel,
            //           styles.headerTemplateBtnLabel
            //         )}
            //       >
            //         {TRANSLATIONS_CA.helpVideo}
            //       </div>
            //     </div>
            //   ),
            //   classes: {
            //     button: styles.headerBtnHelp,
            //     label: styles.headerBtnHelpLabel,
            //   },
            //   id: 'primary-btn',
            //   onClick: () => {},
            //   size: 's',
            //   type: 'outline',
            //   width: 'fit',
            // },
            {
              category: 'primary',
              children: (
                <div className={styles.viewActivityBtn}>
                  <Icon name="timeline" size="x_s" type="primary" />
                  <div className={styles.headerTemplateBtnLabel}>
                    {TRANSLATIONS_CA.viewActivity}
                  </div>
                </div>
              ),
              classes: {},
              id: 'sec-btn',
              onClick: () => {
                history.push(url('account-activity'))
                eventManager.send_event(
                  events.FEE_ACCOUNT_ACTIVITY_LOG_VIEW_CLICKED_TFI
                )
              },
              size: 's',
              type: 'outline',
              width: 'fit',
            },
          ],
          mainHeading: <span>{TRANSLATIONS_CA.companyAndAccount} </span>,
        }
    }
  }, [location?.pathname, selectedFilterType, passbookName])

  const sendClickEvents = (eventName, dataObj = {}) => {
    return eventManager.send_event(eventName, {
      ...dataObj,
    })
  }

  const handleTabSelection = (tabId) => {
    let url =
      tabId === COMPANY_ACC_TAB_OPTIONS_IDS.companyAndAccount
        ? ROUTES.COMPANY_ACCOUNT
        : ROUTES.ACCOUNT_MAPPING
    if (tabId === COMPANY_ACC_TAB_OPTIONS_IDS.companyAndAccount) {
      sendClickEvents(events.FEE_COMPANIES_AND_ACCOUNTS_TAB_CLICKED_TFI)
    } else if (tabId === COMPANY_ACC_TAB_OPTIONS_IDS.accountMapping) {
      sendClickEvents(events.FEE_ACCOUNTS_MAPPING_TAB_CLICKED_TFI)
    }
    setSelectedTab(tabId)
    history.push(url)
  }

  const handleFilterChange = (filterType) => {
    setSelectedFilterType(filterType)
  }

  return (
    <div
      className={classNames(
        'lg:px-6 lg:pb-6 lg:pt-3',
        styles.accountCompanyPageContainer,
        'show-scrollbar show-scrollbar-small'
      )}
    >
      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText={t('goToDashboard')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>
      <div className="hidden lg:block">
        <HeaderTemplate {...headerTempProps} />
        {isHeaderTemplateShown && (
          <nav className={styles.tabGroupMenu}>
            <TabGroup
              moredivClass="TabGroup-stories-module__moreDiv__2gikz"
              onTabClick={({id}) => handleTabSelection(id)}
              selectedTab={selectedTab}
              tabOptions={COMPANY_ACC_TAB_OPTIONS}
            />
          </nav>
        )}

        {/* Routes */}
        <ErrorBoundary>
          <Suspense fallback={<Loader show />}>
            <Switch>
              <Route
                exact
                path={ROUTES.COMPANY_ACCOUNT}
                component={CompanyAndAccount}
              />

              <Route
                exact
                path={ROUTES.ACCOUNT_MAPPING}
                component={AccountMapping}
              />
              <Route
                exact
                path={ROUTES.ACCOUNT_PASSBOOK}
                component={Passbook}
              />
              <Route
                exact
                path={ROUTES.ACCOUNT_ACTIVITY}
                render={() => (
                  <AccountActivity selectedFilterType={selectedFilterType} />
                )}
              />
              <Redirect to={ROUTES.DEFAULT} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
