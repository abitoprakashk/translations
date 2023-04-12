import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {generatePath, useParams, useHistory} from 'react-router-dom'
import globalActions from '../../../../redux/actions/global.actions'
import GeneratedDocumentsTable from '../../components/GeneratedDocumentsTable/GeneratedDocumentsTable'
import styles from './GeneratedDocuments.module.css'
import {HeaderTemplate} from '@teachmint/krayon'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {useTranslation} from 'react-i18next'
import {generatedDocumentsListSelector} from '../../redux/CustomCertificate.selectors'
import Loader from '../../../../components/Common/Loader/Loader'

const GeneratedDocuments = () => {
  const {userType} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {data: generatedDocumentsList, isLoading} =
    generatedDocumentsListSelector()

  useEffect(() => {
    dispatch(
      globalActions.generatedDocuments.request({
        c: parseInt(+new Date() / 1000),
        userType: userType.toUpperCase(),
        count: 500,
      })
    )
  }, [])

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }

  return (
    <div className={styles.wrapper}>
      <Loader show={isLoading} />
      <HeaderTemplate
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
              label: t('customCertificate.recentlyGenerated'),
            },
          ],
        }}
        mainHeading={t('customCertificate.recentlyGenerated')}
      />
      <GeneratedDocumentsTable rows={generatedDocumentsList} />
    </div>
  )
}

export default GeneratedDocuments
