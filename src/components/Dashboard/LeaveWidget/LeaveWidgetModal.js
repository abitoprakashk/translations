import {Modal, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import styles from './LeaveWidget.module.css'

const LeaveWidgetModal = ({headerData, bodyData, display, setDisplay}) => {
  const {t} = useTranslation()
  const getBody = (data) => {
    return (
      <div className={classNames('show-scrollbar show-scrollbar-small')}>
        {data.map((leaveEntry) => {
          return (
            <>
              <div className={styles.modalBody}>
                <Para
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                  className={classNames(styles.modalName, styles.ellipseText)}
                >
                  {leaveEntry?.name}
                </Para>
                <div className={styles.modalSubHeading}>
                  <Para
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    className={classNames(
                      styles.firstEntry,
                      styles.ellipseText
                    )}
                  >
                    {leaveEntry?.classes?.length === 0
                      ? leaveEntry?.role_name
                      : `${t('classTeacher')} ${leaveEntry?.classes[0]}`}
                  </Para>
                  <span className={styles.vanishingDot} />
                  <Para
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    className={classNames(
                      styles.remainingData,
                      styles.ellipseText
                    )}
                  >
                    {leaveEntry?.no_of_days}{' '}
                    {leaveEntry?.no_of_days > 1 ? t('days') : t('day')}
                    <span className={styles.dot} />
                    <span className={styles.leavedate}>
                      {`${t('from')} ${new Date(leaveEntry.from_date * 1000)
                        .toDateString()
                        .slice(4)}`}
                    </span>
                    {leaveEntry.to_date && (
                      <>
                        <span> - </span>
                        <span className={styles.leavedate}>
                          {new Date(leaveEntry?.to_date * 1000)
                            .toDateString()
                            .slice(4)}
                        </span>
                      </>
                    )}{' '}
                  </Para>
                </div>
              </div>
            </>
          )
        })}
      </div>
    )
  }
  return (
    <>
      <Modal
        size="s"
        header={headerData}
        onClose={() => {
          setDisplay(false)
        }}
        isOpen={display}
        children={getBody(bodyData)}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        classes={styles}
      />
    </>
  )
}

export default LeaveWidgetModal
