import {Button, BUTTON_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './BackendPagination.module.css'

const STEP = {
  PREV: 'PREV',
  NEXT: 'NEXT',
}

const DEFAULT_ICONS = {
  prev: 'backArrow',
  next: 'forwardArrow',
}

function BackendPagination({
  paginationObj,
  pageSize,
  onPageChange,
  icons,
  classes,
  currentPage,
  setCurrentPage,
}) {
  const handlePageChange = (step) => {
    if (step === STEP.PREV) {
      if (paginationObj?.ending_before && currentPage > 1) {
        setCurrentPage(currentPage - 1)
        onPageChange({step, referenceId: paginationObj?.ending_before})
      }
    } else if (step === STEP.NEXT) {
      if (paginationObj?.starting_after) {
        setCurrentPage(currentPage + 1)
        onPageChange({step, referenceId: paginationObj?.starting_after})
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Showing {pageSize} entries</div>
      <div className={styles.actions}>
        <span className={styles.currentPageLabel}>
          You are on page {currentPage}
        </span>

        <IconButton
          onClick={() => handlePageChange(STEP.PREV)}
          icon={icons.prev || DEFAULT_ICONS.prev}
          className={classNames(
            styles.iconButton,
            styles.action,
            classes.iconButton
          )}
          disable={paginationObj?.is_first_page}
        />
        <IconButton
          onClick={() => handlePageChange(STEP.NEXT)}
          icon={icons.next || DEFAULT_ICONS.next}
          className={classNames(
            styles.iconButton,
            styles.action,
            classes.iconButton
          )}
          disable={paginationObj?.is_last_page}
        />
      </div>
    </div>
  )
}

function IconButton({className, icon, onClick, disable}) {
  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClick(event)
    }
  }

  return (
    <Button
      type={BUTTON_CONSTANTS.TYPE.TEXT}
      isDisabled={disable}
      classes={{button: className}}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {typeof icon === 'string' ? (
        <Icon
          name={icon}
          version={ICON_CONSTANTS.VERSION.FILLED}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={disable && ICON_CONSTANTS.TYPES.SECONDARY}
        />
      ) : (
        icon
      )}
    </Button>
  )
}

IconButton.propTypes = {
  className: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
}

BackendPagination.defaultProps = {
  paginationObj: {
    is_first_page: false,
    is_last_page: false,
    ending_before: '',
    starting_after: '',
  },
  onPageChange: () => {},
  classes: {},
  icons: DEFAULT_ICONS,
}

BackendPagination.propTypes = {
  paginationObj: PropTypes.shape({
    is_first_page: PropTypes.bool.isRequired,
    is_last_page: PropTypes.bool.isRequired,
    ending_before: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    starting_after: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }),
  onPageChange: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
  icons: PropTypes.shape({
    prev: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    next: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  }),
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
    iconButton: PropTypes.string,
    label: PropTypes.string,
  }),
}

export default BackendPagination
