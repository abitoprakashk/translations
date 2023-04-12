import React from 'react'
import {Table} from '@teachmint/krayon'
import {INSTALMENT_DETAIL_TABLE_COLS} from '../../../FeeTabConstant'
import {useFeeStructure} from '../../../../../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../utils/Helpers'
import {useSelector} from 'react-redux'

export default function InstalmentDetail({instalmentDetail = []}) {
  const {feeTypes} = useFeeStructure()
  const {instituteInfo} = useSelector((state) => state)

  const rows = instalmentDetail.map((rowData, idx) => {
    let feeType = feeTypes.find(
      (item) => item._id === rowData?.category_master_id
    )
    return {
      id: `instalmentDetail${idx}`,
      feeType: feeType?.name,
      amount: getAmountFixDecimalWithCurrency(
        rowData?.amount,
        instituteInfo.currency
      ),
      discount: getAmountFixDecimalWithCurrency(
        rowData?.discount,
        instituteInfo.currency
      ),
      paid: getAmountFixDecimalWithCurrency(
        rowData?.paid,
        instituteInfo.currency
      ),
      due: getAmountFixDecimalWithCurrency(
        rowData?.due,
        instituteInfo.currency
      ),
    }
  })

  return (
    <Table
      uniqueKey={'id'}
      rows={rows}
      cols={INSTALMENT_DETAIL_TABLE_COLS}
      isSelectable={false}
    />
  )
}
