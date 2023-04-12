import React from 'react'
import {
  Heading,
  HEADING_CONSTANTS,
  Input,
  PlainCard,
  Checkbox,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'

import {
  EDIT_TEMPLATE_SECTIONS,
  TEMPLATE_SECTIONS_ID,
} from '../../../../../../constants'
import commonStyles from '../../LeftPanel.module.css'
import styles from './CoScholasticBlock.module.css'
import ToggleButtonWrapper from '../ToggleButtonWrapper'
import {events} from '../../../../../../../../../utils/EventsConstants'

const CoScholasticBlock = ({
  renderManageButton,
  data = {},
  objToSave,
  setObjToSave,
  handleChange,
  userEventHandler,
}) => {
  const {t} = useTranslation()

  const handleToggleChange = (obj) => {
    userEventHandler(events.REPORT_CARD_SHOW_IN_REPORTCARD_CLICKED_TFI, {
      header_type: EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC,
      sub_header_type: EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC,
      flag: obj.value ? 'Y' : 'N',
    })
    handleChange(obj)
    let terms = [...objToSave.scholastic.exam_str.children]
    if (obj.value) {
      if (terms.findIndex((item) => item.show_cosch) === -1) {
        terms[0] = {...terms[0], show_cosch: true}
      }
    }
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) =>
        item.meta.template_section_id === TEMPLATE_SECTIONS_ID.CO_SCHOLASTIC
    )
    fetchParams[index] = {
      ...fetchParams[index],
      meta: {...fetchParams[index].meta, show: obj.value},
    }
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: terms},
      },
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const handleTitleChange = (obj) => {
    let tmp = {...data.co_sch_details, [obj.fieldName]: obj.value}
    handleChange({fieldName: 'co_sch_details', value: tmp})
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) =>
        item.meta.template_section_id === TEMPLATE_SECTIONS_ID.CO_SCHOLASTIC
    )
    let paramIndex = fetchParams[index].params.findIndex(
      (item) => item.id === 'co_scholastic_area_title'
    )
    let params = [...fetchParams[index].params]
    params[paramIndex] = {...params[paramIndex], value: obj.value}
    fetchParams[index] = {
      ...fetchParams[index],
      params,
    }
    setObjToSave({
      ...objToSave,
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const handleTermChange = ({value}, index) => {
    let terms = [...objToSave.scholastic.exam_str.children]
    terms[index] = {...terms[index], show_cosch: value}
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: terms},
      },
    })
  }

  const renderTerms = () => {
    return data.exm_str_tree.children.map((term, i) => {
      return (
        <Checkbox
          key={term._id || i}
          classes={{wrapper: commonStyles.checkbox}}
          label={term.name}
          isSelected={term.show_cosch}
          fieldName={term._id}
          handleChange={(obj) => handleTermChange(obj, i)}
        />
      )
    })
  }

  return (
    <div className={commonStyles.accordianContent}>
      <div className={commonStyles.blockHeader}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('basicDetailActivities')}
        </Heading>
        <ToggleButtonWrapper
          fieldName="show_co_scholastic"
          isSelected={data.show_co_scholastic}
          handleChange={handleToggleChange}
        />
      </div>

      <Input
        type="text"
        title="Section name"
        fieldName="co_scholastic_area_title"
        value={data.co_sch_details.co_scholastic_area_title}
        placeholder="Co-scholastic Area"
        onChange={handleTitleChange}
        classes={{wrapper: commonStyles.inputWrapper}}
        maxLength={50}
      />

      <PlainCard className={classNames(commonStyles.blockCard)}>
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {data.co_sch_details.co_scholastic_section_name}
          </Heading>
          {renderManageButton(EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC)}
        </div>
        {data?.left_cosch_data?.length > 1 ||
        data?.right_cosch_data?.length > 1 ? (
          <ul className={commonStyles.list}>
            {data.left_cosch_data.slice(1).map((item) => (
              <li key={item[0]}>{item[0]}</li>
            ))}
            {data.right_cosch_data?.slice(1).map((item) => (
              <li key={item[0]}>{item[0]}</li>
            ))}
          </ul>
        ) : (
          <div className={styles.placeholder}>
            {t('coScholasticActivityPlaceholder')}
          </div>
        )}
      </PlainCard>
      <PlainCard
        className={classNames(
          commonStyles.blockCard,
          commonStyles.flex,
          commonStyles.flexColumn
        )}
      >
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('selectTerm')}
          </Heading>
        </div>
        <div className={classNames(commonStyles.flex, styles.gapL)}>
          {renderTerms()}
        </div>
      </PlainCard>
    </div>
  )
}

export default React.memo(CoScholasticBlock)
