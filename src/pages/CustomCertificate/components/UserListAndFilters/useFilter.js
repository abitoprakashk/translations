const ifExists = (arr, target) => target.some((v) => arr.includes(v))

const useFilter = ({data, keyToFilter, filterValue}) => {
  if (!Array.isArray(data) || (data && data.length === 0)) return []
  if (!filterValue || !filterValue?.length) return data

  if (typeof filterValue === 'string') {
    const filterLowerCase = filterValue.toLocaleLowerCase()
    return data.filter((item) => {
      if (!Array.isArray(keyToFilter)) keyToFilter = [keyToFilter]
      return keyToFilter.some((key) => {
        const valueToBeChecked = item[key] ? item[key].toLocaleLowerCase() : ''
        if (valueToBeChecked.includes(filterLowerCase)) return item
      })
    })
  } else if (Array.isArray(filterValue) && filterValue.length) {
    const keys = keyToFilter.split('.')
    return data.filter((item) => {
      let toSearch
      keys.forEach((elem) => {
        toSearch = toSearch ? toSearch[elem] : item[elem]
      })
      if (toSearch?.length && ifExists(toSearch, filterValue)) return item
    })
  } else return data
}

export default useFilter
