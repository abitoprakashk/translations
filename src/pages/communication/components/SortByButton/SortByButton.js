import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from '../../Communication.module.css'

export default function SortByButton(props) {
  const {t} = useTranslation()

  const sortOptions = [
    {
      id: 1,
      name: t('all'),
      tab: 'All',
    },
    {
      id: 2,
      name: t('today'),
      tab: 'All',
    },
    {
      id: 3,
      name: t('yesterday'),
      tab: 'All',
    },
    {
      id: 4,
      name: t('thisWeek'),
      tab: 'All',
    },
    {
      id: 5,
      name: t('thisMonth'),
      tab: 'All',
    },
    {
      id: 6,
      name: t('last6Months'),
      tab: 'All',
    },
  ]

  const filteredOptions = sortOptions.filter(
    (option) => option.tab === props.currentTab
  )

  return (
    <>
      {props.currentTab === 'All' && (
        <div className={styles.sortBySec}>
          <div className={styles.sortByHeading}>{t('filterBy')} :</div>
          <div className={classNames('hidden', 'lg:block')}>
            {filteredOptions.map((option) => (
              <button
                className={classNames(styles.sortByButton, {
                  [styles.sortByButtonActive]:
                    +props.currentlyActive === option.id,
                })}
                key={option.id}
                onClick={() => props.handleSortBy(`${option.id}`)}
              >
                {option.name}
              </button>
            ))}
          </div>
          <div className="lg:hidden">
            <select
              className={classNames(
                styles.selectSurvey,
                'mb-0',
                'px-2',
                'w-32'
              )}
              onChange={(e) => props.handleSortBy(e.target.value)}
            >
              {filteredOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  )
}
