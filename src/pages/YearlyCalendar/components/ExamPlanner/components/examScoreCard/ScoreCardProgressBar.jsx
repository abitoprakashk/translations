import React from 'react'
// import styles from './ScoreCardProgressBar.module.css'
import './index.css'
import SemiCircleProgressBar from '../semiCircularProgressBar/index'
import {t} from 'i18next'

export default function ScoreCardProgressBar({
  isTeacher = true,
  paperMarks = 100,
  totalMarks = 0,
  avgScore = 0,
  top10AvgScore = 0,
}) {
  const toFixedIfNecessary = (value, dp) => +parseFloat(value).toFixed(dp)

  const card1Info = {
    title: t('classAverage'),
    score: avgScore,
    tMark: totalMarks,
    avScore: avgScore,
  }
  const card2Info = {
    title: t('classTop10'),
    score: top10AvgScore,
    tMark: totalMarks,
    t10avgScore: top10AvgScore,
  }
  const percentage1 = (card1Info.score / paperMarks) * 100
  const percentage2 = (card2Info.score / paperMarks) * 100

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
                      <span className="qcont-font-16">
                        {toFixedIfNecessary(card1Info.score, 2)}
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
                        {toFixedIfNecessary(card2Info.score, 2)}
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
