import {Heading, HEADING_CONSTANTS, Para, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React from 'react'
import {useState} from 'react'
import BarChart from '../BarChart/BarChart'
import HomeworkTable from '../HomeworkTable/HomeworkTable'
import NavItems from '../NavItems/NavItems'
import styles from './HomeworkPage.module.css'

const statsItems = [
  {id: '0', label: 'totalAssigned', value: '', style: 'statsItem1'},
  {id: '1', label: 'totalSubmissions', value: '', style: 'statsItem2'},
  {id: '2', label: 'lateSubmissions', value: '', style: 'statsItem3'},
  {id: '3', label: 'notAttempted', value: '', style: 'statsItem4'},
]

const overviewTab = 'overview'

export default function HomeworkPage({homeworkData}) {
  const [selectedTab, setSelectedTab] = useState(overviewTab)

  const getStatsDataToDisplay = (selectedTab) => {
    let selectedTabData = null
    if (selectedTab === overviewTab) selectedTabData = homeworkData
    else
      selectedTabData = homeworkData?.classes?.find(
        ({id}) => id === selectedTab
      )

    const statsItemsNew = [...statsItems]

    if (selectedTabData) {
      statsItemsNew[0].value = selectedTabData?.total_assigned || 0
      statsItemsNew[1].value = selectedTabData?.total_submissions || 0
      statsItemsNew[2].value = selectedTabData?.late_submissions || 0
      statsItemsNew[3].value = selectedTabData?.not_submitted || 0
    }

    return statsItemsNew
  }

  const getNavItems = (classes) => {
    let items = [{id: overviewTab, label: t('overview')}]
    if (classes) classes?.forEach(({id, name}) => items.push({id, label: name}))
    return items
  }

  return (
    <PlainCard className={styles.outerCard}>
      <NavItems
        items={getNavItems(homeworkData?.classes)}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <div className={styles.contentWrapper}>
        <div className={styles.statsWrapper}>
          {getStatsDataToDisplay(selectedTab)?.map(
            ({id, label, value, style}) => (
              <PlainCard
                key={id}
                className={classNames(
                  styles.statsItem,
                  style ? styles[style] : ''
                )}
              >
                <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                  {value}
                </Heading>
                <Para>{t(label)}</Para>
              </PlainCard>
            )
          )}
        </div>

        {selectedTab === overviewTab ? (
          <BarChart
            chartTitle={t('homeworkChartTitle')}
            lengends={[t('totalSubmissions'), t('lateSubmissions')]}
            labels={homeworkData?.classes?.map(({name}) => name)}
            datasets={[
              homeworkData?.classes?.map(
                ({total_submissions}) => total_submissions
              ),
              homeworkData?.classes?.map(
                ({late_submissions}) => late_submissions
              ),
            ]}
          />
        ) : (
          <HomeworkTable
            data={homeworkData?.classes?.find(({id}) => id === selectedTab)}
          />
        )}
      </div>
    </PlainCard>
  )
}
