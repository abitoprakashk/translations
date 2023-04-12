import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {usePageSettings} from './redux/TemplateGenerator.selectors'
import TemplateGenerator from './TemplateGenerator/TemplateGenerator'
import {templatePageSettingsActions} from './redux/TemplateGenerator.actionTypes'
import PageSetup from './PageSetup/PageSetup'

const TemplateGeneratorWrapper = ({
  panelItems,
  defaultActivePanel,
  redirectURL,
  pageSetupComponent = <PageSetup redirectURL={redirectURL} />,
}) => {
  const {pagesize} = usePageSettings()
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
    }
  }, [])

  return (
    <div className="templateGeneratorPageSetup">
      {pagesize ? (
        <TemplateGenerator
          panelItems={panelItems}
          defaultActivePanel={defaultActivePanel}
        />
      ) : (
        pageSetupComponent
      )}
    </div>
  )
}

export default TemplateGeneratorWrapper
