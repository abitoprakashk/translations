import React from 'react'
// import styles from './ScoreCardProgressBar.module.css'
import './index.css'
import {useTranslation} from 'react-i18next'
import SemiCircleProgressBar from '../semiCircularProgressBar/index'

export default function ScoreCardProgressBar({
  isTeacher = true,
  paperMarks = 100,
  totalMarks = 0,
  avgScore = 0,
  top10AvgScore = 0,
}) {
  const toFixedIfNecessary = (value, dp) => +parseFloat(value).toFixed(dp)
  const {t} = useTranslation()
  // console.log('scoreCard pops value', totalMarks, avgScore, top10AvgScore)

  const card1Info = {
    title: t('classAverage'),
    score: '80',
    tMark: totalMarks,
    avScore: avgScore,
  }
  const card2Info = {
    title: t('classTop10'),
    score: '50',
    tMark: totalMarks,
    t10avgScore: top10AvgScore,
  }
  const percentage1 = ((card1Info.score / paperMarks) * 100).toFixed(1)
  const percentage2 = ((card2Info.score / paperMarks) * 100).toFixed(1)

  // const cssCard = {
  //   outerCont: isTeacher
  //     ? '#ffffff'
  //     : percentage1 >= 67
  //     ? '#36B37E'
  //     : percentage1 >= 34
  //     ? '#EEA036'
  //     : '#EB5757',
  //   mainTextColor: isTeacher ? '#1f3965' : '#ffffff',
  //   paraTextColor: isTeacher
  //     ? '#6B82AB'
  //     : percentage1 >= 67
  //     ? '#B2F5D9'
  //     : percentage1 >= 34
  //     ? '#FFE0B7'
  //     : '#F6D3D3',
  //   percentageColor: isTeacher ? '#1f3965' : '#ffffff',
  //   borderCol: isTeacher
  //     ? '#DBE2EA'
  //     : percentage1 >= 64
  //     ? '#298F64'
  //     : percentage1 >= 34
  //     ? '#BE7E28'
  //     : '#B53F3F',
  //   TimerClock: isTeacher
  //     ? percentage1 >= 67
  //       ? TimeGreen
  //       : percentage1 >= 34
  //       ? TimerOrange
  //       : TimerGray
  //     : TimerWhite,
  //   TimertextColor: isTeacher
  //     ? percentage1 >= 67
  //       ? '#36B37E'
  //       : percentage1 >= 34
  //       ? '#F5A62E'
  //       : '#EB5757'
  //     : '#ffffff',
  // }

  return (
    <div className="score-card-cont">
      <div className="sc-inner-cont scoreCardShadow tm-border-radius1 ">
        <div className="sc-inner-cont-heading sc-topbar tm-para tm-para-14 py-5">
          {card1Info.title}
        </div>
        <div className="sc-inner-cont-body">
          <div className="sc-inner-cont-body-upper ">
            <div style={{position: 'relative'}}>
              <div className="tm-para3 sc-inner-cont-body-upper-heading">
                {toFixedIfNecessary(percentage1, 2)}%
              </div>
              <SemiCircleProgressBar
                percentage={percentage1}
                diameter={135}
                strokeWidth={7}
                background={'#F7F9FC'}
                stroke={'#F5A62E'}
                child={
                  <div
                    className="absolute bottom-[-5px] left-[35%]"
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '35%',
                    }}
                  >
                    <div>
                      <span
                        className="qcont-font-16"
                        // style={{color: cssCard.percentageColor}}
                      >
                        {card1Info.score}
                      </span>
                      <span
                        className="tm-para3 qcont-font-10"
                        // style={{color: cssCard.paraTextColor}}
                      >
                        /{paperMarks}
                      </span>
                    </div>
                    <div
                      className="tm-para3 text-center qcont-font-14 "
                      // style={{color: cssCard.paraTextColor}}
                    >
                      {t('marks')}
                    </div>
                  </div>
                }
                isTeacher={isTeacher}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sc-inner-cont scoreCardShadow tm-border-radius1 ">
        <div className="sc-inner-cont-heading sc-topbar tm-para tm-para-14 py-5">
          {card2Info.title}
        </div>
        <div className="sc-inner-cont-body">
          <div className="sc-inner-cont-body-upper ">
            <div style={{position: 'relative'}}>
              <div className="tm-para3 sc-inner-cont-body-upper-heading">
                {toFixedIfNecessary(percentage2, 2)}%
              </div>
              <SemiCircleProgressBar
                percentage={percentage2}
                diameter={135}
                strokeWidth={7}
                background={'#F7F9FC'}
                stroke={'#F5A62E'}
                child={
                  <div
                    className="absolute bottom-[-5px] left-[35%]"
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '35%',
                    }}
                  >
                    <div>
                      <span className="tm-h4 qcont-font-16">
                        {card2Info.score}
                      </span>
                      <span className="tm-para3 qcont-font-10">
                        /{paperMarks}
                      </span>
                    </div>
                    <div className="tm-para3 text-center qcont-font-14 ">
                      {t('marks')}
                    </div>
                  </div>
                }
                isTeacher={isTeacher}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
