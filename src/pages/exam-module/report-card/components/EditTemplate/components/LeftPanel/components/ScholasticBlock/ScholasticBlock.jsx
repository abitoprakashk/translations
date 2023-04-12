import {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Heading,
  HEADING_CONSTANTS,
  Input,
  Checkbox,
  Para,
  PARA_CONSTANTS,
  Divider,
} from '@teachmint/krayon'
import classNames from 'classnames'
import commonStyles from './../../LeftPanel.module.css'
import styles from './ScholasticBlock.module.css'
import {
  EDIT_TEMPLATE_SECTIONS,
  GRADE_VISIBLITY_OPTIONS,
  SCHOLASTIC_BLOCKS,
  TEMPLATE_SECTIONS_ID,
} from '../../../../../../constants'
import ExamStructure from './components/ExamStructure/ExamStructure'
import Grades from './components/Grades'
import {SESSION_RESULT_WIDTH} from '../../../../utils'
import ToggleButtonWrapper from '../ToggleButtonWrapper'
import {events} from '../../../../../../../../../utils/EventsConstants'

const ScholasticBlock = ({
  renderManageButton,
  data,
  handleChange,
  objToSave,
  setObjToSave,
  setDisablePublish,
  userEventHandler,
}) => {
  //   const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    if (!data.grade_enabled) {
      let fetchParams = [...objToSave.template.fetch_params]
      let index = fetchParams.findIndex(
        (sec) => sec.method_name === 'calculate_student_marks'
      )
      let params = [...fetchParams[index].params]
      let paramIndex = params.findIndex((par) => par.id === 'overall_grade')
      params[paramIndex] = {...params[paramIndex], checked: false}
      fetchParams[index] = {...fetchParams[index], params}
      setObjToSave({
        ...objToSave,
        template: {...objToSave.template, fetch_params: fetchParams},
      })
    }
  }, [data.grade_enabled])

  const handleTitleChange = (obj) => {
    handleChange(obj)
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) =>
        item.meta.template_section_id === TEMPLATE_SECTIONS_ID.SCHOLASTIC
    )
    let params = [...fetchParams[index].params]
    let paramIndex = params.findIndex(
      (item) => item.id === 'scholastic_area_title'
    )
    params[paramIndex] = {...params[paramIndex], value: obj.value}
    fetchParams[index] = {...fetchParams[index], params: params}
    setObjToSave({
      ...objToSave,
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const handleTermWeightageChange = ({value}, index) => {
    let exmStruct = {...data.exm_str_tree}
    let terms = [...exmStruct.children]
    if (value > 100 || value < 0) {
      setDisablePublish(true)
    } else {
      setDisablePublish(false)
    }
    terms[index] = {...terms[index], weightage: value}
    handleChange({
      fieldName: 'exm_str_tree',
      value: {...exmStruct, children: terms},
    })
    let exmStructObj = {...objToSave.scholastic.exam_str}
    let termsArr = [...exmStructObj.children]
    termsArr[index] = {...termsArr[index], weightage: value}
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: termsArr},
      },
    })
  }

  const renderSubjects = () => {
    return data.exm_str_tree.subject_map.map((item) => {
      return item.checked ? (
        <li key={item.id}>
          <div>{item.label}</div>
        </li>
      ) : null
    })
  }

  const renderExamTypes = () => {
    let arr = data.exm_str_tree.exam_types.filter((item) => item.checked)
    arr.sort((a, b) => a.order - b.order)
    return arr.map((item) => (
      <li key={item._id}>
        <div>{item.label}</div>
      </li>
    ))
  }

  const renderScoreSummary = () => {
    return data.exm_str_tree.grand_total_footer.map((item) => (
      <Checkbox
        key={item.id}
        label={item.label}
        isSelected={item.checked}
        fieldName={item.id}
        handleChange={(obj) => {
          let arr = [...data.exm_str_tree.grand_total_footer]
          let index = arr.findIndex((footer) => footer.id === obj.fieldName)
          arr[index] = {...arr[index], checked: obj.value}
          handleChange({
            fieldName: 'exm_str_tree',
            value: {...data.exm_str_tree, grand_total_footer: arr},
          })
          let fetchParams = [...objToSave.template.fetch_params]
          index = fetchParams.findIndex(
            (sec) => sec.method_name === 'calculate_student_marks'
          )
          let params = [...fetchParams[index].params]
          let paramIndex = params.findIndex((par) => par.id === obj.fieldName)
          params[paramIndex] = {...params[paramIndex], checked: obj.value}
          fetchParams[index] = {...fetchParams[index], params}
          setObjToSave({
            ...objToSave,
            template: {...objToSave.template, fetch_params: fetchParams},
          })
        }}
        isDisabled={item.id === 'overall_grade' && !data.grade_enabled}
      />
    ))
  }

  const renderTermWeightage = () => {
    return data.exm_str_tree.children.map((term, index) => (
      <Input
        key={index}
        type="number"
        title={`${term.name} weightage`}
        value={term.weightage}
        onChange={(obj) => handleTermWeightageChange(obj, index)}
        infoType={
          term.weightage > 100 || term.weightage < 0 ? 'error' : undefined
        }
        infoMsg={
          term.weightage > 100 || term.weightage < 0
            ? t('invalidData')
            : undefined
        }
        suffix="%"
      />
    ))
  }

  const handleGrandTotalToggle = ({value}) => {
    userEventHandler(events.REPORT_CARD_SHOW_IN_REPORTCARD_CLICKED_TFI, {
      header_type: EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
      sub_header_type: 'grand_total',
      flag: value ? 'Y' : 'N',
    })
    handleChange({
      fieldName: 'exm_str_tree',
      value: {
        ...data.exm_str_tree,
        show_session_total: value,
        total_width_weight: value ? SESSION_RESULT_WIDTH : 0,
      },
    })
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (sec) => sec.meta.template_section_id === TEMPLATE_SECTIONS_ID.SCHOLASTIC
    )
    fetchParams[index] = {
      ...fetchParams[index],
      meta: {...fetchParams[index].meta, show_session_total: value},
    }
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        grading_criteria: {
          ...objToSave.scholastic.grading_criteria,
          grading_visibility: {
            ...objToSave.scholastic.grading_criteria.grading_visibility,
            session_level: value
              ? GRADE_VISIBLITY_OPTIONS.MARKS
              : GRADE_VISIBLITY_OPTIONS.NONE,
          },
        },
      },
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  return (
    <div>
      <Heading
        className={styles.marginBottom}
        textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
      >
        {t('basicDetailSubjects')}
      </Heading>
      <div
        className={classNames(commonStyles.blockContainer, styles.marginBottom)}
      >
        <Input
          type="text"
          title={t('scholasticTitle')}
          fieldName="scholastic_area_title"
          value={data.scholastic_area_title}
          onChange={handleTitleChange}
          isRequired={true}
          maxLength={50}
        />
      </div>
      <div
        className={classNames(commonStyles.blockContainer, styles.marginBottom)}
      >
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('subjects')}
          </Heading>
          {renderManageButton(SCHOLASTIC_BLOCKS.SUBJECTS)}
        </div>
        <ul className={commonStyles.list}>{renderSubjects()}</ul>
      </div>
      <div
        className={classNames(commonStyles.blockContainer, styles.marginBottom)}
      >
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('examTypes')}
          </Heading>
          {renderManageButton(SCHOLASTIC_BLOCKS.EXAM_TYPES)}
        </div>
        {data.exm_str_tree.exam_types.length === 1 &&
        data.exm_str_tree.exam_types[0].label === '' ? (
          <div className={styles.placeholder}>{t('examTypesPlaceholder')}</div>
        ) : (
          <ul className={commonStyles.list}>{renderExamTypes()}</ul>
        )}
      </div>
      <Grades
        data={data}
        handleChange={handleChange}
        objToSave={objToSave}
        setObjToSave={setObjToSave}
        renderManageButton={renderManageButton}
        setDisablePublish={setDisablePublish}
        userEventHandler={userEventHandler}
      />
      <div
        className={classNames(commonStyles.blockContainer, styles.marginBottom)}
      >
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('scoreSummary')}
          </Heading>
        </div>
        <div className={classNames(commonStyles.list, styles.scoreSummary)}>
          {renderScoreSummary()}
        </div>
      </div>
      <Heading
        className={styles.marginBottom}
        textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
      >
        {t('termsExamsMarks')}
      </Heading>
      <ExamStructure
        examStructureTree={data.exm_str_tree}
        renderManageButton={renderManageButton}
        userEventHandler={userEventHandler}
        setExamStructureTree={(obj) =>
          handleChange({fieldName: 'exm_str_tree', value: obj})
        }
        objToSave={objToSave}
        setObjToSave={setObjToSave}
      />
      <Divider spacing={20} />
      <div className={commonStyles.blockHeader}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('grandTotal')}
        </Heading>
        <ToggleButtonWrapper
          fieldName="show_session_total"
          isSelected={data.exm_str_tree.show_session_total}
          handleChange={handleGrandTotalToggle}
        />
      </div>
      <Para
        textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
        className={classNames(styles.marginTop, styles.marginBottom)}
      >
        {t('weightageDesc')}
      </Para>
      <div
        className={classNames(
          commonStyles.blockContainer,
          styles.marginBottom,
          styles.termWeightage
        )}
      >
        {renderTermWeightage()}
      </div>
    </div>
  )
}

export default ScholasticBlock
