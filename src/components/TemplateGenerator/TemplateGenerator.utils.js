import {FONT_MAP} from './TemplateGenerator.constants'

export const getTemplateBackground = (imageUrl, color) => {
  if (imageUrl) {
    return `background: #ffffff00 url('${imageUrl}') no-repeat;
            background-size: 100% 100%;`
  } else return ` background-color: ${color};`
}

export const pageSizes = {
  A4: {
    PORTRAIT: {height: '841', width: '595'},
    LANDSCAPE: {
      height: '595',
      width: '841',
    },
  },
  LETTER: {
    PORTRAIT: {height: '841', width: '595'},
    LANDSCAPE: {
      height: '595',
      width: '841',
    },
  },
  IDCARD: {
    PORTRAIT: {height: '508', width: '319'},
    LANDSCAPE: {
      height: '318',
      width: '508',
    },
  },
}

export const getWaterMark = (url, opacity, watermarkSize) => {
  if (!url) return ''
  return `<div class='watermark' style="opacity:${
    opacity / 100
  }; width:${watermarkSize}%">
    <img src='${url}' style="width:100%"/> 
  </div>`
}

export const getTemplateHtml = ({
  orientation,
  pagesize,
  content,
  margin,
  imageUrl,
  color,
  watermarkUrl,
  watermarkOpacity,
  watermarkSize,
}) => {
  const config = `<html>
     <head>
        <style>
        ${getUniqueFontListFromHtml(content)}
        @page {
         size: ${pageSizes[pagesize][orientation].width}px ${
    pageSizes[pagesize][orientation].height
  }px;
       }
       html {
        margin: 0;
        padding: 0;
        line-height:1;
        -webkit-print-color-adjust: exact;
        ${getTemplateBackground(imageUrl, color)}
        font-family: 'Lato', sans-serif;
        font-size: 12pt;
      }
      body{
            margin: 0;
            font-size: 12pt;
            -webkit-print-color-adjust: exact;
            ${getTemplateBackground(imageUrl, color)}
            margin: 0;
            line-height:1;
            padding: ${margin.top || 0}cm ${margin.right || 0}cm ${
    margin.bottom || 0
  }cm ${margin.left || 0}cm;
  word-break: break-word;
      }
      .watermark{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
        </style>
     </head>
     <body>
        ${getWaterMark(watermarkUrl, watermarkOpacity, watermarkSize)}
        <div style="position:relative">
          ${content}
        </div>
     </body>
  </html>`
  return config
}

export const substituteTemplateVariables = (htmlString) => {
  const div = document.createElement('div')
  div.innerHTML = htmlString.trim()
  const fragment = document.createDocumentFragment()
  fragment.append(div)
  const abbrTags = fragment.querySelectorAll('abbr')
  for (let i = 0; i < abbrTags.length; i++) {
    const item = abbrTags[i]
    const id = item.getAttribute('data-id')
    const imgTag = item.querySelectorAll('img')
    if (imgTag?.length && id) {
      imgTag[0].setAttribute('src', id)
    } else if (id) item.innerText = id
  }
  const serializer = new XMLSerializer()
  const documentFragmentString = serializer.serializeToString(fragment)
  return documentFragmentString
}

export const getAllFieldsUsed = (htmlString) => {
  const div = document.createElement('div')
  div.innerHTML = htmlString.trim()
  const fragment = document.createDocumentFragment()
  fragment.append(div)
  const abbrTags = fragment.querySelectorAll('abbr')
  const fields = {}
  for (let i = 0; i < abbrTags.length; i++) {
    const item = abbrTags[i]
    const category = item.getAttribute('data-category')
    const id = item.getAttribute('data-identifier')
    const name = item.getAttribute('data-name')
    if (!(category in fields) && category) {
      fields[category] = []
    }
    if (category) fields[category].push({id, name})
  }
  return fields
}

export const generateIdFromString = (str) => {
  return str.trim().replaceAll(' ', '_').toLowerCase()
}

export const getFontFormats = () => {
  let str = ''
  Object.entries(FONT_MAP).forEach(([key, data]) => {
    str += `${data.name}=${key}; `
  })
  return str.substring(0, str.length - 1)
}

export const getFontUrls = () => {
  return Object.values(FONT_MAP).map((item) => item.url)
}

export const getUniqueFontListFromHtml = (htmlStr) => {
  const reg = /font-family: (.*?);/g

  const array = Array.from(htmlStr.matchAll(reg)).map((match) => match[1])
  const usedFonts = [...new Set(array)]
  let urls = ''
  Object.entries(FONT_MAP).map(([key, item]) => {
    if (usedFonts.includes(key)) urls += `${item.importUrl}\n`
  })
  return urls
}

export const getAllImages = (str) => {
  let imageList = []
  let imageTag // 1st index contains the actual URL
  let regx = /<img[^>]+src="?([^"\s]+)"?\s*/gi // regex to find image tags

  while ((imageTag = regx.exec(str))) {
    imageList.push(imageTag[1])
  }
  return imageList
}

export const replaceInstituteFields = (
  data,
  instituteFields,
  intituteValues
) => {
  const instituteValuesModified = {}
  intituteValues.map((item) => {
    if (item.is_image)
      instituteValuesModified[item.id] = item.value || item.default_value
    else instituteValuesModified[item.id] = item.value || ''
  })
  if (instituteFields && instituteFields.length) {
    let str = data
    instituteFields.forEach((item) => {
      str = str.replaceAll(
        `{{INSTITUTE.${item.id}}}`,
        instituteValuesModified[item.id]
      )
    })
    return str
  }
  return data
}
