import {useLayoutEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../../../redux/actions/commonAction'
import {instituteHierarchyAction} from '../../../../../redux/actions/instituteInfoActions'
import {utilsGetInstituteHierarchy} from '../../../../../routes/instituteSystem'
import {hierarchyInitialization} from '../../../../../utils/HierarchyHelpers'

function useSectionData() {
  const dispatch = useDispatch()
  const [allSection, setallSection] = useState(null)
  const {t} = useTranslation()
  const {
    instituteInfo,
    instituteHierarchy,
    communicationInfo: {common},
  } = useSelector((state) => state)
  const {
    attendanceRegister: {isLoading, loaded, data: initData, error},
  } = useSelector((state) => state.globalData)

  // const getUncategorisedClasses = () => {
  //   return common.uncategorisedClassesData?.map((uncategorisedClass) => {
  //     return {
  //       id: uncategorisedClass._id,
  //       name: uncategorisedClass.name,
  //     }
  //   })
  // }

  const getAllsections = () => {
    const _allSection = []
    const traverse = (data, setData, name) => {
      if (data.type === 'SECTION') {
        setData.push({
          id: data.id,
          name: (name ? `${name} - ` : '') + data.name,
        })
      }
      data?.children?.map((child) => {
        traverse(
          child,
          setData,
          data.type === 'STANDARD' ? data.name : undefined
        )
      })
    }
    traverse(instituteHierarchy, _allSection)
    // const uncategorisedClass = getUncategorisedClasses()
    return [..._allSection]
  }

  // const getUncategorizedClass = async () => {
  //   dispatch(fetchUncategorisedClassesDataAction(instituteInfo._id))
  // }

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

  const getAllclass = async () => {
    getInstituteHierarchy()
    // getUncategorizedClass()
  }

  useLayoutEffect(() => {
    getAllclass()
  }, [])

  useLayoutEffect(() => {
    if (!instituteHierarchy || !common.uncategorisedClassesData) return
    setallSection(getAllsections())
  }, [common.uncategorisedClassesData, isLoading, loaded, initData, error])

  return {allSection}
}

export default useSectionData
