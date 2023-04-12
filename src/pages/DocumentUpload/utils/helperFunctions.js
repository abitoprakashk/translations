const make_document_hierarchy = (settings) => {
  if (settings === null || settings.length === 0) {
    return []
  }
  const documentSettings = []
  const categoryIdMapper = {}
  let setting_category
  for (let i = 0; i < settings.length; i++) {
    if (
      settings[i].setting_type === 2 &&
      settings[i].is_active &&
      settings[i].key_id !== 'img_url'
    ) {
      setting_category = settings[i].category_id
      if (!(setting_category in categoryIdMapper)) {
        categoryIdMapper[setting_category] = []
      }
      categoryIdMapper[setting_category].push(settings[i])
    } else if (settings[i].setting_type === 3) {
      documentSettings.push(settings[i])
    }
  }
  const updatedDocumentSetting = []
  for (let i = 0; i < documentSettings.length; i++) {
    let document_id = documentSettings[i]._id
    if (document_id in categoryIdMapper) {
      documentSettings[i]['fields'] = categoryIdMapper[document_id]
      updatedDocumentSetting.push(documentSettings[i])
    }
  }
  updatedDocumentSetting.sort(function (a, b) {
    const seqA = a.sequence
    const seqB = b.sequence
    if (seqA === undefined || seqB === undefined) {
      return -1
    }
    return seqA - seqB
  })
  updatedDocumentSetting.forEach((documentCategory) => {
    documentCategory.fields.sort(function (a, b) {
      const seqA = a.sequence
      const seqB = b.sequence
      if (seqA === undefined || seqB === undefined) {
        return -1
      }
      return seqA - seqB
    })
  })
  return updatedDocumentSetting
}

export {make_document_hierarchy}
