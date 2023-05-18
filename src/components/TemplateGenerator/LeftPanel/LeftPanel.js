import React, {useState} from 'react'
import classNames from 'classnames'
import {ICON_CONSTANTS, Icon} from '@teachmint/krayon'
import styles from './LeftPanel.module.css'
import {useLocation} from 'react-router-dom'
import {eventManagerSelector} from '../../../redux/reducers/CommonSelectors'
import {TEMPLATE_GENERATOR_EVENTS} from '../TemplateGenerator.events'

const LeftPanel = ({panelItems, defaultActivePanel}) => {
  const [activeTab, setActiveTab] = useState(defaultActivePanel)
  const {search} = useLocation()
  const templateType = new URLSearchParams(search).get('templateType')
  const eventManager = eventManagerSelector()

  return (
    <div className={styles.wrappers}>
      <div className={styles.leftPanelHeaderWrapper}>
        <div className={styles.leftPanelHeader}>
          {panelItems &&
            Object.keys(panelItems).map((key) => {
              return (
                <div
                  key={key}
                  className={classNames({
                    [styles.active]: activeTab === key,
                  })}
                  onClick={() => {
                    if (panelItems[key].title) {
                      eventManager.send_event(
                        TEMPLATE_GENERATOR_EVENTS[panelItems[key].eventName],
                        {
                          template_type: templateType,
                        }
                      )
                      setActiveTab(key)
                    }
                  }}
                >
                  {panelItems[key].type === 'ico' ? (
                    <Icon
                      name={panelItems[key].icon}
                      className={styles.icon}
                      size={ICON_CONSTANTS.SIZES.X_SMALL}
                      version={ICON_CONSTANTS.VERSION.OUTLINED}
                    />
                  ) : (
                    <img
                      className={styles.leftPanelImage}
                      src={
                        activeTab === key
                          ? panelItems[key].icon
                          : panelItems[key].iconDark
                      }
                    />
                  )}
                  <span>{panelItems[key].title}</span>
                </div>
              )
            })}
        </div>
      </div>

      <div className={styles.content}>
        {panelItems && panelItems[activeTab].component}
      </div>
    </div>
  )
}

export default LeftPanel
