export const calendarItemDeletedReducer = (
  state = {status: false, id: null},
  {type, payload}
) => {
  switch (type) {
    case 'calendar_item_deleted_event':
      return payload
    default:
      return state
  }
}
