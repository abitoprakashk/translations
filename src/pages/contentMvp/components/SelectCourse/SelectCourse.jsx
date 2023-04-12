import {Icon, Dropdown} from '@teachmint/krayon'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {getUrlWithParams} from '../../commonFunctions'
import {CONTENT_PATH, PAYLOAD_FIELDS} from '../../constants'
import {
  clearContentAction,
  fetchTaxonomyAction,
  setCourseAction,
} from '../../redux/actions/contentActions'
import {CONTENT_ACTION_TYPES} from '../../redux/actionTypes'
import {t} from 'i18next'
import {useContent} from '../../redux/contentSelectors'
import styles from './SelectCourse.module.css'
import classNames from 'classnames'

export default function SelectCourse() {
  const dispatch = useDispatch()
  const {courses, selectedCourse} = useContent()
  const history = useHistory()

  useEffect(() => {
    if (!courses?.length) {
      dispatch(
        fetchTaxonomyAction({
          field: PAYLOAD_FIELDS.course,
        })
      )
    } else if (!selectedCourse) {
      dispatch(setCourseAction(courses[0]?._id))
    }
  }, [courses])

  const onCourseSelect = (course) => {
    if (course && course !== selectedCourse) {
      dispatch(clearContentAction())
      dispatch(setCourseAction(course))
      dispatch({
        type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
        payload: {
          field: PAYLOAD_FIELDS.language,
          tfile_id: course,
        },
      })
      history.push(
        getUrlWithParams(CONTENT_PATH, {
          course,
        })
      )
    }
  }

  if (!courses?.length) {
    return null
  }

  const dropdownTabsLabel = (course) => {
    return (
      <div className={styles.courseDropdownTab}>
        <div className={styles.courseDropDownCont}>
          <img src={course.icon_url} height="23px" width="23px"></img>
          &nbsp;{' '}
          <div className={styles.dropdownTabLabelCont}>
            {course.name}
            {course.coming_soon && (
              <div className={styles.comingSoonText}>{t('comingSoon')}</div>
            )}
          </div>
        </div>
        {course.is_locked && (
          <div>
            &nbsp;
            <Icon name="lock" version="filled" size="xxx_s" />
          </div>
        )}
      </div>
    )
  }

  const getCourseFrozenOptions = () => {
    if (courses && courses.length !== 0) {
      let frozenOpts = []
      courses.forEach((cours) => {
        if (cours.is_locked || cours.coming_soon) {
          frozenOpts.push(cours._id)
        }
      })
      return frozenOpts
    } else return []
  }
  return (
    <div>
      <Dropdown
        options={courses.map((cours) => ({
          label: dropdownTabsLabel(cours),
          value: cours._id,
        }))}
        classes={{
          dropdownClass: styles.dropdown,
          dropdownOptions: classNames(
            styles.dropdownOptions,
            'show-scrollbar show-scrollbar-small'
          ),
        }}
        frozenOptions={getCourseFrozenOptions()}
        selectedOptions={selectedCourse}
        onChange={({value}) => onCourseSelect(value)}
        selectionPlaceholder={getSelectionPlaceHolder(selectedCourse, courses)}
        isDisabled={courses.length <= 1}
      />
    </div>
  )
}

const getSelectionPlaceHolder = (selected, courses) => {
  const course = courses.find((course) => course.name === selected)

  if (!course) return null

  return (
    <div className={styles.dropdownPlaceholder}>
      <img src={course.icon_url} className={styles.courseLogo} />
      <span>{selected}</span>
    </div>
  )
}
