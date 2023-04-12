import {useMemo} from 'react'

const STATUS_TYPES = {
  ACTIVE: 1,
  INACTIVE: 2,
}

export default function useActiveinstituteHierarchy({instituteHierarchy = {}}) {
  //   var _instituteHierarchy = structuredClone(instituteHierarchy)
  //   var _instituteHierarchy = {}
  //   const getActiveClasses = () => {
  //     _instituteHierarchy = structuredClone(instituteHierarchy)
  //     const traverse = (data, setData, parent) => {
  //       if (!setData) return
  //       if (data.status === STATUS_TYPES.INACTIVE) {
  //         const _parent = parent?.children?.filter(({id}) => id !== data.id)
  //         parent.children = _parent
  //       }
  //       data?.children?.map((child) => {
  //         const [setDataChild] = setData?.children?.filter(
  //           ({id}) => child.id === id
  //         )
  //         traverse(child, setDataChild, setData)
  //       })
  //     }

  //     traverse(instituteHierarchy, _instituteHierarchy, _instituteHierarchy)
  //     // console.log('111 before ', instituteHierarchy)
  //     // console.log('111 after', _instituteHierarchy)
  //   }

  //   useEffect(() => {
  //     if (instituteHierarchy) {
  //       getActiveClasses()
  //     }
  //   }, [instituteHierarchy])

  return useMemo(() => {
    var _instituteHierarchy = {}
    // const getActiveClasses = () => {
    _instituteHierarchy = structuredClone(instituteHierarchy)
    const traverse = (data, setData, parent) => {
      if (!setData) return
      if (data.status === STATUS_TYPES.INACTIVE) {
        const _parent = parent?.children?.filter(({id}) => id !== data.id)
        parent.children = _parent
      }
      data?.children?.map((child) => {
        const [setDataChild] = setData?.children?.filter(
          ({id}) => child.id === id
        )
        traverse(child, setDataChild, setData)
      })
    }

    traverse(instituteHierarchy, _instituteHierarchy, _instituteHierarchy)
    // console.log('111 before ', instituteHierarchy)
    // console.log('111 after', _instituteHierarchy)
    // }
    return _instituteHierarchy
  }, [instituteHierarchy])
}
