import DocumentFields from '../DocumentFields/DocumentFields'

const DocumentCategories = ({
  fields,
  personaMember,
  setShowMemberLoader,
  persona,
}) => {
  const fieldMemberCheck = (field) => {
    if (field.key_id in personaMember) {
      if (
        personaMember[field.key_id] === '' ||
        personaMember[field.key_id] === null
      ) {
        return false
      }
      return true
    }
    return false
  }

  const renderFields = fields.map((field) => (
    <DocumentFields
      key={field?._id}
      field={field}
      personaMember={personaMember}
      isFieldInMember={fieldMemberCheck(field)}
      setShowMemberLoader={setShowMemberLoader}
      persona={persona}
    />
  ))
  return renderFields
}

export default DocumentCategories
