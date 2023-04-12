import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import EmptyScreen from '../../../../../fee/components/FeeReports/components/feeCards/EmptyScreen'
import {
  COLUMN_OPTIONS,
  ROW_OPTIONS,
  VALUE,
} from '../../../../constants/feeCustomization.editor.constants'
import usePivotTableData from '../../../../hooks/usePivotTableData'
import {spanSize} from '../../../../utils/feeCustomization.helpers'
import lottieLoader from '../../../../lottie/tableLoader.json'
import LoaderScreen from '../../../../components/LoaderScreen/LoaderScreen'
import {Icon, ICON_CONSTANTS, Pagination, Tooltip} from '@teachmint/krayon'
import classNames from 'classnames'
import {PAGE_SIZE} from '../../../../constants/feeCustomization.constants'
import styles from './FeePivotTable.module.css'
import ErrorScreen from './ErrorScreen'
import {searchAndRemove} from '../../../../utils/feeCustomization.state.helpers'
import {useDebouncedValue} from '../../../../../AttendanceReport/hooks/useDebouncedValue'
import Search from '../../../../components/Search/Search'
import useTypeWritterText from '../../../../../../hooks/useTypeWritterText'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'

let allRows = null

const FeePivotTable = forwardRef((_, ref) => {
  const {t} = useTranslation()
  const {colKeys, rowAttr, colAttr, rowKeys, isLoading, data, error, getData} =
    usePivotTableData()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const eventManager = useSelector((state) => state.eventManager)
  const [debouncedSearch] = useDebouncedValue(search, 200)
  const tableRef = useRef(null)
  const fromPage = useMemo(() => (page - 1) * PAGE_SIZE, [page])
  const toPage = useMemo(() => page * PAGE_SIZE, [page])
  const _placeHolder = useTypeWritterText({
    dataText:
      rowAttr?.map((r) => t(ROW_OPTIONS[r].titleKey)?.toLowerCase()) || [],
  })
  const rowLength = useMemo(() => rowAttr?.length, [rowAttr])
  //  if only one row dont use typewritter style
  const placeHolder = useMemo(
    () =>
      `${t('searchBy')} ${
        rowLength > 1
          ? _placeHolder
          : t(ROW_OPTIONS[rowAttr?.[0]]?.titleKey)?.toLowerCase()
      }`,
    [_placeHolder, t]
  )
  useImperativeHandle(ref, () => ({
    RenderTable,
  }))

  useEffect(() => {
    allRows = tableRef.current?.querySelectorAll('tbody tr')
    if (allRows) allRows = Array.from(allRows)
  }, [data, fromPage])

  useEffect(() => {
    setPage(1)
    setSearch('')
  }, [data])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const [filteredRowKeys, filteredTree] = useMemo(() => {
    if (data?.tree) {
      const _arr1 = [...rowKeys]
      const _arr2 = [...data.tree]
      return searchAndRemove(_arr1, _arr2, search)
    }
    return [rowKeys, data?.tree]
  }, [rowKeys, data?.tree, debouncedSearch])

  const handleRowClick = (dataId) => {
    if (!allRows) return
    allRows.map((row) => {
      if (row.dataset.id === dataId) {
        row.classList.toggle(styles.highlight)
      } else {
        row.classList.remove(styles.highlight)
      }
    })
  }

  //  sum of columns (2d array)
  const colTotalFunc = useCallback(
    (paginated) => {
      const arr = (paginated ? filteredTree : data?.tree) || []
      return (
        arr?.[0]?.map((_, i) =>
          arr.reduce((sum, row) => sum + (row[i] || 0), 0)
        ) || []
      )
    },
    [filteredTree]
  )

  const RenderTable = ({paginated}) => {
    const _rowKeys = paginated
      ? filteredRowKeys.slice(fromPage, toPage)
      : rowKeys
    const colTotal = colTotalFunc(paginated)
    return (
      <table ref={tableRef}>
        <thead>
          {/* COLUMNS */}
          {[...colAttr].map(function (c, j) {
            return (
              <tr key={`colAttr${j}`} data-key={`colAttr${j}`}>
                {j === 0 && rowAttr.length !== 0 && (
                  <th colSpan={rowAttr.length} rowSpan={colAttr.length} />
                )}
                <th className={styles.pvtAxisLabel}>
                  {t({...COLUMN_OPTIONS, ...VALUE}[c].titleKey)}
                </th>
                {colKeys.map(function (colKey, i) {
                  let x = spanSize(colKeys, i, j)
                  let rowSpan = 1
                  if (x === -1) {
                    return null
                  }
                  // increase rowSpan to cover blank cell
                  if (rowAttr.length && j === colAttr.length - 1) {
                    rowSpan += 1
                  }
                  return (
                    <th
                      className={styles.pvtColLabel}
                      key={`colKey${i}`}
                      colSpan={x}
                      rowSpan={rowSpan}
                    >
                      {colKey[j]}
                    </th>
                  )
                })}
              </tr>
            )
          })}
          {/* ROWS */}
          {rowAttr.length !== 0 && (
            <tr>
              {rowAttr.map(function (r, i) {
                return (
                  <th className={styles.pvtAxisLabel} key={`rowAttr${i}`}>
                    {t(ROW_OPTIONS[r].titleKey)}
                  </th>
                )
              })}
              {colAttr.length !== 0 && rowAttr.length !== 0 ? (
                <th className={styles.pvtAxisLabel}>{''}</th>
              ) : null}
            </tr>
          )}
        </thead>
        <tbody>
          {_rowKeys.map(function (rowKey, i) {
            const tree = paginated ? filteredTree[fromPage + i] : data.tree[i]
            return (
              <tr
                key={`bodyRow${i}`}
                data-id={`bodyRow${i}`}
                onClick={() => handleRowClick(`bodyRow${i}`)}
              >
                {/* Header for row */}
                {rowKey.map(function (rowData, j) {
                  const x = spanSize(_rowKeys, i, j)
                  if (x === -1 && paginated) {
                    return null
                  }
                  return (
                    <th
                      key={`rowKeyLabel${i}-${j}`}
                      className={styles.pvtRowLabel}
                      {...(paginated ? {rowSpan: x} : {})}
                      colSpan={
                        j === rowAttr.length - 1 && colAttr.length !== 0 ? 2 : 1
                      }
                    >
                      {typeof rowData !== 'object' ? (
                        rowData
                      ) : (
                        <rowData.Component
                          {...rowData.props}
                          desc={paginated ? rowData.props?.desc : null}
                        />
                      )}
                    </th>
                  )
                })}
                {/* CELL */}
                {tree.map((cell, celli) => {
                  return (
                    <td className="pvtVal" key={`pvtVal${i}-${celli}`}>
                      {cell === null
                        ? null
                        : new Intl.NumberFormat('en-in').format(
                            parseFloat(cell).toFixed(2)
                          )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          {colTotal?.length ? (
            <tr className={styles.totalRow}>
              {rowAttr.length !== 0 ? (
                <th
                  className={styles.colTotalemptySpace}
                  colSpan={rowAttr.length}
                  rowSpan={1}
                />
              ) : null}

              <th className={styles.colTotalLabel} key={`colTotalLabel`}>
                <Trans key={'entries'}>
                  Total of{' '}
                  {{num: paginated ? filteredTree?.length : data?.tree?.length}}{' '}
                  rows
                </Trans>
              </th>
              {colTotal.map((colTotal, i) => (
                <td className={styles.colTotatcell} key={`colTotalVal${i}`}>
                  {new Intl.NumberFormat('en-in').format(
                    parseFloat(colTotal).toFixed(2)
                  )}
                </td>
              ))}
            </tr>
          ) : null}
        </tbody>
      </table>
    )
  }

  const renderUI = useCallback(() => {
    if (isLoading) {
      return (
        <LoaderScreen
          lottie={lottieLoader}
          heading={t('createReport')}
          para={t('createReportPara')}
        />
      )
    }
    if (error) {
      return <ErrorScreen getData={getData} />
    }
    if (data) {
      return (
        <>
          <div
            className={classNames(
              styles.tableWrapper,
              'show-scrollbar show-scrollbar-small'
            )}
          >
            <RenderTable paginated />
          </div>
          {rowKeys?.length ? (
            <div className={styles.pageWrapper}>
              <Pagination
                onPageChange={(value) => {
                  setPage(value)
                }}
                classes={{
                  iconButton: styles.iconButton,
                }}
                page={page}
                pageSize={PAGE_SIZE}
                totalEntries={filteredTree?.length}
              />
            </div>
          ) : null}
        </>
      )
    }
    return (
      <EmptyScreen
        name={'tableChart'}
        desc={'feeCustomisationEmptyScreenText'}
        cta={false}
        classes={{desc: styles.desc}}
      />
    )
  }, [
    isLoading,
    error,
    data,
    rowKeys,
    page,
    PAGE_SIZE,
    filteredRowKeys,
    filteredTree,
  ])
  return (
    <div>
      {rowAttr?.length && data && !isLoading ? (
        <div className="mt-4 mb-4 flex gap-2 items-center">
          <Search
            value={search}
            onChange={(val) => {
              setSearch(val)
              eventManager.send_event(events.FEE_REPORTS_CUSTOM_SEARCH_TFI)
            }}
            onCrossClick={() => {
              eventManager.send_event(
                events.FEE_REPORTS_CUSTOM_SEARCH_CANCELLED_TFI
              )
            }}
            placeholder={placeHolder || ' '}
          />
          <a data-for="extraInfo" data-tip>
            <Icon
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              name="info"
              type={ICON_CONSTANTS.TYPES.SECONDARY}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
          </a>
          <Tooltip toolTipBody={t('searchOnlyRows')} toolTipId="extraInfo" />
        </div>
      ) : null}
      {renderUI()}
    </div>
  )
})

FeePivotTable.displayName = 'FeePivotTable'

export default FeePivotTable
