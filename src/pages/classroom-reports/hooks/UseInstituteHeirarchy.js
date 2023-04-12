import {useEffect, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {instituteHierarchyAction} from '../../../redux/actions/instituteInfoActions'
import {utilsGetInstituteHierarchy} from '../../../routes/instituteSystem'
import {hierarchyInitialization} from '../../../utils/HierarchyHelpers'
import {fetchUncategorisedClassesDataAction} from '../../communication/redux/actions/commonActions'
import {INSTITUTE_TYPES_STRING_MAP} from '../constant/classroomReport.constant'

function UseInstituteHeirarchy() {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [allClass, setallClass] = useState(null)
  const [hasClass, sethasClass] = useState(false)

  const TYPE = useMemo(() => ['STANDARD', 'SECTION', 'SUBJECT'], [])

  const {
    instituteInfo,
    instituteHierarchy,
    communicationInfo: {common},
  } = useSelector((state) => state)

  const getInstituteHierarchy = () => {
    // dispatch(showLoadingAction(true))
    utilsGetInstituteHierarchy(instituteInfo._id, instituteInfo.hierarchy_id)
      .then(({status, obj}) => {
        if (status)
          dispatch(
            instituteHierarchyAction(
              hierarchyInitialization(
                instituteHierarchy,
                obj,
                instituteInfo?.institute_type
              )
            )
          )
        else
          dispatch(
            showToast({
              type: 'error',
              message: t('genericErrorMessage'),
            })
          )
      })
      .catch((_err) => {
        dispatch(showErrorOccuredAction(true))
      })
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getClassList = () => {
    const allClassData = []

    const traverse = (data, setData, parent) => {
      if (TYPE.includes(data.type)) {
        if (data.type === 'STANDARD') {
          setData.name = data.name
          setData._id = data.id
          setData.institute = {
            institute_type:
              INSTITUTE_TYPES_STRING_MAP[instituteInfo?.institute_type],
            uncategorized: false,
            subscription_status: true,
          }
          setData.sections = []
        } else if (data.type === 'SECTION') {
          setData.push({
            _id: data.id,
            name: data.name,
            subjects: [],
            className: parent?.name,
            classId: parent?._id,
          })
        } else if (data.type === 'SUBJECT') {
          sethasClass(true)
          setData.subjects.push({
            _id: data.id,
            name: data.name,
            className: setData.className,
            sectionName: setData.name,
            sectionId: setData._id,
            institute: {
              institute_type:
                INSTITUTE_TYPES_STRING_MAP[instituteInfo?.institute_type],
              uncategorized: false,
              subscription_status: true,
            },
          })
        }
      }
      data?.children?.map((child) => {
        if (child.type === 'STANDARD') {
          // allClassData[child.id] = {}
          allClassData.push({})
          traverse(child, allClassData[allClassData.length - 1 || 0])
        } else if (child.type === 'SECTION') {
          traverse(child, setData.sections, setData)
        } else if (child.type === 'SUBJECT') {
          traverse(child, setData[setData.length - 1 || 0])
        } else {
          traverse(child, setData)
        }
      })
    }

    traverse(instituteHierarchy, allClassData)
    return allClassData
  }

  const getUncategorizedClass = async () => {
    dispatch(fetchUncategorisedClassesDataAction(instituteInfo._id))
  }

  const getAllclass = async () => {
    getInstituteHierarchy()
    getUncategorizedClass()
  }

  const filterClass = (classes) => {
    const filteredClasses = []
    classes.forEach((singleclass) => {
      let sectionPresent = false

      singleclass.sections = singleclass.sections?.filter((section) => {
        return section.subjects?.length
      })

      if (singleclass.sections?.length) {
        sectionPresent = true
      }

      if (sectionPresent) {
        filteredClasses.push(singleclass)
      }
    })
    return filteredClasses
  }

  useEffect(() => {
    if (instituteHierarchy) {
      const categorisedClasses = getClassList()
      const uncategorizedClasses = []
      common.uncategorisedClassesData?.map((uncategorisedClass) => {
        sethasClass(true)
        uncategorizedClasses.push({
          _id: uncategorisedClass._id,
          name: uncategorisedClass.name,
          type: 'UNCATEGORIZED',
          institute: {
            institute_type:
              INSTITUTE_TYPES_STRING_MAP[instituteInfo?.institute_type],
            uncategorized: true,
            subscription_status: true,
          },
        })
      })
      const filteredClasses = filterClass(categorisedClasses)
      setallClass([...filteredClasses, ...uncategorizedClasses])
    }
  }, [instituteHierarchy, common.uncategorisedClassesData])

  return [getAllclass, allClass, hasClass]
}

export default UseInstituteHeirarchy
