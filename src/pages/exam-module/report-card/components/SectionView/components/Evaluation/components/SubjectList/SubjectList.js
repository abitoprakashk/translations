import classNames from 'classnames'
import SubjectCard from '../SubjectCard/SubjectCard'

import styles from './SubjectList.module.css'

const SubjectList = ({list = [], className, type}) => {
  return (
    <div className={classNames(styles.subjectGrid, className)}>
      {list.map((data) => (
        <SubjectCard
          key={`${data.assessment_id}-${data.term_id}-${data.subject_id}`}
          data={data}
          type={type}
        />
      ))}
    </div>
  )
}

export default SubjectList
