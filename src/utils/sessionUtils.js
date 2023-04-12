import {DateTime} from 'luxon'

export const getNextActiveSessionId = (sessions) => {
  const {sessionsWithCurrentDateInRange, sessionsWithCurrentDateNotInRange} =
    segregateSessionsBasedOnCurrentDate(sessions)

  return sessionsWithCurrentDateInRange.length
    ? getLastUpdatedActiveSessionId(sessionsWithCurrentDateInRange)
    : getLastUpdatedActiveSessionId(sessionsWithCurrentDateNotInRange)
}

const segregateSessionsBasedOnCurrentDate = (sessions) => {
  const currentDate = DateTime.now().toMillis()
  const sessionsWithCurrentDateInRange = []
  const sessionsWithCurrentDateNotInRange = []

  sessions.forEach((session) => {
    if (isWithinBounds(currentDate, session.start_time, session.end_time)) {
      sessionsWithCurrentDateInRange.push(session)
    } else {
      sessionsWithCurrentDateNotInRange.push(session)
    }
  })

  return {sessionsWithCurrentDateInRange, sessionsWithCurrentDateNotInRange}
}

/**
 * Returns last updated active session id
 * If no active sessions are present, returns the last updated inactive session
 */
const getLastUpdatedActiveSessionId = (allSessions) => {
  const activeSessions = allSessions.filter((session) => session.active_status)
  const sessions = activeSessions.length ? activeSessions : allSessions

  let lastUpdated = sessions[0]
  for (let i = 1; i < sessions.length; i++) {
    if (lastUpdated.u < sessions[i].u) {
      lastUpdated = sessions[i]
    }
  }

  return lastUpdated?._id
}

export const getLastCreatedSession = (sessions = []) => {
  let lastCreated = sessions[0]
  for (let i = 1; i < sessions.length; i++) {
    if (lastCreated.c < sessions[i].c) {
      lastCreated = sessions[i]
    }
  }

  return lastCreated
}

export const sortSessionsByCreationDate = (sessions) =>
  sessions.sort((sessionA, sessionB) => sessionB.c - sessionA.c)

const isWithinBounds = (value, min, max) => value >= min && value <= max
