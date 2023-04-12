import React, {useEffect, useMemo, useState} from 'react'
import Loader from '../../components/Common/Loader/Loader'
import {PROFILE_TYPE, Report as App} from '@teachmint/classroom-report'
import '@teachmint/classroom-report/lib/index.esm.css'
import {
  getAdminSpecificFromLocalStorage,
  getFromSessionStorage,
} from '../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../constants/institute.constants'

import UseInstituteHeirarchy from './hooks/UseInstituteHeirarchy'
import {getCurrentAcademicSessionId} from '../../utils/apis.utils'
const {REACT_APP_API_URL} = process.env

export default function ClassroomReports() {
  const [bootstrapped, setbootstrapped] = useState(false)

  const [getAllclass, allClass, hasClass] = UseInstituteHeirarchy()

  const uuid = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)

  const activeAcademicSessionId = getCurrentAcademicSessionId(
    BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID
  )
  const getInstituteId = () => {
    return getAdminSpecificFromLocalStorage(
      BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID
    )
  }
  const apiData = {
    BASEURL: REACT_APP_API_URL,
    headers: {
      'fetch-user': uuid,
      'x-academicsessionid': activeAcademicSessionId,
      'X-InstituteId': getInstituteId(),
    },
  }

  const options = useMemo(() => {
    const json = {
      profile: PROFILE_TYPE.ADMIN,

      classInfo: {
        noClassPresent: !hasClass,
      },
      userData: {},
      allClass: allClass,
    }

    json.classInfo = {
      ...json.classInfo,
      ...json.allClass?.[0],
    }
    if (json?.allClass?.[0]?.sections?.[0]?.subjects?.[0]) {
      json.classInfo = {
        ...json.classInfo,
        ...json.allClass[0].sections[0].subjects[0],
      }
    }

    return json
  }, [allClass, hasClass])

  useEffect(() => {
    getAllclass()
  }, [])

  useEffect(() => {
    if (allClass) {
      setbootstrapped(true)
    }
  }, [allClass])

  const renderUI = () => {
    return (
      <>
        {!bootstrapped ? (
          <Loader show />
        ) : (
          <App apiData={apiData} options={options} />
        )}
      </>
    )
  }

  return renderUI()
}
