import {
  Button,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {INSTITUTE_MEMBER_TYPE} from '../../../../../../constants/institute.constants'
import history from '../../../../../../history'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../../../redux/actions/commonAction'
import {
  instituteStudentListAction,
  studentListLoadingAction,
} from '../../../../../../redux/actions/instituteInfoActions'
import {utilsGetUsersList} from '../../../../../../routes/dashboard'
import {sidebarData} from '../../../../../../utils/SidebarItems'
import DocumentFields from '../../../../../DocumentUpload/Components/DocumentFields/DocumentFields'
import {getDocumentPersonaMemberAction} from '../../../../../DocumentUpload/Redux/DocumentUpload.actions'
import {make_document_hierarchy} from '../../../../../DocumentUpload/utils/helperFunctions'
import styles from './DocumentsPage.module.css'

export default function DocumentsPage({currentStudent}) {
  const dispatch = useDispatch()

  const documentPersonaMember = useSelector(
    (store) => store.globalData?.documentPersonaMember?.data
  )
  const institutePersonaSettings = useSelector(
    (store) => store?.globalData?.institutePersonaSettings
  )
  const documentSettings = make_document_hierarchy(
    institutePersonaSettings?.data
  )

  useEffect(() => {
    if (currentStudent?._id)
      dispatch(getDocumentPersonaMemberAction(currentStudent?._id))
  }, [currentStudent])

  const getInstituteStudents = () => {
    dispatch(studentListLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        dispatch(studentListLoadingAction(false))
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div>
      {institutePersonaSettings && documentSettings?.length > 0 ? (
        documentSettings?.map((documentSection) => (
          <div
            className={styles.documentsItemWrapper}
            key={documentSection?._id}
          >
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {documentSection?.label}
            </Heading>

            <div className={styles.documentItemWrapper}>
              {documentSection?.fields?.map((documentItem) => (
                <DocumentFields
                  key={documentItem?._id}
                  field={documentItem}
                  isFieldInMember={
                    documentPersonaMember?.[documentItem?.key_id] ? true : false
                  }
                  personaMember={documentPersonaMember}
                  persona="STUDENT"
                  successAction={getInstituteStudents}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          iconName="viewQuilt"
          content={
            <div>
              <Para>{t('studentDocumentEmptyDesc')}</Para>
              <Button
                onClick={() =>
                  history.push(`${sidebarData.PROFILE_SETTINGS.route}/student`)
                }
                classes={{button: styles.emptyButtonWrapper}}
              >
                {t('setupDocuments')}
              </Button>
            </div>
          }
          button={null}
          classes={{wrapper: styles.emptyStateWrapper}}
        />
      )}
    </div>
  )
}
