import {DateTime} from 'luxon'
import {useCallback, useState} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {DATE_FORMAT} from '../constants/feeCustomization.constants'
import {
  FILTER_OPTIONS,
  FILTER_OPTIONS_CONSTANTS,
} from '../constants/feeCustomization.editor.constants'
function useFeeDownloadReport() {
  const {t} = useTranslation()
  const [isLoading, setisLoading] = useState(false)
  const instituteInfo = useSelector((state) => state.instituteInfo)

  const downloadExcel = useCallback(
    ({RenderTable, selectedFilterValues, dateApiReq, title}) => {
      title = title.replace(/[^a-zA-Z0-9_,-\s]/g, '')
      setisLoading(true)
      setTimeout(async () => {
        const {utils, writeFile} = await import('xlsx')
        const toNodes = (html) =>
          new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]
        const node = toNodes(renderToStaticMarkup(<RenderTable />))
        const newRows = getDownloadData(selectedFilterValues, dateApiReq)
        const thead = node.getElementsByTagName('thead')[0]
        if (thead) {
          newRows.reverse().forEach((row) => {
            const tr = document.createElement('tr')
            let innerHtml = ''
            row.cells.forEach((cell) => {
              innerHtml += `<th>${cell}</th>`
            })
            tr.innerHTML = innerHtml
            node.getElementsByTagName('thead')[0].prepend(tr)
          })
          // Add blank rows
          ;[...Array(2).keys()].forEach((_) => {
            const tr = document.createElement('tr')
            thead.insertBefore(tr, thead.children[newRows.length])
          })
        }
        const ws = utils.table_to_sheet(node, {
          dateNF: 'dd mmm yyyy',
          raw: true,
        })
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, title?.substr(0, 30))
        writeFile(
          wb,
          `${title}_${DateTime.fromJSDate(new Date()).toFormat(
            DATE_FORMAT
          )}.xlsx`
        )
        setTimeout(() => {
          setisLoading(false)
        }, 300)
      }, 0)
    },
    []
  )

  const getDownloadData = useCallback(
    (selectedFilterValues, dateApiReq) => {
      const filterData = Object.keys(selectedFilterValues).map((key) => {
        let data = []
        if (key === FILTER_OPTIONS_CONSTANTS.SECTION) {
          data = selectedFilterValues[key].map(
            (singleClass) => `${singleClass.standard} ${singleClass.name}`
          )
        } else {
          data = selectedFilterValues[key].map(({label}) => label)
        }
        return {
          [key]: data,
        }
      })

      let filterRows = []
      filterData.map((row) => {
        const key = Object.keys(row)[0]
        if (row[key]?.length) {
          const cells = []
          cells.push(t(FILTER_OPTIONS[key].titleKey))
          cells.push(row[key].join(', '))
          filterRows.push({
            cells,
          })
        }
      })

      return [
        {
          cells: [instituteInfo.name],
        },
        {
          cells: [],
        },
        {
          cells: [
            t('downloadDate'),
            DateTime.fromJSDate(new Date()).toFormat(DATE_FORMAT),
          ],
        },
        ...filterRows,
        {
          cells: [
            t('kanbanBoardFilterTabDateRange'),
            `${DateTime.fromJSDate(new Date(dateApiReq.from)).toFormat(
              DATE_FORMAT
            )} - ${DateTime.fromJSDate(new Date(dateApiReq.to)).toFormat(
              DATE_FORMAT
            )}`,
          ],
        },
      ]
    },
    [t, instituteInfo]
  )
  return {downloadExcel, isLoading}
}

export default useFeeDownloadReport
