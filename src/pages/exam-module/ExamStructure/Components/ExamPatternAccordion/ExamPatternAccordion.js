import {FlatAccordion, Icon} from '@teachmint/common'
import classNames from 'classnames'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import CreateOrImportExamPattern from '../CreateOrImportExamPattern/CreateOrImportExamPattern'
import ExamStructurePreview from '../ExamStructurePreview/ExamStructurePreview'
import styles from './ExamPatternAccordion.module.css'
const ExamPatternAccordion = ({item, isOpen, handleActions}) => {
  const {
    name: standardName,
    previewLink: pdfLink,
    passingPercentage: passingPercentage,
    classId,
  } = toCamelCasedKeys(item)

  const renderTitle = () => {
    if (!pdfLink) {
      return `Class ${standardName}`
    }
    return (
      <div className={styles.title}>
        <span className="tm-hdg tm-hdg-16">{`Class ${standardName}`}</span>
        <span className={styles.createdTag}>
          <Icon name="checkCircle" color="success" size="xxs" />
          <span>Created</span>
        </span>
      </div>
    )
  }

  return (
    <div>
      <FlatAccordion
        title={renderTitle()}
        isOpen={isOpen}
        onClick={handleActions}
        titleClass={classNames('tm-hdg tm-hdg-16', styles.titleClass)}
        accordionClass={styles.accordionClass}
      >
        <hr className={styles.horizontalLine} />

        {pdfLink ? (
          <ExamStructurePreview
            pdfLink={pdfLink}
            passingPercentage={passingPercentage}
            classId={classId}
          />
        ) : (
          <CreateOrImportExamPattern
            classId={classId}
            standardName={standardName}
          />
        )}
      </FlatAccordion>
    </div>
  )
}

export default ExamPatternAccordion
