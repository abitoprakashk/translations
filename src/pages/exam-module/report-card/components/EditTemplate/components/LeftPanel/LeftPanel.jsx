import {lazy, Suspense, useEffect, useRef, useState} from 'react'
import {
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Input,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import styles from './LeftPanel.module.css'

import {events} from '../../../../../../../utils/EventsConstants'
import ReportCardAccordion from './components/ReportCardAccordion/ReportCardAccordion'
import ReportCardModal from './components/ReportCardModal/ReportCardModal'
import ScholasticBlock from './components/ScholasticBlock/ScholasticBlock'
import {
  EDIT_TEMPLATE_SECTIONS,
  TEMPLATE_SECTIONS_ID,
} from '../../../../constants'
import UserProfileComponent from '../../../../../../user-profile/UserProfileComponent'
// import ConfirmationPopup from '../../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'

const CoScholasticBlock = lazy(() =>
  import('./components/CoScholasticBlock/CoScholasticBlock')
)
const AdditionalInfo = lazy(() =>
  import('./components/AdditionalInfo/AdditionalInfo')
)

function scrollToTargetAdjusted(target, scrollingElement) {
  scrollingElement.scrollTo({
    top: Math.max(target.offsetTop - 72, 0),
    behavior: 'auto',
  })
}

const headingOrder = {
  [EDIT_TEMPLATE_SECTIONS.HEADER]: 0,
  [EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS]: 1,
  [EDIT_TEMPLATE_SECTIONS.SCHOLASTIC]: 2,
  [EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC]: 3,
  [EDIT_TEMPLATE_SECTIONS.ADDITIONAL_INFO]: 4,
}

const LeftPanel = ({
  data,
  setData,
  handleChange,
  objToSave,
  setObjToSave,
  activeTab,
  setActiveTab,
  setDisablePublish,
  userEventHandler,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [showInstitute, setShowInstitute] = useState(false)
  const [modalProps, setModalProps] = useState({})
  const [section, setSection] = useState(null)
  const {t} = useTranslation()
  const accrodianList = useRef()
  const controlBtnList = useRef()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const standard = useSelector((state) => state.reportCard?.activeStandard)

  const [intersection, setIntersection] = useState([])
  const intersectionList = useRef()

  intersectionList.current = intersection

  const clickScrollIsInProgress = useRef(false)

  useEffect(() => {
    setData({...data, institute_details: instituteInfo})
  }, [instituteInfo])

  useEffect(() => {
    const names = Object.values(EDIT_TEMPLATE_SECTIONS)
    const targets = Array.from(accrodianList.current?.children || '')
    targets.forEach((el, index) => {
      el.id = names[index]
      el.dataset.index = index
    })

    const krayonRCContainer = document.getElementById('krayonRCContainer')

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickScrollIsInProgress.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const set = new Set(intersectionList.current || [])
            set.add(entry.target.id)
            setIntersection([...set])
          } else {
            const set = new Set(intersectionList.current || [])
            set.delete(entry.target.id)
            setIntersection([...set])
          }
        }
      },
      {
        // 72 is the height of fixed tabs
        rootMargin: `30px 0px -${krayonRCContainer.offsetHeight - 72}px 0px`,
        root: krayonRCContainer,
      }
    )

    targets.forEach((el) => observer.observe(el))

    setActiveTab(targets[0].id)

    return () => {
      observer.disconnect()
    }
  }, [controlBtnList, standard, clickScrollIsInProgress])

  useEffect(() => {
    if (intersection.length) {
      const id = intersection.sort((a, b) => headingOrder[a] - headingOrder[b])[
        intersection.length - 1
      ]

      setActiveTab(id)
      const activeAccordian = document.getElementById(id)
      const index = Array.from(accrodianList.current).indexOf(activeAccordian)
      const activeBtn = controlBtnList.current?.children[index]
      // only scroll on x
      activeBtn?.parentElement.scrollTo(
        activeBtn.offsetLeft +
          activeBtn.scrollWidth -
          activeBtn.parentElement.offsetWidth,
        0
      )

      userEventHandler(events.REPORT_CARD_TAB_CLICKED_TFI, {
        class_id: standard?.id,
        tab_type: id,
        click_type: 'scroll',
      })
    } else {
      setActiveTab(EDIT_TEMPLATE_SECTIONS.HEADER)
    }
  }, [intersection, accrodianList])

  const handleTitleChange = (obj) => {
    handleChange(obj)
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) => item.meta.template_section_id === TEMPLATE_SECTIONS_ID.HEADER
    )
    let params = [...fetchParams[index].params]
    let paramIndex = params.findIndex((item) => item.id === 'report_card_title')
    params[paramIndex] = {...params[paramIndex], value: obj.value}
    fetchParams[index] = {...fetchParams[index], params: params}
    setObjToSave({
      ...objToSave,
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const renderManageButton = (headerType, sectionText, options) => {
    return (
      <Button
        type={BUTTON_CONSTANTS.TYPE.TEXT}
        prefixIcon="settings"
        onClick={() => {
          userEventHandler(events.REPORT_CARD_MANAGE_CLICKED_TFI, {
            header_type: headerType,
            sub_header_type: sectionText,
          })
          setSection(sectionText)
          setShowModal(true)
          setModalProps(options)
        }}
      >
        {t('manage')}
      </Button>
    )
  }

  const renderStudentFields = () => {
    return data.params_student_details?.map((item) => (
      <li key={item.id}>
        <div>{item.label}</div>
      </li>
    ))
  }

  const onTabClick = (e, index) => {
    clickScrollIsInProgress.current = true
    const accordianTarget = accrodianList.current?.children[index]
    setActiveTab(accordianTarget.id)
    // e.target?.scrollIntoView({behaviour: 'auto'})
    // open accoridan if not open
    if (accordianTarget.childElementCount == 1) {
      accordianTarget?.firstChild?.click()
    }
    setTimeout(() => {
      // accordianTarget?.scrollIntoView()
      const krayonRCContainer = document.getElementById('krayonRCContainer')
      scrollToTargetAdjusted(accordianTarget, krayonRCContainer)
      clickScrollIsInProgress.current = false
    }, 100)

    userEventHandler(events.REPORT_CARD_TAB_CLICKED_TFI, {
      class_id: standard?.id,
      tab_type: e.currentTarget?.dataset.name,
      click_type: 'click',
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollTabs} ref={controlBtnList}>
        {Object.values(EDIT_TEMPLATE_SECTIONS)
          .slice(0, 5)
          .map((text, index) => (
            <Button
              key={text}
              classes={{
                button: classNames(styles.scrollTabItem, {
                  [styles.activeTab]: activeTab == text,
                }),
              }}
              onClick={(e) => onTabClick(e, index)}
              data-name={text}
            >
              {t(text)}
            </Button>
          ))}
      </div>
      <div
        className={classNames(styles.accordianRoot)}
        id="accordianRoot"
        ref={accrodianList}
      >
        <ReportCardAccordion header={t(EDIT_TEMPLATE_SECTIONS.HEADER)}>
          <div className={styles.blockContainer}>
            <div className={styles.blockHeader}>
              <Heading
                className={styles.marginBottom}
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
              >
                {t('basicDetails')}
              </Heading>

              <Button
                type={BUTTON_CONSTANTS.TYPE.TEXT}
                onClick={() => {
                  userEventHandler(
                    events.REPORT_CARD_EDIT_SCHOOL_DETAILS_CLICKED_TFI
                  )
                  setShowInstitute(true)
                }}
              >
                {t('editSchoolDetails')}
              </Button>
            </div>
            <div className={styles.imageWrapper}>
              <img src={instituteInfo.ins_logo} className={styles.image} />
            </div>
            <div className={styles.gradesSubtext}>{t('instituteName')}</div>
            <Para
              className={styles.marginBottom}
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {instituteInfo.name}
            </Para>
            <div className={styles.gradesSubtext}>{t('instituteAddress')}</div>
            <Para
              className={styles.marginBottom}
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {instituteInfo?.address?.line1}, {instituteInfo.address?.line2},{' '}
              {instituteInfo.address?.city}, {instituteInfo.address?.state},{' '}
              {instituteInfo.address?.pin}
            </Para>
            <Input
              type="text"
              title={t('reportCardTitle')}
              fieldName="title"
              value={data.title}
              isRequired={true}
              onChange={handleTitleChange}
              maxLength={50}
            />
          </div>
        </ReportCardAccordion>
        <ReportCardAccordion header={t(EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS)}>
          <div className={styles.blockContainer}>
            <div className={styles.blockHeader}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                {t('basicDetails')}
              </Heading>
              {renderManageButton(
                EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS,
                EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS
              )}
            </div>
            <ul className={styles.list}>{renderStudentFields()}</ul>
          </div>
        </ReportCardAccordion>
        <ReportCardAccordion header={t(EDIT_TEMPLATE_SECTIONS.SCHOLASTIC)}>
          <ScholasticBlock
            renderManageButton={(...args) =>
              renderManageButton(EDIT_TEMPLATE_SECTIONS.SCHOLASTIC, ...args)
            }
            data={data}
            handleChange={handleChange}
            objToSave={objToSave}
            setObjToSave={setObjToSave}
            setDisablePublish={setDisablePublish}
            userEventHandler={userEventHandler}
          />
        </ReportCardAccordion>
        <ReportCardAccordion header={t(EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC)}>
          <Suspense fallback="loading...">
            <CoScholasticBlock
              renderManageButton={(...args) =>
                renderManageButton(
                  EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC,
                  ...args
                )
              }
              data={data}
              objToSave={objToSave}
              setObjToSave={setObjToSave}
              handleChange={handleChange}
              userEventHandler={userEventHandler}
            />
          </Suspense>
        </ReportCardAccordion>
        <ReportCardAccordion header={t(EDIT_TEMPLATE_SECTIONS.ADDITIONAL_INFO)}>
          <Suspense fallback="loading...">
            <AdditionalInfo
              renderManageButton={(...args) =>
                renderManageButton(
                  EDIT_TEMPLATE_SECTIONS.ADDITIONAL_INFO,
                  ...args
                )
              }
              data={data}
              handleChange={handleChange}
              objToSave={objToSave}
              setObjToSave={setObjToSave}
              userEventHandler={userEventHandler}
            />
          </Suspense>
        </ReportCardAccordion>
      </div>
      {showModal && (
        <ReportCardModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          section={section}
          data={data}
          setData={setData}
          objToSave={objToSave}
          setObjToSave={setObjToSave}
          userEventHandler={userEventHandler}
          {...modalProps}
        />
      )}
      {showInstitute && (
        <UserProfileComponent
          userType="institute"
          setSliderScreen={() => setShowInstitute(false)}
        />
      )}
      {/* {showInstitute && (
        <ConfirmationPopup
          onClose={() => setShowConfirmModal(false)}
          onAction={() => {
            setShowConfirmModal(false)
            handleSaveTemplate()
          }}
          title={t('changeTemplateTitleText')}
          desc={t('changeTemplateDescText')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('update')}
        /> />
      )} */}
    </div>
  )
}

export default LeftPanel
