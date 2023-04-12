import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {
  getAllFieldsUsed,
  getFontFormats,
  getFontUrls,
  getTemplateHtml,
  substituteTemplateVariables,
} from '../TemplateGenerator.utils'
import {REACT_APP_TINY_EMC_API_KEY} from '../../../constants'
import {usePageSettings} from '../redux/TemplateGenerator.selectors'
import {pluginList, tinyEmcPageConfig} from '../TemplateGenerator.constants'
import {templatePageSettingsActions} from '../redux/TemplateGenerator.actionTypes'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../Common/Loader/Loader'
import imageBorderRadius from './imageBorderRadius'
import {useElementOutSideClickHandler} from './useElementOutSideClickHandler'
import {Alert, ALERT_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from './TemplateHtmlEditor.module.css'

const TemplateHtmlEditor = ({toolbarMode = 'wrap'}) => {
  const {t} = useTranslation()
  const [dataPopulated, setDataPopulated] = useState(false)
  const {orientation, pagesize, margin} = usePageSettings()
  const templateGenerator = useSelector((store) => store.templateGenerator)
  const [loading, setLoading] = useState(true)
  const [editor, toggleEditor] = useState(true)
  const [htmlContent, setHTMLContent] = useState('')
  const [scrollWarning, setScrollWarning] = useState(false)
  const dispatch = useDispatch()

  const editorRef = useRef(null)
  const templateDataRef = useRef({})
  useEffect(() => {
    dispatch({
      type: templatePageSettingsActions.SET_TINYMCE_REF,
      payload: getFunctions(),
    })
  }, [])

  useEffect(() => {
    if (!editor) {
      toggleEditor(!editor)
    }
  }, [editor])

  useElementOutSideClickHandler(editorRef.current, () => {
    if (
      window?.tinymce &&
      window?.tinymce?.activeEditor?.queryCommandState('ToggleToolbarDrawer')
    )
      window.tinymce.activeEditor?.execCommand('ToggleToolbarDrawer')
  })

  useEffect(() => {
    templateDataRef.current = templateGenerator // storing template data into a ref, as getting info from store was having issue
    const {
      backgroundConfig: {imageUrl, color},
      watermark: {url: watermarkUrl, opacity, size: watermarkSize},
    } = templateGenerator
    if (imageUrl === 'none' && editorRef.current) {
      const editorBody = document.getElementsByClassName(
        'tox-edit-area__iframe'
      )
      if (editorBody?.length) editorBody[0].style.background = 'white'
    } else if (imageUrl && editorRef.current) {
      const editorBody = document.getElementsByClassName(
        'tox-edit-area__iframe'
      )
      if (editorBody?.length) {
        editorBody[0].style.backgroundImage = `url('${imageUrl}')`
        editorBody[0].style.backgroundRepeat = 'no-repeat;'
        editorBody[0].style.backgroundSize = '100% 100%'
      }
    } else if (color && editorRef.current) {
      const editorBody = document.getElementsByClassName(
        'tox-edit-area__iframe'
      )
      if (editorBody?.length) {
        editorBody[0].style.backgroundImage = ``
        editorBody[0].style.backgroundColor = color
      }
    }

    if (!watermarkUrl && editorRef.current) {
      const watermarkTag = editorRef.current.dom.get('editor-watermark-tag')
      watermarkTag?.remove()
    } else if (watermarkUrl && editorRef.current) {
      // const body = editorRef.current.dom.getRoot()
      const style = `opacity:${
        opacity / 100
      };width:${watermarkSize}%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);z-index:-1;pointer-events: none;`

      const watermarkTag = editorRef.current.dom.get('editor-watermark-tag')
      if (!watermarkTag) {
        editorRef.current.dom.add(editorRef.current.getBody(), 'img', {
          src: watermarkUrl,
          style: style,
          id: 'editor-watermark-tag',
        })
      } else {
        watermarkTag.setAttribute('src', watermarkUrl)
        watermarkTag.style.cssText = style
      }
    }
    if (templateGenerator?._id && editorRef.current && !dataPopulated) {
      insertHTML(templateGenerator.body)
      setDataPopulated(true)
    }
  }, [templateGenerator, loading])

  const getEditorContent = () => {
    // getEditorContent: get only the body of the tinyemc container
    let content = editorRef.current.getContent()
    content = content.replace(/<img(.*?)id="editor-watermark-tag"(.*?)>/gm, '')
    return content
  }

  const getCompleteHTML = () => {
    const {
      backgroundConfig: {imageUrl, color},
      watermark: {url, opacity, size},
      pageSettings,
    } = templateDataRef.current

    const html = substituteTemplateVariables(getEditorContent())
    return getTemplateHtml({
      orientation,
      pagesize,
      content: html,
      margin: pageSettings.margin,
      imageUrl,
      color,
      watermarkUrl: url,
      watermarkOpacity: opacity,
      watermarkSize: size,
    })
  }

  const addText = ({value, id, name, category}) => {
    editorRef.current.focus()
    editorRef.current.execCommand(
      'mceInsertContent',
      false,
      `<abbr data-identifier='${id}' data-category='${category}' data-name='${name}'>${value}</abbr>`
    )
  }

  const getFieldsUsed = () => {
    const content = editorRef.current.getContent()
    return getAllFieldsUsed(content)
  }

  const addDynamicField = ({id, name, category}) => {
    editorRef.current.focus()
    editorRef.current.execCommand(
      'mceInsertContent',
      false,
      `<abbr class='dynamic-data' data-id='{{${category}.${id}}}'  data-category='${category}' data-identifier='${id}' data-name='${name}'>${name}</abbr> `
    )
  }

  const addImage = ({
    url,
    id,
    name,
    category,
    isDynamic,
    hideImageOptions = false,
    width = 200,
  }) => {
    editorRef.current.focus()
    let str = ''
    if (!id) str = `<abbr><img src="${url}" alt="" width="${width}"></abbr>`
    else if (isDynamic)
      str = `<abbr data-id='{{${category}.${id}}}' data-category='${category}' data-identifier='${id}' data-name='${name.replace(
        "'s",
        ''
      )}'><img ${
        hideImageOptions ? `class='noImageOptions'` : ``
      } src="${url}" alt="" width="${width}"></abbr>`
    else
      str = `<abbr data-category='${category}' data-identifier='${id}' data-name='${name.replace(
        "'s",
        ''
      )}'><img ${
        hideImageOptions ? `class='noImageOptions'` : ``
      } src="${url}" alt="" width="75"></abbr>`
    editorRef.current.execCommand('mceInsertContent', false, str)
  }

  const insertHTML = (html) => {
    editorRef.current.focus()
    editorRef.current.execCommand('insertHTML', false, html)
  }

  const resetEditor = (obj = {contentAfterReset: ''}) => {
    editorRef.current.editorManager.remove()
    toggleEditor(!editor)
    setLoading(true)
    if ('contentAfterReset' in obj) {
      setHTMLContent(obj.contentAfterReset)
    }
  }
  const getFunctions = useCallback(() => {
    return {
      getEditorContent,
      getFieldsUsed,
      addDynamicField,
      addText,
      addImage,
      insertHTML,
      resetEditor,
      getCompleteHTML,
    }
  }, [])

  const checkIfScrolling = (editor) => {
    if (
      editor.dom.getRoot().parentNode.scrollHeight >
      editorRef.current.initialHTMLHeight
    ) {
      setScrollWarning(true)
    } else setScrollWarning(false)
  }

  return (
    <div>
      <Loader show={loading} />
      {editor && (
        <>
          {scrollWarning && (
            <div
              className={styles.alert}
              style={{
                width: `${tinyEmcPageConfig[pagesize][orientation].width}px`,
              }}
            >
              <Alert
                type={ALERT_CONSTANTS.TYPE.WARNING}
                content={t('templateGenerator.overflowWarning')}
                hideClose
              ></Alert>
            </div>
          )}
          <Editor
            initialValue={htmlContent ? htmlContent : ''}
            apiKey={REACT_APP_TINY_EMC_API_KEY}
            cloudChannel="6"
            onInit={(evt, editor) => {
              editorRef.current = editor
              setLoading(false)
              editorRef.current.initialHTMLHeight =
                editor.dom.getRoot().parentNode.clientHeight
              editor.on('input', () => {
                checkIfScrolling(editor)
              })
              editor.on('NewBlock', () => {
                checkIfScrolling(editor)
              })
              editor.on('Click', () => {
                if (
                  window?.tinymce?.activeEditor.queryCommandState(
                    'ToggleToolbarDrawer'
                  )
                )
                  window.tinymce.activeEditor.execCommand('ToggleToolbarDrawer')
              })
              editor.on('KeyDown', function (e) {
                if (
                  (e.code == 'Backspace' || e.code == 'Delete') &&
                  editor.selection
                ) {
                  var selectedNode = editor.selection.getNode() // get the selected node (element) in the editor
                  if (
                    selectedNode &&
                    selectedNode.nodeName == 'ABBR' &&
                    selectedNode.className === 'dynamic-data'
                  ) {
                    selectedNode.remove()
                  }
                  checkIfScrolling(editor)
                }
              })
            }}
            init={{
              width: `${tinyEmcPageConfig[pagesize][orientation].width}px`,
              height: `${tinyEmcPageConfig[pagesize][orientation].height}px`,
              menubar: false,
              branding: true,
              resize: false,
              elementpath: false,
              quickbars_selection_toolbar: false,
              quickbars_insert_toolbar: false,
              contextmenu: '',
              object_resizing: ':not(.noImageOptions)',
              toolbar_mode: toolbarMode,
              setup: (editor) => {
                window?.tinymce?.PluginManager.add(
                  'imageRadius',
                  imageBorderRadius
                )
                editor.ui.registry.addContextToolbar(
                  'imageRadiusContextToolbar',
                  {
                    predicate: (node) =>
                      node.nodeName.toLowerCase() === 'img' &&
                      node.src &&
                      node.className !== 'noImageOptions',
                    items: 'imageRadius',
                    position: 'node',
                    scope: 'node',
                  }
                )
              },
              plugins: pluginList,
              toolbar:
                'blocks | ' +
                ' pagebreak ' +
                'bold italic | fontsize fontfamily forecolor | lineheight | undo redo | table | alignleft aligncenter ' +
                'alignright alignjustify bullist numlist',
              font_family_formats: getFontFormats(),
              content_css: getFontUrls(),
              font_size_formats:
                '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 60pt 72pt 96pt',
              line_height_formats: '0.1 0.2 0.3 0.5 0.75 1 1.2 1.4 1.6 1.8 2 3',
              nonbreaking_force_tab: true,
              content_style: `@page {
              size: ${pagesize} ${orientation};
              margin: 0;
          }
          body{
            font-size: ${tinyEmcPageConfig[pagesize][orientation].fontSize};
            margin: ${margin.top || 0}cm ${margin.right || 0}cm ${
                margin.bottom || 0
              }cm ${margin.left || 0}cm;
          font-family: 'Lato', sans-serif;
          line-height: 1;
          font-size: 12pt;
          }
          .dynamic-data{
            background: #EFF9FF;
            border-radius: 4px;
            border: 1px solid #e8ecf4;
          }
          `,
            }}
          />
        </>
      )}
    </div>
  )
}

export default TemplateHtmlEditor
