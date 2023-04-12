import {Duration} from 'luxon'
import {generatePath} from 'react-router-dom'
import {CLASS_LIST_COUNT_KEY} from './constants'

export const spaceReplaceWithUnderscore = (str) => {
  return str.replace(/\s+/g, '_')
}

export const underscoreReplaceWithSpace = (str) => {
  return str.replace(/_/g, ' ')
}

export const videoDurationConverter = (duration, format = 'mm:ss') => {
  return Duration.fromObject({seconds: parseInt(duration)}).toFormat(format)
}

export const getUrlWithParams = (path, params) => {
  const nonEmptyParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value && String(value).length) {
      acc[key] = value
    }
    return acc
  }, {})

  return generatePath(path, nonEmptyParams)
}

export const getContentStats = (itemsList) =>
  itemsList?.reduce((acc, curr) => {
    const {_id, name, stats = {}} = curr

    if (stats.lectures_count || stats.study_material_count) {
      acc[_id] = {
        name,
        [CLASS_LIST_COUNT_KEY.video]: stats.lectures_count,
        [CLASS_LIST_COUNT_KEY.studyMaterial]: stats.study_material_count,
      }
    }

    return acc
  }, {})
