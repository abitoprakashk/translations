import {t} from 'i18next'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouteMatch} from 'react-router-dom'
import history from '../../../../../../../../history'
import {events} from '../../../../../../../../utils/EventsConstants'
import DocumentFields from '../../../../../../../DocumentUpload/Components/DocumentFields/DocumentFields'
import {getDocumentPersonaMemberAction} from '../../../../../../../DocumentUpload/Redux/DocumentUpload.actions'
import {make_document_hierarchy} from '../../../../../../../DocumentUpload/utils/helperFunctions'
import SectionOverviewCard from '../../../../../../components/SectionOverviewCard/SectionOverviewCard'
import {SINGLE_STUDENT_DOCUMENTS_ROUTE} from '../../../../SingleStudentPageRouting'
import styles from './DocumentCard.module.css'

export default function DocumentCard({currentStudent}) {
  const dispatch = useDispatch()

  let {url} = useRouteMatch()

  const eventManager = useSelector((state) => state.eventManager)
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

  if (currentStudent && documentSettings?.length > 0)
    return (
      <SectionOverviewCard
        cardLabel={t('documents')}
        icon="folderOpen"
        actionLabel={t('view')}
        actionHandle={() => {
          eventManager.send_event(events.SIS_VIEW_DOCUMENT_CLICKED_TFI)
          history.push(`${url}${SINGLE_STUDENT_DOCUMENTS_ROUTE}`)
        }}
        classes={{
          wrapper: styles.wrapper,
          iconFrame: styles.iconFrame,
          body: styles.bodyWrapper,
        }}
      >
        <div className={styles.body}>
          {[]
            .concat(...documentSettings?.map(({fields}) => fields))
            ?.slice(0, 4)
            ?.map((documentItem) => (
              <DocumentFields
                key={documentItem?._id}
                field={documentItem}
                isFieldInMember={
                  documentPersonaMember?.[documentItem?.key_id] ? true : false
                }
                personaMember={documentPersonaMember}
                persona="STUDENT"
                screenName={'profileOverviewPage'}
              />
            ))}
        </div>
      </SectionOverviewCard>
    )
  return null
}
