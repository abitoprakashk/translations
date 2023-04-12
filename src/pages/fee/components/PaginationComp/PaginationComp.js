import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {Trans} from 'react-i18next'
import styles from './PaginationComp.module.css'

export default function PaginationComp({
  pageSize = 10,
  page,
  onPageChange = () => {},
  totalEntries,
}) {
  const STEP = {
    PREV: -1,
    NEXT: 1,
  }
  const DEFAULT_ICONS = {
    prev: 'backArrow',
    next: 'forwardArrow',
  }
  const pageCount = Math.ceil(totalEntries / pageSize)

  const handlePageChange = (step) => {
    onPageChange(page + step)
  }

  const isPrevBtnDisabled = page <= 1
  const isNextBtnDisabled = page >= pageCount

  return (
    <div className={styles.pagginationWrapper}>
      <Divider length="100%" spacing="0px" thickness="1px" />
      <div className={styles.paginationSection}>
        <div className={styles.label}>
          <Trans i18nKey="pageNumberEntries">
            {{pageStart: pageSize * (page - 1) + 1}} -{' '}
            {{pageEnd: Math.min(pageSize * page, totalEntries)}} of{' '}
            {{totalEntries}} entries
          </Trans>
        </div>

        <div className={styles.pageCountAndBtnSection}>
          <div>
            <Trans i18nKey="pageNumber">
              Page {{currentPage: page}} of {{lastPage: pageCount}}
            </Trans>
          </div>
          <div className={styles.btnSection}>
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              isDisabled={isPrevBtnDisabled}
              onClick={() => handlePageChange(STEP.PREV)}
              className={classNames(styles.pageButtons, {
                [styles.disabledPageButtons]: isPrevBtnDisabled,
              })}
              title={`${!isPrevBtnDisabled ? 'Previous page' : 'Disabled'}`}
            >
              <Icon
                name={DEFAULT_ICONS.prev}
                className={styles.pageButtonIcons}
                version={ICON_CONSTANTS.VERSION.FILLED}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={isPrevBtnDisabled && ICON_CONSTANTS.TYPES.SECONDARY}
                color={`${!isPrevBtnDisabled ? 'secondary' : 'basic'}`}
              />
            </Button>
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              isDisabled={isNextBtnDisabled}
              onClick={() => handlePageChange(STEP.NEXT)}
              className={classNames(styles.pageButtons, {
                [styles.disabledPageButtons]: isNextBtnDisabled,
              })}
              title={`${!isNextBtnDisabled ? 'Next page' : 'Disabled'}`}
            >
              <Icon
                name={DEFAULT_ICONS.next}
                className={styles.pageButtonIcons}
                version={ICON_CONSTANTS.VERSION.FILLED}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={isNextBtnDisabled && ICON_CONSTANTS.TYPES.SECONDARY}
                color={`${!isNextBtnDisabled ? 'secondary' : 'basic'}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
