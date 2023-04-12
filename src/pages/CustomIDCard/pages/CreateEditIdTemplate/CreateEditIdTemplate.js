import React from 'react'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useParams} from 'react-router-dom'
import Loader from '../../../../components/Common/Loader/Loader'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {usePageSettings} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.selectors'
import globalActions from '../../../../redux/actions/global.actions'
import IdTemplateCreator from '../../components/IdTemplateCreator/IdTemplateCreator'
import PageSetupIdCard from '../../components/PageSetupIdCard/PageSetupIdCard'
import {CUSTOM_ID_CARD_ROOT_ROUTE} from '../../CustomId.routes'
import {customIdTemplateDetailsSelector} from '../../redux/CustomId.selector'

const CreateEditIdTemplate = () => {
  const {templateId, isDefault} = useParams()
  const dispatch = useDispatch()
  const {pagesize} = usePageSettings()
  const {isLoading} = customIdTemplateDetailsSelector()

  useEffect(() => {
    if (templateId)
      dispatch(
        globalActions.customIdTemplateDetails.request({
          id: templateId,
          isDefault: isDefault,
        })
      )
    return () => {
      dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
    }
  }, [])

  return (
    <div className="createTemplateContainer">
      <Loader show={isLoading} />
      {!pagesize && !isLoading && (
        <PageSetupIdCard redirectURL={CUSTOM_ID_CARD_ROOT_ROUTE} />
      )}

      {pagesize && <IdTemplateCreator />}
    </div>
  )
}

export default CreateEditIdTemplate
