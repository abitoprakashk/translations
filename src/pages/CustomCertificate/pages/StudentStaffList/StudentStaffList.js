import React, {useEffect} from 'react'
import {HeaderTemplate} from '@teachmint/krayon'
import {
  CERTIFICATE,
  DOCUMENT,
  DOC_CATEGORIES,
} from '../../CustomCertificate.constants'
import {useParams, generatePath, useHistory} from 'react-router-dom'
import styles from './StudentStaffList.module.css'
import {
  templateListSelector,
  templateDetailsSelector,
} from '../../redux/CustomCertificate.selectors'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../redux/actions/global.actions'
import {useTranslation} from 'react-i18next'
import {
  CUSTOM_CERTIFICATE_ROUTE,
  CUSTOM_CERTIFICATE_SUB_ROUTES,
} from '../../CustomCertificates.routes'
import UserListAndFilters from '../../components/UserListAndFilters/UserListAndFilters'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import Loader from '../../../../components/Common/Loader/Loader'

const StudentStaffList = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const history = useHistory()

  const {userType, templateId} = useParams()
  const templateList = templateListSelector()
  const {data: templateDetails, isLoading} = templateDetailsSelector()

  useEffect(() => {
    if (templateList[userType]?.length) {
      const selectedTemplate = templateList[userType]?.find(
        (item) => item._id == templateId
      )
      const isDefault = selectedTemplate?.default || false
      if (templateId && typeof isDefault === 'boolean')
        dispatch(
          globalActions.templateDetails.request({
            id: templateId,
            isDefault,
          })
        )
      else history.push(CUSTOM_CERTIFICATE_ROUTE)
    }
    return () => {
      dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
      dispatch(globalActions.templateDetails.reset())
    }
  }, [templateList])

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }

  return (
    <div className={styles.wrapper}>
      <Loader show={isLoading} />
      <HeaderTemplate
        mainHeading={`${t('customCertificate.generate')} ${
          templateDetails?.template?.name
        }`}
        breadcrumbObj={{
          className: '',
          paths: [
            {
              label: t('customCertificate.docsAndCertificatesHeading'),
              to: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
                userType,
              }),
              onClick: (e) => {
                handleRouteSelection(
                  e,
                  generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
                    userType,
                  })
                )
              },
            },
            {
              label:
                DOC_CATEGORIES[
                  templateDetails?.default ? CERTIFICATE : DOCUMENT
                ].pageHeader,
              to: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.ALL_TYPES_DOC, {
                userType,
                type: templateDetails?.default
                  ? CERTIFICATE.toLowerCase()
                  : DOCUMENT.toLowerCase(),
              }),
              onClick: (e) => {
                handleRouteSelection(
                  e,
                  generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.ALL_TYPES_DOC, {
                    userType,
                    type: templateDetails?.default
                      ? CERTIFICATE.toLowerCase()
                      : DOCUMENT.toLowerCase(),
                  })
                )
              },
            },
            {
              label: templateDetails?.template?.name,
            },
          ],
        }}
      />
      <UserListAndFilters />
    </div>
  )
}

export default StudentStaffList
