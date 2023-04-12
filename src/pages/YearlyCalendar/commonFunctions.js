import {Tooltip} from '@teachmint/common'
import {YEARLY_LABELS as LABELS} from './YearlyCalendar.constants'
export function getOrdinalNum(n) {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  )
}

export const getClassesForRow = (nodeIds, classList, rowId, applicableTo) => {
  if (!nodeIds || !nodeIds?.length) {
    if (applicableTo == 1) return 'NA'
    else return 'All Classes'
  }
  let classes = '',
    firstThreeClasses = ''
  const classArray = []
  classList.forEach((item) => {
    if (nodeIds.indexOf(item.key) !== -1) {
      classArray.push(item.value)
      if (classArray.length < 4) firstThreeClasses += ` ${item.value},`
      classes += ` ${item.value},`
    }
  })
  if (classArray.length > 1) classes = classes.substring(0, classes.length)
  firstThreeClasses = firstThreeClasses.substring(
    0,
    firstThreeClasses.length - 1
  )
  if (nodeIds.length > 3)
    return (
      <div>
        <>
          <a
            data-tip
            data-for={`row${rowId}`}
            style={{display: 'flex', gap: '2px'}}
          >
            {`${firstThreeClasses}`}{' '}
            <span style={{color: '#1DA1F2', cursor: 'pointer'}}>
              {LABELS.MORE}
            </span>
          </a>
          <Tooltip toolTipId={`row${rowId}`} type="info">
            <span style={{textTransform: 'none'}}>
              {classes.substring(0, classes.length - 1)}
            </span>
          </Tooltip>
        </>
      </div>
    )
  return classes.substring(0, classes.length - 1)
}
