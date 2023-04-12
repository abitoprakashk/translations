import styles from './StudentBasicInfo.module.css'
import dp from '../../icons/dp.jpeg'
import deleteIcon from '../../icons/delete.png'
import {fetchStudentDetails} from '../../apis/fees.apis'
import {useState} from 'react'
import {useEffect} from 'react'
import {Tag} from '@teachmint/common'

const StudentBasicInfo = ({instituteId, phoneNumber}) => {
  const [studentDetails, setStudentDetails] = useState(null)

  useEffect(() => {
    const loadStudentDetails = async () => {
      const res = await fetchStudentDetails(instituteId, phoneNumber)
      setStudentDetails(res)
    }
    loadStudentDetails()
  }, [phoneNumber])

  if (!studentDetails) {
    return <div className="loading" />
  }

  return (
    <section className={styles.studentBasicInfo}>
      <header>
        <img src={dp} alt="" />
        {studentDetails.verificationStatus === 1 ? (
          <Tag accent="success" content="Joined" />
        ) : (
          <Tag accent="danger" content="Not joined" />
        )}
      </header>
      {/* <div>{JSON.stringify(studentDetails)}</div> */}
      <article>
        <form>
          <div>
            <label>Student Name</label>
            <input type="text" value={studentDetails.name} />
          </div>
          <div>
            <label>Student Mobile Number</label>
            <input
              type="text"
              readOnly
              value={`+${studentDetails.countryCode} ${studentDetails.phoneNumber}`}
            />
          </div>
          <div>
            <label>Class & Section</label>
            <input
              type="text"
              readOnly
              value={`${studentDetails.classDepartment} ${studentDetails.sectionSemester}`}
            />
          </div>
          <div>
            <label>Gender</label>
            <div className={styles.genderChooser}>
              <span>
                Male
                <input
                  type="radio"
                  checked={studentDetails.gender === 'Male'}
                />
              </span>
              <span>
                Female
                <input
                  type="radio"
                  checked={studentDetails.gender === 'Female'}
                />
              </span>
              <span>
                Others
                <input
                  type="radio"
                  checked={studentDetails.gender === 'Others'}
                />
              </span>
            </div>
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="text" readOnly value={studentDetails.dateOfBirth} />
          </div>
          <div>
            <label>Email ID</label>
            <input type="text" readOnly value={studentDetails.email} />
          </div>
          <div>
            <label>Enrollment number</label>
            <input
              type="text"
              readOnly
              value={studentDetails.enrollmentNumber}
            />
          </div>
          <div>
            <label>Guardian Name </label>
            <input type="text" readOnly value={studentDetails.guardianName} />
          </div>
          <div>
            <label>Guardian Mobile Number</label>
            <input
              type="text"
              readOnly
              value={`+${studentDetails.guardianCountryCode} ${studentDetails.guardianNumber}`}
            />
          </div>
          <div>
            <label>Address</label>
            <input type="text" readOnly value={studentDetails.address} />
          </div>
          <div>
            <label>Pincode</label>
            <input type="text" readOnly value={studentDetails.pincode} />
          </div>
          <div className={styles.deleteBtn + ' clearfix'}>
            <img src={deleteIcon} />
            <div>
              <a>Delete Account</a>
              <span>This will delete the current profile</span>
            </div>
          </div>
        </form>
      </article>
    </section>
  )
}

export default StudentBasicInfo
