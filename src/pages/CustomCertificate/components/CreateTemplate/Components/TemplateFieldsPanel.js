import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import TemplateFields from '../../../../../components/TemplateGenerator/LeftPanel/Components/TemplateFields/TemplateFields'
import {useEditorRef} from '../../../../../components/TemplateGenerator/redux/TemplateGenerator.selectors'
import {STATIC} from '../../../../../components/TemplateGenerator/TemplateGenerator.constants'
import {eventManagerSelector} from '../../../../../redux/reducers/CommonSelectors'
import {templateFieldsSelector} from '../../../redux/CustomCertificate.selectors'
import {
  getSearchTemplateFields,
  getUpdateSearchFiltersList,
} from './TemplateFieldsPanel.utils'

const TemplateFieldsPanel = ({userType, showCustomFields}) => {
  const editorRef = useEditorRef()
  const templateFields = templateFieldsSelector()
  const insertFieldInTemplate = (
    e,
    {id, value, name, type, category, isImage}
  ) => {
    if (isImage)
      editorRef.addImage({
        url: value,
        id,
        name,
        category,
        isDynamic: type != STATIC,
      })
    else if (type === STATIC) editorRef.addText({id, value, name, category})
    else editorRef?.addDynamicField({id, value, name, category})
  }

  const {search} = useLocation()
  const templateType = new URLSearchParams(search).get('templateType')
  const eventManager = eventManagerSelector()
  const [searchText, setSearchText] = useState('')
  const [searchFilterFieldsList, setSearchFilterFieldsList] = useState([])

  const triggerEvent = (eventName, data) => {
    eventManager.send_event(eventName, {
      template_type: templateType,
      ...data,
    })
  }

  const searchTemplateFields = getSearchTemplateFields(templateFields[userType])

  const searchHandler = (e) => {
    setSearchText(e.value)
  }

  useEffect(() => {
    if (searchText?.trim().length > 0) {
      const updateSearchFiltersList = getUpdateSearchFiltersList(
        searchText,
        searchTemplateFields
      )
      setSearchFilterFieldsList(updateSearchFiltersList)
    } else {
      setSearchFilterFieldsList([])
    }
  }, [searchText])

  return (
    <TemplateFields
      onFieldClick={insertFieldInTemplate}
      templateFields={templateFields[userType]}
      triggerEvent={triggerEvent}
      showCustomFields={showCustomFields}
      onChangeSearchHandler={searchHandler}
      searchText={searchText}
      searchFilterFieldsList={searchFilterFieldsList}
    />
  )
}

export default TemplateFieldsPanel
