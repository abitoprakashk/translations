import React from 'react'
import {CollectFeeModalProvider} from '../../../context/CollectFeeModalContext/CollectFeeModalContext'
import CollectFeeModalContextComponent from '../../../context/CollectFeeModalContext/CollectFeeModalContextComponent'
import {useSelector} from 'react-redux'
import {getStudentDetails} from '../../../../helpers/helpers'

function CollectFeeModal({studentId, setShowCollectFeeModal, classId}) {
  const instituteStudentList = useSelector(
    (state) => state.instituteStudentList
  )
  const studentName = getStudentDetails(
    instituteStudentList,
    studentId
  )?.full_name

  return (
    <CollectFeeModalProvider>
      <CollectFeeModalContextComponent
        studentId={studentId}
        studentName={studentName}
        setShowCollectFeeModal={setShowCollectFeeModal}
        classId={classId}
      />
    </CollectFeeModalProvider>
  )
}

export default CollectFeeModal
