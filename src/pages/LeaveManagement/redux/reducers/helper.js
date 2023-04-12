export const OPERATION_TYPE = {
  PUSH: 'push',
  PREPEND: 'prepend',
}

export const LEAVE_SORT = {
  ORDER: {
    ASCENDING: 1,
    DESCENDING: 2,
  },
  TYPE: {
    STRING: 1,
    NUMBER: 2,
  },
}

const TOTAL_LEAVE_STATS_KEY = {
  pendingLeaves: 'pending',
  pastLeaves: 'history',
}

const removeFromListFilter =
  (list) =>
  ({_id}) =>
    !list.includes(_id)

const stringComparision = (key, order) => (a, b) =>
  order === LEAVE_SORT.ORDER.DESCENDING
    ? b[key].localeCompare(a[key])
    : a[key].localeCompare(b[key])

const numberComparision = (key, order) => (a, b) =>
  order === LEAVE_SORT.ORDER.DESCENDING ? b[key] - a[key] : a[key] - b[key]

export const addLeavesToDraft = (
  draft,
  leaves,
  {key, operation = OPERATION_TYPE.PUSH}
) => {
  if (Array.isArray(leaves)) {
    const incomingList = leaves.map(({_id}) => _id)

    if (operation === OPERATION_TYPE.PREPEND)
      draft[key].data = [
        ...leaves,
        ...(draft[key]?.data
          ? draft[key]?.data.filter(removeFromListFilter(incomingList))
          : []),
      ]

    if (operation === OPERATION_TYPE.PUSH)
      draft[key].data = [
        ...(draft[key]?.data
          ? draft[key]?.data.filter(removeFromListFilter(incomingList))
          : []),
        ...leaves,
      ]

    return draft
  } else {
    throw new Error('leaves must be an array')
  }
}

export const addLeaveToDraft = (
  draft,
  leave,
  {key, operation = OPERATION_TYPE.PREPEND}
) => {
  const initialLength = draft[key]?.data?.length

  if (operation === OPERATION_TYPE.PREPEND)
    draft[key].data = [
      leave,
      ...(draft[key]?.data
        ? draft[key]?.data.filter(({_id}) => _id != leave._id)
        : []),
    ]

  if (operation === OPERATION_TYPE.PUSH)
    draft[key].data = [
      ...(draft[key]?.data
        ? draft[key]?.data.filter(({_id}) => _id != leave._id)
        : []),
      leave,
    ]

  const updatedLength = draft[key]?.data?.length

  const statsKey = TOTAL_LEAVE_STATS_KEY[key]

  if (
    draft.totalLeaveStats &&
    statsKey in draft.totalLeaveStats &&
    updatedLength > initialLength
  ) {
    // increase respective count
    draft.totalLeaveStats[statsKey] = Math.max(
      draft.totalLeaveStats[statsKey] + (updatedLength - initialLength),
      0
    )
  }

  return draft
}

export const addOrUpdateLeaveToDraft = (
  draft,
  leave,
  {key, operation = OPERATION_TYPE.PUSH}
) => {
  const foundIndex = draft[key].data?.findIndex(
    (item) => item._id === leave._id
  )

  if (foundIndex >= 0) {
    draft[key].data[foundIndex] = leave
    return draft
  }

  return addLeaveToDraft(draft, leave, {key, operation})
}

export const removeLeaveFromDraft = (draft, leave, {key}) => {
  const initialLength = draft[key]?.data?.length
  draft[key].data = draft[key].data?.filter((item) => item._id !== leave?._id)
  const updatedLength = draft[key]?.data?.length

  const statsKey = TOTAL_LEAVE_STATS_KEY[key]
  // update count only if something has removed
  if (
    draft.totalLeaveStats &&
    statsKey in draft.totalLeaveStats &&
    updatedLength == initialLength - 1
  ) {
    // decrease respective count
    draft.totalLeaveStats[statsKey] = Math.max(
      draft.totalLeaveStats[statsKey] - 1,
      0
    )
  }

  return draft
}

export const sortLeaveInDraft = (
  draft,
  {
    key,
    sortKey,
    sortType = LEAVE_SORT.TYPE.NUMBER,
    sortOrder = LEAVE_SORT.ORDER.ASCENDING,
  }
) => {
  if (draft[key].data?.length <= 1) return draft

  if (sortType === LEAVE_SORT.TYPE.STRING) {
    draft[key].data = draft[key]?.data?.sort(
      stringComparision(sortKey, sortOrder)
    )
  }

  if (sortType === LEAVE_SORT.TYPE.NUMBER) {
    draft[key].data = draft[key]?.data?.sort(
      numberComparision(sortKey, sortOrder)
    )
  }
}
