import {
  getTemplateBackground,
  getUniqueFontListFromHtml,
  getWaterMark,
} from '../../components/TemplateGenerator/TemplateGenerator.utils'
import {idPageSizeConfig} from './CustomId.constants'

export const generateHTMLSkeletonIDCard = ({
  pageHeight,
  pageWidth,
  content,
  margin,
}) => {
  const fontsImportStatement = getUniqueFontListFromHtml(content)

  const html = `<html>
  <head>
     <style>
     ${fontsImportStatement}
     @page {
      ${
        pageWidth
          ? `size: ${pageWidth}px ${pageHeight}px;  margin: ${
              margin?.top || 0
            }px ${margin?.right || 0}px ${margin?.bottom || 0}px ${
              margin?.left || 0
            }px;`
          : ''
      };
    }
    @media print {
      .page {
        break-inside: avoid;
      }
    }
    ${
      pageWidth
        ? `html {
     padding: 0;
     line-height:1;
     -webkit-print-color-adjust: exact;
     font-family: 'Lato', sans-serif;
     font-size: 12pt;
     border: 0;
   }
   body{
    margin: ${margin?.top || 0}px ${margin?.right || 0}px ${
            margin?.bottom || 0
          }px ${margin?.left || 0}px !important;
         font-size: 12pt;
         -webkit-print-color-adjust: exact;  
          word-break: break-word;
   }`
        : ` html {
            padding: 0;
            line-height:1;
            -webkit-print-color-adjust: exact;
            font-family: 'Lato', sans-serif;
            font-size: 12pt;
            border: 0;
          }
        body{
         margin:0;
          font-size: 12pt;
          -webkit-print-color-adjust: exact;  
            word-break: break-word;
        }`
    }
   .page{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
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
     <div style="position:relative">
       ${content}
     </div>
  </body>
</html>
  `

  return html
}

export const getHtmlForIndividualId = ({
  frontTemplate,
  backTemplate,
  orientation,
}) => {
  const content = `
    <section>
            ${getIdPage(frontTemplate, orientation)}
            ${backTemplate ? getIdPage(backTemplate, orientation) : ''}
    </section>
    `
  return content
}

export const generateIdHTMLWithSinglePage = (template, orientation) => {
  const content = getIdPage(template, orientation)
  return generateHTMLSkeletonIDCard({
    pageHeight: idPageSizeConfig.IDCARD[orientation]?.height,
    pageWidth: idPageSizeConfig.IDCARD[orientation]?.width,
    content,
  })
}

export const generateIdHTMLTemplate = (template, orientation) => {
  const content = getIdPage(template, orientation)
  return generateHTMLSkeletonIDCard({
    content,
  })
}

export const wrapContentInLiquidJsStyleLoop = (content) => {
  return `{%- for item in users %}
  {% assign INSTITUTE = item.INSTITUTE %}
   {% assign IMIS = item.IMIS %}
   {% assign CODE = item.CODE %}
    ${content}
    {%- endfor%}`
}

export const getIdPage = (template, orientation) => {
  const {
    backgroundConfig,
    watermark,
    body,
    pageSettings: {margin},
  } = template
  return `<div class='page' style="${getTemplateBackground(
    backgroundConfig?.imageUrl,
    backgroundConfig.color
  )} width:${idPageSizeConfig.IDCARD[orientation].width}px; height:${
    idPageSizeConfig.IDCARD[orientation].height
  }px;">
    ${getWaterMark(watermark?.url, watermark?.opacity, watermark?.size)}
    <div style="position:relative; padding: ${margin.top || 0}cm ${
    margin.right || 0
  }cm ${margin.bottom || 0}cm ${margin.left || 0}cm;">
        ${body || ''}
    </div>
</div>`
}
