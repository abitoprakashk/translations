import {t} from 'i18next'
import {DateTime} from 'luxon'
import {Icon} from '@teachmint/common'
import {getUTCDateTimeStamp} from '../../utils/Helpers'
import {sidebarData} from '../../utils/SidebarItems'
import {PERSONA_STATUS} from './ProfileSettings.constant'
import styles from './ProfileSettings.module.css'

// Get BreadCrumb Object
export const getBreadCrumbObject = (props, categoryFieldsData) => {
  let breadCrumbLabel = 'NA'
  breadCrumbLabel = PERSONA_STATUS[props.userType].profileSettingsCrumbLabel

  const breadCrumbObject = [
    {
      label: breadCrumbLabel,
      to: `${sidebarData.PROFILE_SETTINGS.route}/${
        PERSONA_STATUS[props.userType].slug
      }`,
    },
    {
      label: categoryFieldsData.label,
      to: `${sidebarData.PROFILE_SETTINGS.subRoutes[2]}?userType=${props.userType}&category=${categoryFieldsData._id}`,
    },
  ]
  return breadCrumbObject
}

export const getBreadCrumbObjectOld = (props, categoryFieldsData) => {
  let breadCrumbLabel = 'NA'
  if (categoryFieldsData?.setting_type == 1) {
    breadCrumbLabel =
      PERSONA_STATUS[props.userType].profileInformationCrumbLabel
  } else if (categoryFieldsData?.setting_type == 3) {
    breadCrumbLabel = PERSONA_STATUS[props.userType].documnetCrumbLabel
  }

  const breadCrumbObject = [
    {
      label: PERSONA_STATUS[props.userType].label,
      to: `${sidebarData.PROFILE_SETTINGS.route}/${
        PERSONA_STATUS[props.userType].slug
      }`,
    },
    {
      label: breadCrumbLabel,
      to: `${sidebarData.PROFILE_SETTINGS.route}/${
        PERSONA_STATUS[props.userType].slug
      }`,
    },
    {
      label: categoryFieldsData.label,
      to: `${sidebarData.PROFILE_SETTINGS.subRoutes[2]}?userType=${props.userType}&category=${categoryFieldsData._id}`,
    },
  ]
  return breadCrumbObject
}

// Get current date
export const getCurrentDate = () => {
  return DateTime.now().toFormat('yyyy-MM-dd')
}

// Get Role Names
export const getRoleNames = (roles, roles_to_assign, rolesList) => {
  let roleNameArr = []
  let roleIds = roles?.length > 0 ? roles : roles_to_assign
  let role = rolesList?.find((r) => roleIds?.includes(r._id))

  if (role?.name)
    roleNameArr.length >= 1
      ? roleNameArr.push(<span>&#44;&nbsp;{role.name}</span>)
      : roleNameArr.push(<span>{role.name}</span>)
  return role?.name || <span>{t('teacher')}</span>
}

// Get Slider Header Title
export const getSliderHeaderTitle = (headingTitle) => {
  let titleText = headingTitle && headingTitle !== '' ? headingTitle : 'NA'
  return titleText
}

// Get UTC TimeStamp
export const getUTCTimeStamp = (selectedDate) => {
  const passUTCTimeStampParams = {
    year: DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toFormat('yyyy'),
    month: DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toFormat('MM') - 1,
    day: DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toFormat('dd'),
  }
  const getTimeStampValue = getUTCDateTimeStamp(passUTCTimeStampParams)
  return getTimeStampValue
}

export const getDateRangeUTCTimeStamp = (selectedDate) => {
  const passUTCTimeStampParams = {
    year: DateTime.fromJSDate(selectedDate).toFormat('yyyy'),
    month: DateTime.fromJSDate(selectedDate).toFormat('MM'),
    day: DateTime.fromJSDate(selectedDate).toFormat('dd'),
  }
  const getTimeStampValue = getUTCDateTimeStamp(passUTCTimeStampParams)
  return getTimeStampValue
}

// Get Staff Filter collection list
export const newStaffFilterCollectionList = (staffListData, statusValue) => {
  const newStaffListData = staffListData?.map((item) => {
    return {
      ...item,
      status: statusValue,
    }
  })
  return newStaffListData
}

// Get slider header part icon
export const getSliderHeaderIcon = ({
  color,
  name,
  size,
  type,
  className = '',
}) => {
  const iconHTML = (
    <Icon
      color={color}
      name={name}
      size={size}
      type={type}
      className={`${styles.sliderHeaderIcon} ${className}`}
    />
  )
  return iconHTML
}
