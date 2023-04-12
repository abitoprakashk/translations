import {generatePath, Redirect, useParams} from 'react-router-dom'
import Loader from '../../components/Common/Loader/Loader'
import {CUSTOM_ID_CARD_SUB_ROUTE} from './CustomId.routes'
import {getTemplateListSelector} from './redux/CustomId.selector'

const CustomIdLandingPage = () => {
  const {userType} = useParams()
  const {
    data: templateList,
    isLoading: templateListLoading,
    loaded,
  } = getTemplateListSelector(userType)

  const selectedTemplate = templateList?.find((item) => item.selected)

  return (
    <>
      <Loader show={templateListLoading} />
      {selectedTemplate && (
        <Redirect
          to={generatePath(CUSTOM_ID_CARD_SUB_ROUTE.GENERATE, {
            userType: userType,
            templateId: selectedTemplate._id,
            isDefault: selectedTemplate.default,
          })}
        />
      )}
      {!selectedTemplate && loaded && (
        <Redirect
          to={generatePath(CUSTOM_ID_CARD_SUB_ROUTE.OVERVIEW, {
            userType: userType,
          })}
        />
      )}
    </>
  )
}

export default CustomIdLandingPage
