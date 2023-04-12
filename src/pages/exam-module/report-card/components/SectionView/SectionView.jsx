import {useSelector} from 'react-redux'
import StudentList from './components/StudentList/StudentList'

import styles from './SectionView.module.css'

const SectionView = ({section = {}, standard = {}}) => {
  const standardList = useSelector((state) => state.reportCard?.standardList)
  const standardId = standard.id

  return (
    <div className={styles.flexGrow}>
      {standardList[standardId]?.template_details?.published && (
        <StudentList
          classDetails={{
            ...section,
            ...standardList[standardId],
            selectedTemplate: standardList[standardId]?.template_details,
          }}
        />
      )}
    </div>
  )
}

export default SectionView
