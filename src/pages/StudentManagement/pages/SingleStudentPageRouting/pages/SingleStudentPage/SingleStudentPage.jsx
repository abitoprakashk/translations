import {Heading, HEADING_CONSTANTS} from '@teachmint/krayon'
import {useEffect} from 'react'
import {Trans} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {getStudentProfileFeeTabDetailsRequestAction} from '../../../../../../components/SchoolSystem/StudentDirectory/redux/feeAndWallet/actions'
import {checkSubscriptionType} from '../../../../../../utils/Helpers'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {checkPermission} from '../../../../../../utils/Permssions'
import {sidebarData} from '../../../../../../utils/SidebarItems'
import StudentAttendanceCard from '../../../../../AttendanceReport/components/StudentAttendanceCard/StudentAttendanceCard'
import {getDocumentPersonaMemberAction} from '../../../../../DocumentUpload/Redux/DocumentUpload.actions'
import StudentIssuedItemsCard from '../../../../../Inventory/components/StudentIssuedItemsCard/StudentIssuedItemsCard'
import StudentTransportCard from '../../../../../Transport/components/StudentTransportCard/StudentTransportCard'
import DocumentCard from './components/DocumentCard/DocumentCard'
import FeeCard from './components/FeeCard/FeeCard'
import ProfileCard from './components/ProfileCard/ProfileCard'
import styles from './SingleStudentPage.module.css'
import ClassroomLearningCard from './components/ClassroomLearningCard/ClassroomLearningCard'

export default function SingleStudentPage({currentStudent, instituteType}) {
  const dispatch = useDispatch()

  const personaMember = useSelector(
    (store) => store.globalData?.documentPersonaMember?.data
  )

  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission
  )
  const {instituteInfo, sidebar} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)

  const checkFeatureAuthorization = (subModuleId) => {
    const isPremiumFeature = sidebar?.premiumItems?.has(subModuleId)
    const isfeatureAllowed = sidebar?.allowedMenus?.has(subModuleId)

    if (isPremiumFeature) {
      return isPremium && isfeatureAllowed
    } else {
      return isfeatureAllowed
    }
  }

  useEffect(() => {
    if (currentStudent?._id)
      dispatch(getDocumentPersonaMemberAction(currentStudent?._id))
  }, [currentStudent])

  useEffect(() => {
    if (currentStudent) {
      if (
        checkPermission(
          usersPermission,
          PERMISSION_CONSTANTS.feeModuleController_getStudentFeeDetails_read
        ) &&
        isPremium
      ) {
        dispatch(
          getStudentProfileFeeTabDetailsRequestAction(currentStudent?._id)
        )
      }
    }
  }, [currentStudent])

  return (
    <div>
      <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
        <Trans
          i18nKey="singleStudentPageHeading"
          values={{name: currentStudent?.name}}
        />
      </Heading>

      <ProfileCard
        currentStudent={{...currentStudent, ...personaMember}}
        instituteType={instituteType}
      />
      <DocumentCard currentStudent={currentStudent} />

      <div className={styles.overviewCardsWrapper}>
        {checkFeatureAuthorization(sidebarData.CLASSROOM_ATTENDANCE.id) && (
          <StudentAttendanceCard currentStudent={currentStudent} />
        )}

        {checkFeatureAuthorization(sidebarData.FEE_REPORTS.id) && (
          <FeeCard currentStudent={currentStudent} />
        )}

        {checkFeatureAuthorization(sidebarData.CLASSROOM_REPORTS.id) && (
          <ClassroomLearningCard currentStudent={currentStudent} />
        )}

        {checkFeatureAuthorization(sidebarData.TRANSPORT_MANAGEMENT.id) && (
          <StudentTransportCard currentStudent={currentStudent} />
        )}

        {(checkFeatureAuthorization(sidebarData.INVENTORY_MANAGEMENT.id) ||
          checkFeatureAuthorization(sidebarData.LIBRARY_MANAGEMENT.id)) && (
          <StudentIssuedItemsCard
            currentStudent={currentStudent}
            hasInventoryPermission={checkFeatureAuthorization(
              sidebarData.INVENTORY_MANAGEMENT.id
            )}
            hasLibraryPermission={checkFeatureAuthorization(
              sidebarData.LIBRARY_MANAGEMENT.id
            )}
          />
        )}
      </div>
    </div>
  )
}
