export const getSearchTemplateFields = (templateFields) => {
  let flatTemplateFields = []
  if (templateFields?.data?.IMIS?.length > 0) {
    templateFields?.data?.IMIS?.forEach((item) => {
      if (item?.fields?.length > 0) {
        item.fields.forEach((field) => {
          flatTemplateFields.push(field)
        })
      }
    })
  }
  return flatTemplateFields
}

export const getUpdateSearchFiltersList = (
  searchText,
  searchTemplateFields
) => {
  let updatedFieldsList = []
  if (searchText.trim().length > 0 && searchTemplateFields.length > 0) {
    return searchTemplateFields.filter((item) => {
      return item.name?.toLowerCase().includes(searchText.trim().toLowerCase())
    })
  }
  return updatedFieldsList
}
