import {useState} from 'react'
import {Tabs} from '@teachmint/common'
import FeeHistory from '../FeeHistory/FeeHistory'
import StudentBasicInfo from '../StudentBasicInfo/StudentBasicInfo'
import styles from './StudentDetails.module.css'
import defaultUserIcon from '../../../../assets/images/icons/user-profile.svg'

const StudentDetails = ({instituteId, phoneNumber, studentId}) => {
  const [currentTab, setCurrentTab] = useState('Basic Info')

  return (
    <div className={styles.studentDetails}>
      <header>
        <div style={{display: 'flex'}}>
          <img src={defaultUserIcon} alt="Student" height={70} width={30} />
          <h2 style={{margin: '10px', display: 'flex'}}>Student Details</h2>
        </div>
        <Tabs
          currentTab={currentTab}
          tabs={['Basic Info', 'Fee History']}
          onTabClick={(tab) => setCurrentTab(tab)}
        />
      </header>
      <form>
        {currentTab === 'Basic Info' && (
          <StudentBasicInfo
            instituteId={instituteId}
            phoneNumber={phoneNumber}
          />
        )}
        {currentTab === 'Fee History' && (
          <FeeHistory instituteId={instituteId} studentId={studentId} />
        )}
      </form>
    </div>
  )
}

export default StudentDetails
