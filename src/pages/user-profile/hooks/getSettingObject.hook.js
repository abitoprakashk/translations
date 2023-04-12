import {useState, useEffect} from 'react'

export function useGetSettingObject(categoryList) {
  const [obj, setObj] = useState(null)

  useEffect(() => {
    if (categoryList) {
      let json = []
      categoryList.forEach((item) => {
        if (item.is_active && item?.childrenFields?.length > 0) {
          item.childrenFields.forEach((field) => {
            if (field?.is_active) {
              json.push(field)
            }
          })
        }
      })
      setObj(json)
    }
  }, [categoryList])

  return obj
}
