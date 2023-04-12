import {useEffect} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Button, Icon} from '@teachmint/krayon'
import FeeKYC from '../FeeKYC/FeeKYC'
import styles from './FeesPage.module.css'
import '../../../../assets/css/feemodule.css'
import {useRouteMatch} from 'react-router-dom'
import classNames from 'classnames'
import {useSliderScreen} from '../../redux/feeCollectionSelectors'
import {SliderScreens, feeConfigurationTabs} from '../../fees.constants'
import SliderStudentDetail from '../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
// import CollectFeesSlider from '../CollectFeesSlider/CollectFeesSlider'
import CollectFeeModal from '../FeeCollection/components/CollectFeeModal/CollectFeeModal'
import {useDispatch, useSelector} from 'react-redux'
import feeCollectionActionTypes from '../../redux/feeCollectionActionTypes'
import FeeStructureDashboard from '../FeeStructure/Dashboard/Dashboard'
import Dashboard from '../Discounts/Dashboard/Dashboard'
import DiscountSlider from '../Discounts/Slider/DiscountSlider'
import {FeesTabs} from '../FeesPage/FeesTabs'
import history from '../../../../history'
import examMobileImage from '../../../../assets/images/dashboard/exam-mobile.svg'
import feesNewSessionImage from '../../../../assets/images/dashboard/exam-new-session.svg'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {DASHBOARD} from '../../../../utils/SidebarItems'
import {useTranslation} from 'react-i18next'
import feeStructureActionTypes from '../../redux/feeStructure/feeStructureActionTypes'
import StructureSlider from '../FeeStructure/StructureSlider/Slider'
import FeesHelpVideos from '../FeesHelpVideos/FeesHelpVideos'
import {isHierarchyAvailable} from '../../../../utils/HierarchyHelpers'
import CustomStructure from '../FeeStructure/Dashboard/ModifyStructure/CustomStructure'
import NormalStructure from '../FeeStructure/Dashboard/ModifyStructure/NormalStructure'
import PreviousSessionDuesSlider from '../FeeStructure/StructureSlider/PreviousSessionDues/PreviousSessionDuesSlider'
import FeeSettings from '../FeeSettings/FeeSettings'
import PreviousSessionDues from './PreviousSessionDues/PreviousSessionDues'
import Fine from '../Fine/Fine'
import {events} from '../../../../utils/EventsConstants'
import {showEditSessionAction} from '../../../../redux/actions/commonAction'

const FeesConfigurationPage = () => {
  const {t} = useTranslation()

  let {path} = useRouteMatch()
  const {instituteHierarchy, instituteInfo, eventManager} = useSelector(
    (state) => state
  )
  const url = (link) => `${path}/${link}`
  const {sliderScreen, sliderData} = useSliderScreen()
  const dispatch = useDispatch()

  const setSliderScreen = (screen) => {
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: screen,
    })
  }

  useEffect(() => {
    dispatch({type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST})
  }, [])

  const handleImportSession = () => {
    dispatch(showEditSessionAction(true))
  }

  if (!isHierarchyAvailable(instituteHierarchy)) {
    return (
      <div className="mt-32">
        <EmptyScreenV1
          image={feesNewSessionImage}
          title={t('missingClassStructureLabel')}
          desc={t('importFromPrevSessionLabel')}
          btnText={t('importFromPrevSession')}
          btnType="primary"
          handleChange={handleImportSession}
        />
      </div>
    )
  }

  const handleFeeReportBtnPressed = () => {
    history.push(`/institute/dashboard/fee-reports`)
    eventManager.send_event(events.FEE_REPORT_CLICKED_TFI, {
      screenName: 'configuration',
    })
  }

  return (
    <div className={classNames('lg:px-6 lg:pb-6 lg:pt-3', styles.container)}>
      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText={t('goToDashboard')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>
      <div className="hidden lg:block">
        <div
          className={styles.feeReportBtn}
          onClick={() => handleFeeReportBtnPressed()}
        >
          <Button
            category="primary"
            type="outline"
            prefixIconVersion="filled"
            size="m"
            children={<div>&ensp;{t('viewReports')}</div>}
            prefixIcon={<Icon name="graph1" type="primary" size="xx_s" />}
            classes={{button: styles.viewReportBtn}}
          />
        </div>
        <div className="tm-hdg tm-hdg-24 mb-2">{t('feeConfiguration')}</div>
        <nav className={styles.tabMenu}>
          <FeesTabs
            feesTabs={feeConfigurationTabs}
            currency={instituteInfo.currency}
          />
        </nav>
        <hr className={styles.divider} />
        {/* Routes */}
        <Switch>
          <Route path={url('structure')} component={FeeStructureDashboard} />
          <Route path={url('discounts')} component={Dashboard} />
          <Route path={url('fee-fine')} component={Fine} />
          <Route
            path={url('previous-session-dues')}
            component={PreviousSessionDues}
          />
          <Route path={url('settings')} component={FeeSettings} />
          <Route path={url('payment-gateway-setup')} component={FeeKYC} />
          <Route
            path={url('help-videos')}
            component={() => <FeesHelpVideos type="FEE_CONFIGURATION" />}
          />
          <Route exact path={url('')}>
            <Redirect to={url('structure')} />
          </Route>
        </Switch>
        {/* Sliders */}
        {sliderScreen === SliderScreens.STUDENT_DETAILS_SLIDER &&
          sliderData && (
            <SliderStudentDetail
              setSliderScreen={setSliderScreen}
              phoneNumber={sliderData.phoneNumber}
              studentId={sliderData.Id}
              localLoader={false}
              width={'870'}
              selectedSliderTab={sliderData.selectedSliderTab}
            />
          )}
        {sliderScreen === SliderScreens.COLLECT_FEES_SLIDER && sliderData && (
          <CollectFeeModal
            setShowCollectFeeModal={setSliderScreen}
            studentId={sliderData.Id}
            classId={sliderData.classId}
          />
        )}
        {/* {sliderScreen === SliderScreens.FEE_STRUCTURE_SLIDER && sliderData && (
          <FeeStructureSlider
            setSliderScreen={setSliderScreen}
            data={sliderData}
            width={'1000'}
          />
        )} */}
        {sliderScreen === SliderScreens.STRUCTURE_SLIDER && sliderData && (
          <StructureSlider
            setSliderScreen={setSliderScreen}
            data={sliderData}
            width={'1000'}
          />
        )}
        {sliderScreen === SliderScreens.FEE_CATEGORY_MODIFY_SLIDER &&
          sliderData && (
            <NormalStructure
              setSliderScreen={setSliderScreen}
              data={sliderData}
              width={'500'}
            />
          )}
        {sliderScreen === SliderScreens.PREVIOUS_YEAR_DUE_SLIDER &&
          sliderData && (
            <PreviousSessionDuesSlider
              setSliderScreen={setSliderScreen}
              data={sliderData}
              width={'700'}
            />
          )}
        {sliderScreen === SliderScreens.PREVIOUS_YEAR_DUE_MODIFY_SLIDER &&
          sliderData && (
            <CustomStructure
              setSliderScreen={setSliderScreen}
              data={sliderData}
              width={'500'}
            />
          )}
        {sliderScreen === SliderScreens.DISCOUNT_SLIDER && sliderData && (
          <DiscountSlider
            setSliderScreen={setSliderScreen}
            data={sliderData}
            width={'1000'}
          />
        )}
      </div>
    </div>
  )
}

export default FeesConfigurationPage
