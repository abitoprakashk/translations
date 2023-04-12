import {Tooltip} from '@teachmint/krayon'
const HistorySection = ({feeDetail}) => {
  return (
    <div data-tip data-for={feeDetail.label}>
      <p className={feeDetail.className}>{feeDetail.amount}</p>
      <span>{feeDetail.label}</span>
      <Tooltip
        toolTipId={feeDetail.label}
        toolTipBody={feeDetail.value}
        place="bottom"
        effect="solid"
      />
    </div>
  )
}

export default HistorySection
