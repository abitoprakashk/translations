import {Accordion, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import styles from './ReportCardAccordion.module.css'

const ReportCardAccordion = ({isOpen = false, header, children}) => {
  return (
    <Accordion
      isOpen={isOpen}
      classes={{
        accordionHeader: styles.accordionHeader,
        accordionBody: styles.accordionBody,
        accordionWrapper: styles.accordionWrapper,
      }}
      headerContent={
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        >
          <span className={styles.accordianEdgeCover} />
          {header}
          <span className={styles.accordianEdgeCover} />
        </Para>
      }
      allowHeaderClick
    >
      {children}
    </Accordion>
  )
}

export default ReportCardAccordion
