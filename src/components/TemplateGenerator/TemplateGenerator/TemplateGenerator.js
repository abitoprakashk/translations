import React from 'react'
import LeftPanel from '../LeftPanel/LeftPanel'
import TemplateHtmlEditor from '../TemplateHTMLEditor/TemplateHtmlEditor'
import styles from './TemplateGenerator.module.css'
const TemplateGenerator = ({panelItems, defaultActivePanel}) => {
  return (
    <div className={styles.templateEditor}>
      <LeftPanel
        panelItems={panelItems}
        defaultActivePanel={defaultActivePanel}
      />
      <div className={styles.editorWrapper}>
        <TemplateHtmlEditor />
      </div>
    </div>
  )
}

export default TemplateGenerator
