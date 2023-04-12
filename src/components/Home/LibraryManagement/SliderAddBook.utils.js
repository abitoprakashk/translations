export const userTypeArray = [
  'none',
  'admin',
  'teacher',
  'owner',
  'student',
  'other',
]

export const userTypeLabel = (type) => {
  return userTypeArray[type]
}
