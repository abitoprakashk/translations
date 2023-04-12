import {useEffect} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Button, Icon} from '@teachmint/krayon'
import FeeCollection from '../FeeCollection/FeeCollection'
import FeeKYC from '../FeeKYC/FeeKYC'
import styles from './FeesPage.module.css'
import StudentDues from '../StudentDues/StudentDues'
import '../../../../assets/css/feemodule.css'
import {useRouteMatch} from 'react-router-dom'
import classNames from 'classnames'
import {useSliderScreen} from '../../redux/feeCollectionSelectors'
import {SliderScreens, feeCollectionTabs} from '../../fees.constants'
import SliderStudentDetail from '../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
import CollectFeeModal from '../FeeCollection/components/CollectFeeModal/CollectFeeModal'
import {useDispatch, useSelector} from 'react-redux'
import feeCollectionActionTypes from '../../redux/feeCollectionActionTypes'
import FeeTransaction from '../FeeTransaction/FeeTransaction'
import FeeStructureDashboard from '../FeeStructure/Dashboard/Dashboard'
import Dashboard from '../Discounts/Dashboard/Dashboard'
import DiscountSlider from '../Discounts/Slider/DiscountSlider'
import {FeesTabs} from './FeesTabs'
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
import {events} from '../../../../utils/EventsConstants'
// import FeeReports from '../FeeReports/FeeReports'
import CustomStructure from '../FeeStructure/Dashboard/ModifyStructure/CustomStructure'
import NormalStructure from '../FeeStructure/Dashboard/ModifyStructure/NormalStructure'
import PreviousSessionDuesSlider from '../FeeStructure/StructureSlider/PreviousSessionDues/PreviousSessionDuesSlider'
import BankTransaction from '../BankTranscations/BankTransaction'
import FeeSettings from '../FeeSettings/FeeSettings'
import Fine from '../Fine/Fine'
import {DEFAULT_CURRENCY} from '../../../../constants/common.constants'

const FeesPage = () => {
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

  if (!isHierarchyAvailable(instituteHierarchy)) {
    return (
      <div className="mt-32">
        <EmptyScreenV1
          image={feesNewSessionImage}
          title={t('feeEmptyScreenTitle')}
          desc={t('feeEmptyScreenDescription')}
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
        <div className="tm-hdg tm-hdg-24 mb-2">{t('feeCollection')}</div>
        <nav className={styles.tabMenu}>
          <FeesTabs
            feesTabs={feeCollectionTabs}
            currency={instituteInfo.currency}
          />
        </nav>
        <hr className={styles.divider} />
        {/* Routes */}
        <Switch>
          <Route path={url('collection')}>
            <Switch>
              <Route exact path={url('collection')} component={FeeCollection} />
              <Route path={url('collection/dues')} component={StudentDues} />
            </Switch>
          </Route>
          <Route path={url('transactions')} component={FeeTransaction} />
          <Route path={url('config')} component={FeeStructureDashboard} />
          <Route path={url('cheque/status')} component={BankTransaction} />
          <Route path={url('discounts')} component={Dashboard} />
          {(instituteInfo.currency === DEFAULT_CURRENCY ||
            instituteInfo.currency === '' ||
            instituteInfo.currency === null) && (
            <Route path={url('payment-gateway-setup')} component={FeeKYC} />
          )}
          <Route
            path={url('help-videos')}
            component={() => <FeesHelpVideos type="FEE_COLLECTION" />}
          />
          <Route path={url('settings')} component={FeeSettings} />
          <Route path={url('fee-fine')} component={Fine} />
          <Route exact path={url('')}>
            {/* <Redirect to={url('config')} /> */}
            <Redirect to={url('collection')} />
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

export default FeesPage
