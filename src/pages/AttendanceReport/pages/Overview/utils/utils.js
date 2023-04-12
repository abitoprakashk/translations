import {SORT_TYPE} from '../../../AttendanceReport.constant'

const getValue = (obj, key) => {
  return key?.split('.')?.reduce((o, k) => o?.[k], obj)
}

export const handleClassSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  let dataStartingWithAlphabet = []
  let dataStartingWithNumeric = []
  data.forEach((item) => {
    if (getValue(item, key).match(/^[A-Z]/i)) {
      dataStartingWithAlphabet.push(item)
    } else {
      dataStartingWithNumeric.push(item)
    }
  })
  const sortedData = dataStartingWithNumeric.sort((a, b) => {
    if (type === SORT_TYPE.ASC) {
      const val =
        getValue(a, key)?.split(/[A-Za-z- ]+/)?.[0] -
        getValue(b, key)?.split(/[A-Za-z- ]+/)?.[0]
      if (val !== 0) return val
      return getValue(a, key)
        ?.split(/[0-9- ]+/)?.[1]
        ?.toUpperCase()
        ?.replaceAll('\\s', '')
        ?.localeCompare(
          getValue(b, key)
            ?.split(/[0-9- ]+/)?.[1]
            ?.toUpperCase()
        )
    } else {
      const val =
        getValue(b, key)?.split(/[A-Za-z- ]+/)?.[0] -
        getValue(a, key)?.split(/[A-Za-z- ]+/)?.[0]
      if (val !== 0) return val
      return getValue(b, key)
        ?.split(/[0-9- ]+/)?.[1]
        ?.toUpperCase()
        ?.replaceAll('\\s', '')
        ?.localeCompare(
          getValue(a, key)
            ?.split(/[0-9- ]+/)?.[1]
            ?.toUpperCase()
        )
    }
  })

  dataStartingWithAlphabet = basicStringSort({
    type,
    data: dataStartingWithAlphabet,
    key,
  })

  return [...sortedData, ...dataStartingWithAlphabet]
}

export const handleStatusSort = ({data = [], type = SORT_TYPE.ASC}) => {
  const noStudents = []
  const marked = []
  const unMarked = []
  data.forEach((rowData) => {
    if (!rowData.strength) {
      noStudents.push(rowData)
    } else if (rowData.A || rowData.P) {
      marked.push(rowData)
    } else {
      unMarked.push(rowData)
    }
  })

  if (type === SORT_TYPE.ASC) {
    return [...marked, ...unMarked, ...noStudents]
  }
  return [...unMarked, ...marked, ...noStudents]
}

export const handlePercentageSort = ({
  data = [],
  type = SORT_TYPE.ASC,
  key,
}) => {
  return data.sort((a, b) => {
    return type === SORT_TYPE.ASC
      ? getValue(a, key)?.split('%')?.[0] - getValue(b, key)?.split('%')?.[0]
      : getValue(b, key)?.split('%')?.[0] - getValue(a, key)?.split('%')?.[0]
  })
}

export const basicSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) => {
    return type === SORT_TYPE.ASC
      ? (getValue(a, key) || 0) - (getValue(b, key) || 0)
      : (getValue(b, key) || 0) - (getValue(a, key) || 0)
  })

  return sortedData
}

export const dateSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) => {
    return type === SORT_TYPE.ASC
      ? (+new Date(getValue(a, key)) || 0) - (+new Date(getValue(b, key)) || 0)
      : (+new Date(getValue(b, key)) || 0) - (+new Date(getValue(a, key)) || 0)
  })

  return sortedData
}

export const basicStringSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) => {
    return type === SORT_TYPE.ASC
      ? getValue(a, key)
          ?.toUpperCase()
          ?.replaceAll('\\s', '')
          ?.localeCompare(getValue(b, key)?.toUpperCase())
      : getValue(b, key)
          ?.toUpperCase()
          ?.replaceAll('\\s', '')
          ?.localeCompare(getValue(a, key)?.toUpperCase())
  })

  return sortedData
}

export const handleAttendanceBadgeSort = ({
  type = SORT_TYPE.ASC,
  data = [],
  key,
}) => {
  const notMarked = []
  const marked = []
  data.forEach((rowData) => {
    if (
      getValue(rowData, `${key ? `${key}.` : ''}P`) ||
      getValue(rowData, `${key ? `${key}.` : ''}A`)
    ) {
      marked.push(rowData)
    } else {
      notMarked.push(rowData)
    }
  })
  const sortedMarked = basicSort({
    type,
    data: marked,
    key: `${key ? `${key}.` : ''}percentage`,
  })
  return [...sortedMarked, ...notMarked]
}

export const handleAttendanceSort = ({
  type = SORT_TYPE.ASC,
  data = [],
  key,
}) => {
  const notMarked = []
  const absent = []
  const present = []
  data.forEach((rowData) => {
    if (getValue(rowData, `${key ? `${key}.` : ''}P`)) {
      present.push(rowData)
    } else if (getValue(rowData, `${key ? `${key}.` : ''}A`)) {
      absent.push(rowData)
    } else {
      notMarked.push(rowData)
    }
  })
  const sortedPresent = basicSort({
    type,
    data: present,
    key: `${key ? `${key}.` : ''}P`,
  })
  const sortedAbsent = basicSort({
    type,
    data: absent,
    key: `${key ? `${key}.` : ''}A`,
  })
  const sortedNotMarked = basicSort({
    type,
    data: notMarked,
    key: `${key ? `${key}.` : ''}NM`,
  })
  if (type === SORT_TYPE.ASC) {
    return [...sortedPresent, ...sortedAbsent, ...sortedNotMarked]
  }
  return [...sortedNotMarked, ...sortedAbsent, ...sortedPresent]
}

export const handleRollNumberSort = ({
  type = SORT_TYPE.ASC,
  data = [],
  key,
}) => {
  const rollNumberPresent = []
  const rollNumberNotPresent = []
  data.forEach((rowData) => {
    if (getValue(rowData, key)) {
      rollNumberPresent.push(rowData)
    } else {
      rollNumberNotPresent.push(rowData)
    }
  })
  let dataStartingWithAlphabet = []
  let dataStartingWithNumeric = []
  rollNumberPresent.forEach((item) => {
    if (getValue(item, key).match(/^[A-Z]/i)) {
      dataStartingWithAlphabet.push(item)
    } else {
      dataStartingWithNumeric.push(item)
    }
  })
  dataStartingWithNumeric = basicSort({
    type,
    data: dataStartingWithNumeric,
    key,
  })
  dataStartingWithAlphabet = basicStringSort({
    type,
    data: dataStartingWithAlphabet,
    key,
  })
  return [
    ...dataStartingWithNumeric,
    ...dataStartingWithAlphabet,
    ...rollNumberNotPresent,
  ]
}

export const handleEnrollmentrSort = ({
  type = SORT_TYPE.ASC,
  data = [],
  key,
}) => {
  const enrollmentPresent = []
  const enrollmentNotPresent = []
  data.forEach((rowData) => {
    if (getValue(rowData, key)) {
      enrollmentPresent.push(rowData)
    } else {
      enrollmentNotPresent.push(rowData)
    }
  })
  const sortedRollNumber = basicStringSort({
    type,
    data: enrollmentPresent,
    key,
  })
  return [...sortedRollNumber, ...enrollmentNotPresent]
}

// copied from https://stackoverflow.com/questions/3077242/force-download-a-pdf-link-using-javascript-ajax-jquery
export const saveToDisk = ({fileURL, fileName, newtab}) => {
  // for non-IE
  if (!window.ActiveXObject) {
    var save = document.createElement('a')
    save.href = fileURL
    if (newtab) save.target = '_blank'
    save.download = fileName || 'unknown'

    var evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    })
    save.dispatchEvent(evt)
    ;(window.URL || window.webkitURL).revokeObjectURL(save.href)
  }

  // for IE < 11
  else if (!!window.ActiveXObject && document.execCommand) {
    var _window = window.open(fileURL, '_blank')
    _window.document.close()
    _window.document.execCommand('SaveAs', true, fileName || fileURL)
    _window.close()
  }
}
