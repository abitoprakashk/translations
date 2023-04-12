export const ddmmyyyyDateChecker = (date) => {
  const dateSplit = date.split('/')
  if (dateSplit.length !== 3) {
    return {status: false, error: 1}
  }
  const monthDaysMapper = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  }
  const dd = dateSplit[0],
    mm = dateSplit[1],
    yyyy = dateSplit[2]
  if (dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) {
    return {status: false, error: 1}
  }
  const day = Number(dd),
    month = Number(mm),
    year = Number(yyyy)
  if (year % 4 === 0) {
    if (year % 100 === 0 && year % 400 === 0) {
      monthDaysMapper[2] = 29
    } else if (year % 100 !== 0) {
      monthDaysMapper[2] = 29
    }
  }
  if (month < 1 || month > 12) {
    return {status: false, error: 2}
  }
  if (day < 1 || day > monthDaysMapper[month]) {
    return {status: false, error: 2}
  }
  return {status: true}
}
