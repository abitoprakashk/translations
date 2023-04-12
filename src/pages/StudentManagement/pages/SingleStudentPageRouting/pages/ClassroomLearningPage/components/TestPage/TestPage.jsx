import {Heading, HEADING_CONSTANTS, Para, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React from 'react'
import {useState} from 'react'
import BarChart from '../BarChart/BarChart'
import NavItems from '../NavItems/NavItems'
import TestTable from '../TestTable/TestTable'
import styles from './TestPage.module.css'

const statsItems = [
  {id: '0', label: 'totalAssigned', value: '', style: 'statsItem1'},
  {id: '1', label: 'totalAttempted', value: '', style: 'statsItem2'},
  {id: '2', label: 'averageScore', value: '', style: 'statsItem3'},
  {id: '3', label: 'notAttempted', value: '', style: 'statsItem4'},
]

const overviewTab = 'overview'

export default function TestPage({currentStudent, testData}) {
  const [selectedTab, setSelectedTab] = useState(overviewTab)

  const getStatsDataToDisplay = (selectedTab) => {
    let selectedTabData = null
    if (selectedTab === overviewTab) selectedTabData = testData
    else selectedTabData = testData?.classes?.find(({id}) => id === selectedTab)

    const statsItemsNew = [...statsItems]

    if (selectedTabData) {
      statsItemsNew[0].value = selectedTabData?.total_assigned || 0
      statsItemsNew[1].value = selectedTabData?.total_submissions || 0
      statsItemsNew[2].value = (selectedTabData?.student_avg_percent || 0) + '%'
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
        items={getNavItems(testData?.classes)}
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
            chartTitle={t('testChartTitle')}
            lengends={[
              `${currentStudent?.name}’s ${t('score')}`,
              t('averageClassScore'),
            ]}
            labels={testData?.classes?.map(({name}) => name)}
            datasets={[
              testData?.classes?.map(
                ({student_avg_percent}) => student_avg_percent
              ),
              testData?.classes?.map(
                ({class_avg_percent}) => class_avg_percent
              ),
            ]}
          />
        ) : (
          <TestTable
            data={testData?.classes?.find(({id}) => id === selectedTab)}
          />
        )}
      </div>
    </PlainCard>
  )
}
