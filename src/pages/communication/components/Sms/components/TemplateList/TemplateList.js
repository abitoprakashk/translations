import {useSelector} from 'react-redux'
import styles from './TemplateList.module.css'
import {Icon, ICON_CONSTANTS, SearchBar} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

export const TemplateList = ({onTemplateClick}) => {
  const {templates} = useSelector((state) => state.communicationInfo.sms)
  const [templateList, setTemplateList] = useState([])
  const [searchText, setSearchText] = useState('')
  const {t} = useTranslation()
  const renderCompleteList = (arr) => {
    Object.entries(templates).map(([key, value]) => {
      let tempObj = {
        id: key,
        title: value.display_name,
        display_message: value.display_text,
        message: value.text,
      }
      arr.push(tempObj)
    })
  }
  useEffect(() => {
    let templateListArr = []
    renderCompleteList(templateListArr)
    setTemplateList(templateListArr)
  }, [templates])

  const handleSearch = ({value}) => {
    setSearchText(value)
    let tempArr = []
    if (value === '') {
      renderCompleteList(tempArr)
    } else {
      tempArr = templateList.filter((item) => {
        return (
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.display_message.toLowerCase().includes(value.toLowerCase())
        )
      })
    }
    setTemplateList(tempArr)
  }
  const renderTemplates = () => {
    return templateList.map((data) => {
      return (
        <div
          key={data.id}
          className={styles.templateCard}
          onClick={() => onTemplateClick(data)}
        >
          <div className={styles.templateContent}>
            <div className={styles.templateTitle}>{data.title}</div>
            <div className={styles.templateBody}>{data.display_message}</div>
          </div>
          <div className={styles.iconContainer}>
            <Icon
              name="chevronRight"
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
            />
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <SearchBar
          value={searchText}
          placeholder={t('templateSearchPlaceholder')}
          handleChange={handleSearch}
        />
      </div>
      <div className={styles.listContainer}>{renderTemplates()}</div>
    </>
  )
}
