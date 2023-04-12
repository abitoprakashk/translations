import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {FlatAccordion} from '@teachmint/common'

import styles from './ClassList.module.css'
import {STANDARD} from '../../constants'
import useQuery from '../../../../../hooks/UseQuery'
import {getNodesListOfSimilarTypeWithChildren} from '../../../../../utils/HierarchyHelpers'
import NoReportCard from '../NoReportCard/NoReportCard'
import ClassDetails from './components/ClassDetails/ClassDetails'
import SliderPreview from '../common/SliderPreview/SliderPreview'
import {getClassTemplateListAction} from '../../redux/actions'

export default function ClassList({editTemplate, openClass}) {
  const query = useQuery()
  const dispatch = useDispatch()

  const {instituteHierarchy} = useSelector((state) => state)
  const {standardList} = useSelector(({reportCard}) => reportCard)
  const [selectedStandard, setSelectedStandard] = useState(query.get('classId'))
  const [listOfClasses, setListOfClasses] = useState([])
  const [previewTemplate, setPreviewTemplate] = useState(null)

  useEffect(() => {
    dispatch(getClassTemplateListAction())
    let classId = query.get('classId')
    if (classId) {
      setSelectedStandard(classId)
    }
  }, [])

  useEffect(() => {
    setListOfClasses([
      ...getNodesListOfSimilarTypeWithChildren(instituteHierarchy, STANDARD),
    ])
  }, [instituteHierarchy])

  const renderAccordions = () => {
    return listOfClasses.map((standard) => (
      <FlatAccordion
        key={standard.id}
        title={`Class ${standard.name}`}
        isOpen={selectedStandard ? selectedStandard === standard.id : false}
        accordionClass={styles.accordionStyle}
        titleClass="tm-hdg tm-hdg-16"
      >
        <div className={styles.classDetailWrapper}>
          <div className={styles.classDetails}>
            {standardList &&
            standardList[standard.id] &&
            standardList[standard.id]?.templateDetails?.url ? (
              <ClassDetails
                standard={{...standard, ...standardList[standard.id]}}
                editTemplate={editTemplate}
                openClass={openClass}
                setTemplatePreview={setPreviewTemplate}
              />
            ) : (
              <NoReportCard standardId={standard.id} />
            )}
          </div>
        </div>
      </FlatAccordion>
    ))
  }

  return (
    <div className={styles.wrapper}>
      {renderAccordions()}
      {previewTemplate && (
        <SliderPreview
          previewData={previewTemplate}
          setPreviewData={setPreviewTemplate}
          screenName="classes_list_page"
        />
      )}
    </div>
  )
}
