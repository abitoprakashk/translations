// import {useEffect, useState} from 'react'
// import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Input,
  Para,
  PARA_CONSTANTS,
  RadioGroup,
} from '@teachmint/krayon'
import classNames from 'classnames'
import commonStyles from './../../../LeftPanel.module.css'
import styles from './../ScholasticBlock.module.css'
// import Loader from '../../../../../../../../../components/Common/Loader/Loader'
import {
  GRADE_VISIBLITY_OPTIONS,
  SCHOLASTIC_BLOCKS,
  TEMPLATE_SECTIONS_ID,
} from '../../../../../../../constants'
import {useMemo} from 'react'
import {convertExamStructure} from '../../../../../utils'
import ToggleButtonWrapper from '../../ToggleButtonWrapper'
import {events} from '../../../../../../../../../../utils/EventsConstants'

const Grades = ({
  renderManageButton,
  data,
  handleChange,
  objToSave,
  setObjToSave,
  setDisablePublish,
  userEventHandler,
}) => {
  const {t} = useTranslation()

  const handleRadioChange = ({fieldName, value}) => {
    let tmp = {
      ...objToSave.scholastic.grading_criteria.grading_visibility,
      [fieldName]: value,
    }
    let convertedData = convertExamStructure(
      JSON.parse(
        JSON.stringify({
          ...objToSave.scholastic.exam_str,
          common_subjects: objToSave.scholastic.common_subjects.params,
          exam_types: objToSave.scholastic.exam_types,
        })
      ),
      objToSave.scholastic.grading_criteria.grade_enabled,
      tmp
    )
    handleChange({fieldName: 'exm_str_tree', value: convertedData})
    handleChange({
      fieldName: 'grading_visibility',
      value: tmp,
    })
    let template = {...objToSave.template}
    if (fieldName === 'session_level') {
      let fetchParams = [...objToSave.template.fetch_params]
      let index = fetchParams.findIndex(
        (sec) =>
          sec.meta.template_section_id === TEMPLATE_SECTIONS_ID.SCHOLASTIC
      )
      fetchParams[index] = {
        ...fetchParams[index],
        meta: {...fetchParams[index].meta, show_session_total: value !== 3},
      }
      template = {...template, fetch_params: fetchParams}
    }
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        grading_criteria: {
          ...objToSave.scholastic.grading_criteria,
          grading_visibility: tmp,
        },
      },
      template,
    })
  }

  const grades = useMemo(() => {
    if (!data.grade_enabled) return {pass: [], fail: []}
    let index = data.grades.findIndex(
      (grade) => grade._id === data.passing_grade?._id
    )
    if (index === -1) {
      return {pass: [...data.grades], fail: []}
    } else {
      return {
        pass: [...data.grades.slice(0, index + 1)],
        fail: [...data.grades.slice(index + 1)],
      }
    }
  }, [data.grades, data.passing_grade, data.grade_enabled])

  const radioOptions = [
    {
      label: t('marks'),
      value: GRADE_VISIBLITY_OPTIONS.MARKS,
    },
    {
      label: t('grades'),
      value: GRADE_VISIBLITY_OPTIONS.GRADES,
    },
    {
      label: t('both'),
      value: GRADE_VISIBLITY_OPTIONS.BOTH,
    },
    {
      label: t('none'),
      value: GRADE_VISIBLITY_OPTIONS.NONE,
    },
  ]

  const handleGradesToggleChange = ({fieldName, value}) => {
    userEventHandler(
      events.REPORT_CARD_SCHOLASTIC_CONVERT_TO_GRADE_CLICKED_TFI,
      {flag: value ? 'Y' : 'N'}
    )
    let convertedData = convertExamStructure(
      JSON.parse(
        JSON.stringify({
          ...objToSave.scholastic.exam_str,
          common_subjects: objToSave.scholastic.common_subjects.params,
          exam_types: objToSave.scholastic.exam_types,
        })
      ),
      value,
      objToSave.scholastic.grading_criteria.grading_visibility
    )
    handleChange({fieldName: 'exm_str_tree', value: convertedData})
    handleChange({fieldName, value})
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        grading_criteria: {
          ...objToSave.scholastic.grading_criteria,
          [fieldName]: value,
        },
      },
    })
  }

  const handleFailToggleChange = (obj) => {
    userEventHandler(
      events.REPORT_CARD_SCHOLASTIC_SETUP_PASSING_PERCENTAGE_CLICKED_TFI,
      {flag: obj.value ? 'Y' : 'N'}
    )
    handleChange(obj)
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        grading_criteria: {
          ...objToSave.scholastic.grading_criteria,
          [obj.fieldName]: obj.value,
        },
      },
    })
  }

  const handlePassingPercentageChange = (obj) => {
    handleChange(obj)
    if (obj.value > 100 || obj.value < 0) {
      setDisablePublish(true)
    } else {
      setDisablePublish(false)
    }
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        grading_criteria: {
          ...objToSave.scholastic.grading_criteria,
          [obj.fieldName]: +obj.value,
        },
      },
    })
  }

  const renderGrades = (key) => {
    return grades[key].map((grade) => (
      <div key={grade._id} className={styles.gradeRow}>
        <div className={styles.gradeMarksColumn}>
          <span className={styles.gradesMarks}>
            {grade.max}{' '}
            <span className={styles.gradesSubtext}>{t('marks')}</span>
          </span>
          <span>-</span>
          <span className={styles.gradesMarks}>
            {grade.min}{' '}
            <span className={styles.gradesSubtext}>{t('marks')}</span>
          </span>
        </div>
        <div
          className={classNames(styles.gradesMarks, styles.gradesNameText, {
            [styles.gradesSuccessColor]: key === 'pass',
            [styles.gradesFailColor]: key !== 'pass',
          })}
        >
          {grade.name}
        </div>
      </div>
    ))
  }

  return (
    <div
      className={classNames(commonStyles.blockContainer, styles.marginBottom)}
    >
      <div className={commonStyles.blockHeader}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('gradesPassingCriteria')}
        </Heading>
        {data.grade_enabled
          ? renderManageButton(SCHOLASTIC_BLOCKS.GRADES)
          : null}
      </div>
      <div
        className={classNames(styles.gradeToggleContainer, {
          [styles.marginTop]: data.grade_enabled,
        })}
      >
        <ToggleButtonWrapper
          label={t('convertMarksToGrade')}
          fieldName="grade_enabled"
          isSelected={data.grade_enabled}
          handleChange={handleGradesToggleChange}
        />
        {!data.grade_enabled && (
          <>
            <ToggleButtonWrapper
              label={t('setupPassingPercentage')}
              fieldName="fail_enabled"
              isSelected={data.fail_enabled}
              handleChange={handleFailToggleChange}
            />
            {data.fail_enabled && (
              <Input
                type="number"
                title={t('passingPercentage')}
                suffix="%"
                value={data.passing_percentage ? data.passing_percentage : ''}
                fieldName="passing_percentage"
                onChange={handlePassingPercentageChange}
                isRequired={true}
                infoType={
                  data.passing_percentage > 100 || data.passing_percentage < 0
                    ? 'error'
                    : undefined
                }
                infoMsg={
                  data.passing_percentage > 100 || data.passing_percentage < 0
                    ? t('invalidData')
                    : undefined
                }
                showMsg={true}
                classes={{wrapper: styles.negativeMarginTop}}
              />
            )}
          </>
        )}
      </div>
      {!data.grade_enabled && (
        <Para className={styles.cautionPara} type={PARA_CONSTANTS.TYPE.ERROR}>
          <Icon
            name="caution"
            type={ICON_CONSTANTS.TYPES.ERROR}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          <div className="flex flex-col">
            <span>{t('failCaution1')}</span>
            <span>{t('failCaution2')}</span>
          </div>
        </Para>
      )}
      {data.grade_enabled && (
        <>
          <div className={classNames(styles.greenDiv, styles.marginTop)}>
            {t('passingGrade')}
          </div>
          <div className={styles.gradesBlock}>{renderGrades('pass')}</div>
          {data.fail_enabled && grades.fail.length ? (
            <>
              <div className={styles.redDiv}>{t('failingGrade')}</div>
              <div className={styles.gradesBlock}>{renderGrades('fail')}</div>
            </>
          ) : null}
          <div className={styles.radioButtonsBlock}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {t('displayFinalScoreFor')}
            </Heading>
            <div
              className={classNames(
                styles.gradesSubtext,
                styles.marginBottom,
                styles.marginTop
              )}
            >
              {t('grandTotal')}
            </div>
            <div className={styles.radioGroupWrapper}>
              <RadioGroup
                options={radioOptions}
                selectedOption={data.grading_visibility.session_level}
                handleChange={({selected}) =>
                  handleRadioChange({
                    fieldName: 'session_level',
                    value: selected,
                  })
                }
              />
            </div>
            <div
              className={classNames(
                styles.gradesSubtext,
                styles.marginBottom,
                styles.marginTop
              )}
            >
              {t('terms')}
            </div>
            <div className={styles.radioGroupWrapper}>
              <RadioGroup
                options={radioOptions}
                selectedOption={data.grading_visibility.term_level}
                handleChange={({selected}) =>
                  handleRadioChange({
                    fieldName: 'term_level',
                    value: selected,
                  })
                }
              />
            </div>
            <div
              className={classNames(
                styles.gradesSubtext,
                styles.marginBottom,
                styles.marginTop
              )}
            >
              {t('exams')}
            </div>
            <div className={styles.radioGroupWrapper}>
              <RadioGroup
                options={radioOptions.slice(0, -1)}
                selectedOption={data.grading_visibility.exam_level}
                handleChange={({selected}) =>
                  handleRadioChange({
                    fieldName: 'exam_level',
                    value: selected,
                  })
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Grades
