import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {Card, Icon, Tooltip} from '@teachmint/common'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {getShortTxnId} from '../../../../../utils/Helpers'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import defaultEmptyCategoriesScreen from '../../UICommon/profileSettingsEmptyIcon.svg'
import styles from './DocumentCategoriesSection.module.css'

const DocumentCategoriesSection = ({persona}) => {
  const {t} = useTranslation()
  const {personaWiseDocumentCategoryListData} = useSelector(
    (state) => state.profileSettings
  )

  return (
    <div className={styles.categoriesInnerSection}>
      {personaWiseDocumentCategoryListData &&
      personaWiseDocumentCategoryListData.length > 0 ? (
        <div className={styles.statsContainer}>
          {personaWiseDocumentCategoryListData.map((item) => {
            const charCount = item.label.length > 20
            return (
              <div key={item._id} className={styles.statsCard}>
                <Link
                  to={{
                    pathname: '/institute/dashboard/profile-settings/category',
                    search: `?userType=${persona}&category=${item._id}`,
                  }}
                  className={styles.statsCardLinks}
                >
                  <Card
                    className={classNames(styles.cardSection)}
                    key={item._id}
                  >
                    <div className={styles.cardItemsSection}>
                      <div className={styles.titleSection}>
                        <span
                          className={styles.titleText}
                          data-tip
                          data-for={`${item.label}_${item._id}`}
                        >
                          {getShortTxnId(item.label, 20)}
                        </span>
                        {charCount && (
                          <Tooltip
                            toolTipId={`${item.label}_${item._id}`}
                            place="top"
                            type="info"
                            className={styles.toolTipBlock}
                          >
                            <span>{item.label}</span>
                          </Tooltip>
                        )}

                        <span className={styles.linkBlock}>
                          <Icon
                            name="backArrow"
                            size="xxs"
                            className={styles.arrowImg}
                          />
                        </span>
                      </div>
                      <div
                        className={styles.totalFieldsCounts}
                      >{`${item.childrenFields.length} fields`}</div>
                    </div>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.noCategoryFound}>
          <EmptyScreenV1
            image={defaultEmptyCategoriesScreen}
            title={t('noCategoriesAdded')}
            btnType="primary"
          />
        </div>
      )}
    </div>
  )
}

export default DocumentCategoriesSection
