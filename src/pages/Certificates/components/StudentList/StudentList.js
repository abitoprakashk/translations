import React, {useState} from 'react'
import {
  CERTIFICATE_LABELS,
  STUDENT_DIRECTORY_COL,
  certificateTypeMap,
} from '../../Certificates.constants'
import s from '../../Certificates.module.css'
import {Button, Table} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import SearchBox from '../../../../components/Common/SearchBox/SearchBox'
import {Redirect} from 'react-router'
import {
  // CertificateActions,
  StudentProfileDataActions,
} from '../../redux/actionTypes'
import {useEffect} from 'react'
import BreadCrumbWrapper from '../BreadCrumb/BreadCrumbWrapper'
import history from '../../../../history'
import {sidebarData} from '../../../../utils/SidebarItems'
import {getScreenWidth} from '../../../../utils/Helpers'
import defaultStudentImage from '../../../../assets/images/dashboard/empty-student.png'
import defaultUserImage from '../../../../assets/images/icons/user-profile.svg'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {events} from '../../../../utils/EventsConstants'
import {searchBoxFilter} from '../../../../utils/Helpers'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const StudentList = () => {
  const dispatch = useDispatch()
  const {
    instituteInfo,
    instituteStudentList,
    certificate: {
      certificateData: {selectedType},
    },
    eventManager,
  } = useSelector((state) => state)

  const [filters, setFilter] = useState({
    string: '',
    classes: [],
  })
  const [redirect, setRedirect] = useState(null)

  useEffect(() => {
    if (!selectedType) setRedirect('/institute/dashboard/certificate')
  }, [])

  const getStudentInfo = (item) => {
    const {name, phone_number, email, enrollment_number} = item
    const fullName = `${name} `
    // ${last_name ? last_name : ''}`
    return (
      <div className="flex items-center">
        <img
          src={defaultUserImage}
          alt=""
          className="w-9 h-9 lg:w-11 lg:h-11 mr-2 cover rounded-full"
        ></img>
        <div className={`w-full py-4 pr-4`}>
          <p className="tm-color-blue" title={fullName}>
            {fullName.length > 50
              ? fullName.substring(0, 49) + '...'
              : fullName}
          </p>
          <p className="tm-para tm-para-14 mt-2">
            {enrollment_number || phone_number?.split('-')[1] || email}
          </p>
        </div>
      </div>
    )
  }

  const getRowData = () => {
    if (
      Object.values(filters).every(
        (x) => (Array.isArray(x) && x.length == 0) || x === ''
      )
    ) {
      return instituteStudentList
        .filter(
          (item) =>
            item.verification_status === 1 || item.verification_status === 2
        )
        .map((item) => {
          return {
            name: <div className={s.student_col}>{getStudentInfo(item)}</div>,
            enrollmentId: item?.enrollment_number || 'NA',

            class: item?.classroom || 'NA',
            action: (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.certificateController_createRoute_create
                }
              >
                <Button
                  onClick={() => handleGenerateClick(item)}
                  size="medium"
                  type="border"
                >
                  Generate
                </Button>
              </Permission>
            ),
          }
        })
    } else {
      let searchParams = [['name'], ['classroom'], ['phone_number'], ['email']]
      const res = searchBoxFilter(
        filters.string,
        instituteStudentList,
        searchParams
      ).filter((item) => {
        if (item.verification_status === 1 || item.verification_status === 2)
          return item
        else return false
      })

      return res.map((item) => {
        return {
          name: <div className={s.student_col}>{getStudentInfo(item)}</div>,
          enrollmentId: (
            <span className={s.enrollment_col}>
              {item?.enrollment_number || 'NA'}
            </span>
          ),
          class: item?.classroom || 'NA',
          action: (
            <button
              onClick={() => handleGenerateClick(item)}
              className="tm-btn2-white-blue"
            >
              Generate
            </button>
          ),
        }
      })
    }
  }

  const handleGenerateClick = async (data) => {
    eventManager.send_event(events.PROCEED_CLICKED_TFI, {
      screen_name: 'generate_certificate',
      certificate_type: certificateTypeMap[selectedType],
    })
    dispatch({
      type: StudentProfileDataActions.FETCH_CERTIFICATE_STUDENT_DATA_REQUEST,
      payload: {instituteId: instituteInfo._id, imember_id: data._id},
    })
    // dispatch({
    //   type: CertificateActions.SET_STUDENT_INFO,
    //   payload: {...data, class_room: data.classroom},
    // })
    setRedirect('create')
  }

  const handleSearchFilter = (value) => {
    setFilter({...filters, string: value})
  }

  const noDataAction = () => {
    if (instituteInfo?.hierarchy_id)
      history.push(sidebarData.STUDENT_DIRECTORY.route)
  }

  if (redirect) return <Redirect push to={redirect} />
  return (
    <div className={s.wrapper}>
      <div>
        {getScreenWidth() > 700 && (
          <BreadCrumbWrapper selectedType={selectedType} selectedStudent={{}} />
        )}
        <h1 className="tm-hdg tm-hdg-24 mt-2">
          {CERTIFICATE_LABELS.GENERATE_CERTIFICATE}
        </h1>
        <div className="tm-para tm-para-14">
          To proceed select the students who will receive this certificate
        </div>
      </div>
      <div className={s.container}>
        <div className={s.searchWrapper}>
          <SearchBox
            value={filters.string}
            placeholder="Search by student name, class..."
            handleSearchFilter={handleSearchFilter}
          />
        </div>
        <div className={s.table_container}>
          {instituteStudentList.length ? (
            <Table cols={STUDENT_DIRECTORY_COL} rows={getRowData()} />
          ) : (
            <div className="bg-white rounded-lg w-full mt-6 h-screen pt-20 px-6">
              <EmptyScreenV1
                image={defaultStudentImage}
                title="Start adding students to your institute"
                desc="There are no students in your institute right now, once students are added, they will appear here"
                btnText="Go to Student Directory"
                handleChange={noDataAction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentList
