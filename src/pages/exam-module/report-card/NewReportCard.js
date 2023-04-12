import React, {lazy, Suspense, useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  generatePath,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {HeaderTemplate, TabGroup} from '@teachmint/krayon'
import {getNodesListOfSimilarTypeWithChildren} from '../../../utils/HierarchyHelpers'
import {STANDARD} from './constants'
import {
  getClassTemplateListAction,
  updateActiveStandardAndSection,
} from './redux/actions'
import REPORT_CARD_ROUTES from './ReportCard.routes'
import {events} from '../../../utils/EventsConstants'

const SectionView = lazy(() => import('./components/SectionView/SectionView'))
const Evaluation = lazy(() =>
  import('./components/SectionView/components/Evaluation/Evaluation')
)
const NewClassList = lazy(() =>
  import('./components/NewClassList/NewClassList')
)
const EditTemplate = lazy(() =>
  import('./components/EditTemplate/EditTemplateNew')
)

import styles from './NewReportCard.module.css'

const {BASE_ROUTE, SECTION_VIEW, EVALUATION_VIEW, EDIT_TEMPLATE} =
  REPORT_CARD_ROUTES

const NewReportCard = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const standardList = useSelector((state) => state.reportCard?.standardList)
  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)
  const students = useSelector(({reportCard}) => reportCard?.students)
  const eventManager = useSelector((state) => state.eventManager)
  const [listOfClasses, setListOfClasses] = useState([])
  const {sectionId = null, standardId = null} = useParams()
  const history = useHistory()

  const isSectionView = !!useRouteMatch({
    path: SECTION_VIEW,
    exact: true,
  })

  useEffect(() => {
    setListOfClasses([
      ...getNodesListOfSimilarTypeWithChildren(instituteHierarchy, STANDARD),
    ])
  }, [instituteHierarchy])

  useEffect(() => {
    if (!standardList[standardId]) {
      dispatch(getClassTemplateListAction())
    }
  }, [Object.keys(standardList).length, standardId])

  const {standard, section} = useMemo(() => {
    const standard = listOfClasses.filter(({id}) => id == standardId)[0] || {}
    const section =
      standard?.children?.filter(({id}) => id == sectionId)[0] || {}

    return {standard, section}
  }, [listOfClasses, standardId, sectionId])

  useEffect(() => {
    dispatch(updateActiveStandardAndSection({standard, section}))
    return () =>
      dispatch(updateActiveStandardAndSection({standard: null, section: null}))
  }, [standard, section])

  return (
    <div className={styles.wrapper}>
      <Switch>
        <Route path={BASE_ROUTE} exact>
          <HeaderTemplate
            showBreadcrumb={false}
            mainHeading={t('reportCard')}
            classes={{divider: styles.headerDivider}}
          />
        </Route>
        <Route path={[SECTION_VIEW, EVALUATION_VIEW, EDIT_TEMPLATE]}>
          <HeaderTemplate
            headerTemplateRightElement={
              <div id="actionButtonsForEditTemplate"></div>
            }
            breadcrumbObj={{
              className: '',
              paths: [
                {
                  label: t('reportCard'),
                  to: `${BASE_ROUTE}?open=${standard.id}`,
                  onClick: (e) => {
                    e.preventDefault()
                    history.push(`${BASE_ROUTE}?open=${standard.id}`)
                  },
                },
                {
                  label: section.name
                    ? `${standard.name || ''} - ${section.name || ''}`
                    : `${t('class')} ${standard.name || ''}`,
                },
              ],
              prefixPathSize: 1,
              suffixPathSize: 2,
              textSize: 'm',
            }}
            mainHeading={
              section.name
                ? `${t('class')} ${standard.name || ''} - ${section.name || ''}`
                : `${t('reportCard')} - ${t('class')} ${standard.name || ''}`
            }
            classes={{buttonWrapper: 'ml-0', content: 'flex-wrap'}}
          />

          {sectionId &&
            standardId &&
            (isSectionView ? students?.sectionStudents?.length > 0 : true) && (
              <div className={styles.tabWrapper}>
                <TabGroup
                  onTabClick={(tab) => {
                    eventManager.send_event(
                      tab.id == 2
                        ? events.REPORT_CARD_EVALUATION_TAB_CLICKED_TFI
                        : events.REPORT_CARD_REPORT_CARD_TAB_CLICKED_TFI,
                      {
                        class_id: standard.id,
                        section_id: section.id,
                      }
                    )
                    history.push(tab.route)
                  }}
                  selectedTab={isSectionView ? 1 : 2}
                  tabOptions={[
                    {
                      id: 1,
                      label: t('reportCard'),
                      route: generatePath(SECTION_VIEW, {
                        sectionId,
                        standardId,
                      }),
                    },
                    {
                      id: 2,
                      label: t('evaluation'),
                      route: generatePath(EVALUATION_VIEW, {
                        sectionId,
                        standardId,
                      }),
                    },
                  ]}
                />
                {/* this wrapper is used as portal to put buttons, don't remove it */}
                <div
                  id="reportcardCtaWrapper"
                  className={styles.reportcardCtaWrapper}
                />
              </div>
            )}
        </Route>
      </Switch>

      <Suspense fallback="loading...">
        <Switch>
          <Route path={BASE_ROUTE} exact>
            <NewClassList classes={listOfClasses} standardList={standardList} />
          </Route>
          <Route path={EDIT_TEMPLATE} component={EditTemplate} />
          <Route path={SECTION_VIEW} exact>
            <SectionView standard={standard} section={section} />
          </Route>
          <Route path={EVALUATION_VIEW} component={Evaluation} exact />
        </Switch>
      </Suspense>
    </div>
  )
}

export default React.memo(NewReportCard)
