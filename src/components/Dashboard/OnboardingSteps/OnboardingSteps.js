import React from 'react'
import step1Img from '../../../assets/images/dashboard/onboarding-steps/step1.svg'
import step2Img from '../../../assets/images/dashboard/onboarding-steps/step2.svg'
import step3Img from '../../../assets/images/dashboard/onboarding-steps/step3.svg'
import step4Img from '../../../assets/images/dashboard/onboarding-steps/step4.svg'

export default function OnboardingSteps({instituteId}) {
  const steps = [
    {
      index: 1,
      desc: `Share Institute ID ${instituteId} with your teachers`,
      imgSrc: step1Img,
      backgroundColor: 'tm-bg-light-orange',
    },
    {
      index: 2,
      desc: 'Ask teacher to download Teachmint App',
      imgSrc: step2Img,
      backgroundColor: 'tm-bg-light-purple',
    },
    {
      index: 3,
      desc: "Teacher's can now create classrooms and add them using Institute ID",
      imgSrc: step3Img,
      backgroundColor: 'tm-bg-medium-blue',
    },
    {
      index: 4,
      desc: 'Approve their requests and you are done!',
      imgSrc: step4Img,
      backgroundColor: 'tm-bg-light-green',
    },
  ]

  return (
    <div className="w-full px-4 py-5 lg:px-0">
      <div className="tm-h5">How does it work?</div>
      <div className="w-full flex flex-row flex-wrap mt-3 lg:justify-between">
        <div className="tm-video-iframe-con w-full lg:w-2/5 tm-box-shadow1">
          <iframe
            src="https://www.youtube.com/embed/87bXfy6sXQU"
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            className="tm-border-radius1"
          ></iframe>
        </div>

        <div className="tm-dashboard-onboarding-con tm-horizontal-con mt-3 tm-remove-horizontal-con lg:flex-wrap lg:justify-between lg:w-3/5 lg:mt-0">
          {steps.map((item) => (
            <div
              key={item.index}
              className={`tm-dashboard-onboarding-card tm-border-radius1 flex-wrap flex-col items-center mr-4 ${item.backgroundColor} lg:flex-row lg:m-0 lg:flex-nowrap lg:items-start tm-box-shadow1`}
            >
              <img
                className="w-20 lg:mt-1.5 lg:ml-1.5"
                src={item.imgSrc}
                alt="StepsIcon"
              />
              <div className="p-1.5 text-center lg:text-left lg:p-3">
                <div className="tm-h6">Step&nbsp;{item.index}</div>
                <div className="tm-para3 mt-1.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
