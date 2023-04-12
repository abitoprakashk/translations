export const getFeeTypeNames = ({feeTypes, selectedFeeTypes}) => {
  if (feeTypes.length === 0 && selectedFeeTypes.length === 0) return ''

  return feeTypes
    .filter((type) => selectedFeeTypes.includes(type._id))
    .map((type) => type.name)
    .join(',')
}
