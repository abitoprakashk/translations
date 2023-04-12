export const ATTENDANCE_WIDGET_TABS = {
  MARKED: 'MARKED',
  NOT_MARKED: 'NOT_MARKED',
}

export const ATTENDANCE_WIDGET_TABLE_OPTIONS = [
  {
    id: ATTENDANCE_WIDGET_TABS.MARKED,
    label: 'marked',
  },
  {
    id: ATTENDANCE_WIDGET_TABS.NOT_MARKED,
    label: 'notMarked',
  },
]

export const EmptyData = {
  day: '',
  P: 0,
  A: 0,
  NM: 0,
  marked: 0,
  not_marked: 0,
  marked_classes: [],
  not_marked_classes: [],
}
