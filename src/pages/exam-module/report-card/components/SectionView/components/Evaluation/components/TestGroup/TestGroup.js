import React, {useEffect} from 'react'
import {
  Accordion,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'

import styles from './TestGroup.module.css'
import classNames from 'classnames'
import AccordionContent from './AccordianContent'
import {IS_MOBILE} from '../../../../../../../../../constants'
import {useDispatch} from 'react-redux'
import {removeTermEvaluationDetails} from '../../../../../../redux/actions'
import {useTranslation} from 'react-i18next'

const TestGroup = React.memo(
  ({heading, scholastic = false, data = {}, classId, sectionId}) => {
    const {term_id: termId, remaining_test_evaluation} = data

    const dispatch = useDispatch()
    const {t} = useTranslation()

    useEffect(() => {
      return () =>
        dispatch(
          removeTermEvaluationDetails({
            term_id: termId || 'other',
            section_id: sectionId,
          })
        )
    }, [])

    return (
      <Accordion
        headerContent={
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
            weight={HEADING_CONSTANTS.WEIGHT.BOLD}
            className={classNames(
              styles.flex,
              styles.spaceBetween,
              styles.alignCenter,
              styles.accordionHeader,
              {[styles.mobile]: IS_MOBILE}
            )}
          >
            {heading}
            {scholastic ? (
              remaining_test_evaluation == 0 ? (
                <Para
                  type={PARA_CONSTANTS.TYPE.SUCCESS}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                  className={classNames(
                    styles.flex,
                    styles.alignCenter,
                    styles.gap1,
                    styles.bold
                  )}
                >
                  <Icon
                    name="checkCircle"
                    version={ICON_CONSTANTS.VERSION.FILLED}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type={ICON_CONSTANTS.TYPES.SUCCESS}
                  />
                  {IS_MOBILE ? t('completed') : t('evaluationCompleted')}
                </Para>
              ) : (
                <Para
                  type={PARA_CONSTANTS.TYPE.WARNING}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                  className={classNames(
                    styles.flex,
                    styles.alignCenter,
                    styles.gap1,
                    styles.bold
                  )}
                >
                  <Icon
                    name="error"
                    version={ICON_CONSTANTS.VERSION.FILLED}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type={ICON_CONSTANTS.TYPES.WARNING}
                  />
                  {remaining_test_evaluation}{' '}
                  {IS_MOBILE ? t('pending') : t('evaluationPending')}
                </Para>
              )
            ) : null}
          </Heading>
        }
        toggleIconNames={{
          closed: 'chevronDown',
          opened: 'chevronUp',
        }}
        allowHeaderClick
        classes={{
          accordionBody: classNames(styles.accordionBody, {
            [styles.mobile]: IS_MOBILE,
          }),
        }}
      >
        <AccordionContent
          termId={termId}
          scholastic={scholastic}
          classId={classId}
          sectionId={sectionId}
        />
      </Accordion>
    )
  }
)

TestGroup.displayName = 'TestGroup'

export default TestGroup
