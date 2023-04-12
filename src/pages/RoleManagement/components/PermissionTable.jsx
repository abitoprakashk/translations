import React from 'react'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Accordion, Icon, Toggle} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import {parsePermissionMap} from '../utils/permissionMap.utils'
import classname from 'classnames'
import {ACCESS_LEVEL_ENUM} from '../constant/constant'
import globalActions from '../../../redux/actions/global.actions'
import {isMobile} from '@teachmint/krayon'
import Loader from '../../../components/Common/Loader/Loader'

export default function PermissionTable({
  type = 'view',
  selectedPermissionMap = {},
  setSelectedPermissionMap,
}) {
  const dispatch = useDispatch()
  const isMWeb = isMobile()

  const [selectedIndex, setSelectedIndex] = useState(null)
  const {loaded, isLoading} = useSelector(
    (state) => state?.globalData?.getPermissionMap
  )

  useEffect(() => {
    if (!loaded) {
      dispatch(
        globalActions?.getPermissionMap?.request(null, (response) => {
          return parsePermissionMap(response)
        })
      )
    }
  }, [])

  return isMWeb ? (
    <>
      <Loader show={isLoading} />
      <PermissionListMWeb selectedPermissionMap={selectedPermissionMap} />
    </>
  ) : (
    <>
      <Loader show={isLoading} />
      <div className={styles.permissionTable}>
        <SidebarItems
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
        <PermissionBox
          type={type}
          selectedIndex={selectedIndex}
          selectedPermissionMap={selectedPermissionMap}
          setSelectedPermissionMap={setSelectedPermissionMap}
        />
      </div>
    </>
  )
}

function SidebarItems({selectedIndex, setSelectedIndex}) {
  const sidebarItems = useSelector(
    (state) => state?.globalData?.getPermissionMap?.data?.moduleList
  )
  const lang = useSelector((state) => state?.adminInfo?.lang || 'en')

  useEffect(() => {
    if (sidebarItems) {
      setSelectedIndex(sidebarItems?.[0]?._id)
    }
  }, [sidebarItems])

  return (
    <div className={styles.sidebar}>
      {sidebarItems?.map((item) => (
        <div
          key={item._id}
          onClick={() => {
            setSelectedIndex(item._id)
          }}
          className={classname(
            styles.sidebarItem,
            item._id === selectedIndex ? styles.sidebarActive : ''
          )}
        >
          {item?.name?.[lang]}
          <Icon
            name="forwardArrow"
            type={item._id === selectedIndex ? 'inverted' : 'basic'}
            size={'xxx_s'}
          />
        </div>
      ))}
    </div>
  )
}
function PermissionBox({
  type,
  selectedIndex,
  selectedPermissionMap,
  setSelectedPermissionMap,
}) {
  const subModuleList = useSelector(
    (state) =>
      state?.globalData?.getPermissionMap?.data?.subModuleMap?.[selectedIndex]
  )

  return (
    <div className={styles.permissionBox}>
      <div className={styles.subModuleWrapper}>
        {subModuleList?.map((subModule) => (
          <PermissionOption
            key={subModule._id}
            subModule={subModule}
            type={type}
            selectedIndex={selectedIndex}
            selectedPermissionMap={selectedPermissionMap}
            setSelectedPermissionMap={setSelectedPermissionMap}
          />
        ))}
      </div>
    </div>
  )
}

function PermissionOption({
  subModule,
  type,
  selectedPermissionMap,
  setSelectedPermissionMap,
}) {
  const {t} = useTranslation()
  const [accessLevel, setAccessLevel] = useState(
    selectedPermissionMap[subModule?._id]
  )
  const lang = useSelector((state) => state?.adminInfo?.lang || 'en')

  useEffect(() => {
    setAccessLevel(selectedPermissionMap[subModule?._id])
  }, [selectedPermissionMap])

  const handleViewOnly = (e) => {
    // view toggle ON
    if (e.value === true) {
      setAccessLevel(ACCESS_LEVEL_ENUM.VIEW_ONLY)
      selectedPermissionMap[subModule?._id] = ACCESS_LEVEL_ENUM.VIEW_ONLY
      if (
        subModule?._id === 'SCHOOL_SETUP' &&
        selectedPermissionMap['STUDENT_DIRECTORY'] !== ACCESS_LEVEL_ENUM.MANAGE
      ) {
        selectedPermissionMap['STUDENT_DIRECTORY'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        selectedPermissionMap['TEACHER_DIRECTORY'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
      if (
        subModule?._id === 'STUDENT_DIRECTORY' ||
        subModule?._id === 'TEACHER_DIRECTORY'
      ) {
        selectedPermissionMap['STUDENT_DIRECTORY'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        selectedPermissionMap['TEACHER_DIRECTORY'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
      if (
        subModule?._id === 'FEE_COLLECTION' ||
        subModule?._id === 'FEE_CONFIGURATION'
      ) {
        selectedPermissionMap['FEE_COLLECTION'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        selectedPermissionMap['FEE_CONFIGURATION'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        selectedPermissionMap['FEE_REPORTS'] = ACCESS_LEVEL_ENUM.VIEW_ONLY
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
    }
    // view toggle OFF
    else {
      setAccessLevel(ACCESS_LEVEL_ENUM.NONE)
      selectedPermissionMap[subModule?._id] = ACCESS_LEVEL_ENUM.NONE

      if (
        subModule?._id === 'STUDENT_DIRECTORY' ||
        subModule?._id === 'TEACHER_DIRECTORY'
      ) {
        selectedPermissionMap['SCHOOL_SETUP'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['STUDENT_DIRECTORY'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['TEACHER_DIRECTORY'] = ACCESS_LEVEL_ENUM.NONE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }

      if (
        subModule?._id === 'FEE_COLLECTION' ||
        subModule?._id === 'FEE_CONFIGURATION'
      ) {
        selectedPermissionMap['FEE_COLLECTION'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['FEE_CONFIGURATION'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['FEE_REPORTS'] = ACCESS_LEVEL_ENUM.NONE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
      if (subModule?._id === 'FEE_REPORTS') {
        selectedPermissionMap['FEE_COLLECTION'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['FEE_CONFIGURATION'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['FEE_REPORTS'] = ACCESS_LEVEL_ENUM.NONE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
    }
  }
  const handleManage = (e) => {
    // manage toggle ON
    if (e.value === true) {
      setAccessLevel(ACCESS_LEVEL_ENUM.MANAGE)
      selectedPermissionMap[subModule?._id] = ACCESS_LEVEL_ENUM.MANAGE
      if (subModule?._id === 'SCHOOL_SETUP') {
        selectedPermissionMap['STUDENT_DIRECTORY'] = ACCESS_LEVEL_ENUM.MANAGE
        selectedPermissionMap['TEACHER_DIRECTORY'] = ACCESS_LEVEL_ENUM.MANAGE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }

      if (
        subModule?._id === 'STUDENT_DIRECTORY' ||
        subModule?._id === 'TEACHER_DIRECTORY'
      ) {
        selectedPermissionMap['STUDENT_DIRECTORY'] = ACCESS_LEVEL_ENUM.MANAGE
        selectedPermissionMap['TEACHER_DIRECTORY'] = ACCESS_LEVEL_ENUM.MANAGE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }

      if (
        subModule?._id === 'FEE_COLLECTION' ||
        subModule?._id === 'FEE_CONFIGURATION'
      ) {
        selectedPermissionMap['FEE_COLLECTION'] = ACCESS_LEVEL_ENUM.MANAGE
        selectedPermissionMap['FEE_CONFIGURATION'] = ACCESS_LEVEL_ENUM.MANAGE
        selectedPermissionMap['FEE_REPORTS'] = ACCESS_LEVEL_ENUM.VIEW_ONLY // there is no manage for FEE_REPORTS
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
    }
    // manage toggle OFF
    else {
      setAccessLevel(ACCESS_LEVEL_ENUM.NONE)
      selectedPermissionMap[subModule?._id] = ACCESS_LEVEL_ENUM.NONE

      if (
        subModule?._id === 'STUDENT_DIRECTORY' ||
        subModule?._id === 'TEACHER_DIRECTORY'
      ) {
        selectedPermissionMap['SCHOOL_SETUP'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['STUDENT_DIRECTORY'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['TEACHER_DIRECTORY'] = ACCESS_LEVEL_ENUM.NONE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }

      if (
        subModule?._id === 'FEE_COLLECTION' ||
        subModule?._id === 'FEE_CONFIGURATION'
      ) {
        selectedPermissionMap['FEE_COLLECTION'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['FEE_CONFIGURATION'] = ACCESS_LEVEL_ENUM.NONE
        selectedPermissionMap['FEE_REPORTS'] = ACCESS_LEVEL_ENUM.NONE
        setSelectedPermissionMap((oldState) => ({...oldState}))
      }
    }
  }
  return (
    <div className={styles.subModuleDiv}>
      <div className={styles.subModuleHeading}>{subModule?.name?.[lang]}</div>
      <div className={styles.subModulePara}>{subModule?.description}</div>
      <div className={styles.toggleDiv}>
        <div className={styles.flex}>
          <Toggle
            isDisabled={
              type === 'view' ||
              accessLevel === ACCESS_LEVEL_ENUM.MANAGE ||
              subModule?.view_disabled
            }
            isSelected={
              accessLevel === ACCESS_LEVEL_ENUM.VIEW_ONLY ||
              accessLevel === ACCESS_LEVEL_ENUM.MANAGE
            }
            handleChange={handleViewOnly}
            classes={{wrapper: styles.toggle}}
          />
          <div className={styles.toggleTitle}>
            {t('roleManagement.allowViewOnly')}
          </div>
        </div>
        <div className={styles.flex}>
          <Toggle
            isDisabled={type === 'view' || subModule?.manage_disabled}
            isSelected={accessLevel === ACCESS_LEVEL_ENUM.MANAGE}
            handleChange={handleManage}
            classes={{wrapper: styles.toggle}}
          />
          <div className={styles.toggleTitle}>
            {t('roleManagement.allowManage')}
          </div>
        </div>
      </div>
    </div>
  )
}

// for mobile
function PermissionListMWeb({selectedPermissionMap}) {
  const moduleList = useSelector(
    (state) => state?.globalData?.getPermissionMap?.data?.moduleList
  )
  const allSubModuleList = useSelector(
    (state) => state?.globalData?.getPermissionMap?.data?.subModuleMap
  )
  const lang = useSelector((state) => state?.adminInfo?.lang || 'en')

  return (
    <div className={styles.permissionBoxMWeb}>
      {moduleList?.map((module) => (
        <Accordion
          key={module?._id}
          headerContent={<div>{module?.name?.[lang]}</div>}
          allowHeaderClick={true}
          classes={{
            accordionWrapper: styles.accordionWrapper,
            accordionHeader: styles.accordionHeader,
            accordionBody: styles.accordionBody,
          }}
        >
          <div>
            {allSubModuleList?.[module?._id]?.map((subModule) => (
              <PermissionOption
                key={subModule._id}
                subModule={subModule}
                type="view"
                selectedIndex={module?._id}
                selectedPermissionMap={selectedPermissionMap}
              />
            ))}
          </div>
        </Accordion>
      ))}
    </div>
  )
}
