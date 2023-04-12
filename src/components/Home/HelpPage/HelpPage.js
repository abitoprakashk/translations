import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {events} from '../../../utils/EventsConstants'
import {PRICING} from '../../../utils/SidebarItems'
// import SearchBox from "../../Common/SearchBox/SearchBox";
// import downArrowIcon from "../../../assets/images/icons/down-arrow-gray.svg";

export default function HelpPage() {
  const [filteredFaqs, setFilteredFaqs] = useState([])
  const [selectedFaq, setSelectedFaq] = useState(null)
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()

  const faqs = [
    {
      num: 1,
      question: t('faqsQuestion1'),
      answer: <>{t('faqsQuestionAnswer1')}</>,
      answerString: t('faqsQuestionAnswerString1'),
    },
    {
      num: 2,
      question: t('faqsQuestion2'),
      answer: (
        <>
          <Trans i18nKey="faqsQuestionAnswerStringData2">
            Step 1 : Sign-up on{' '}
            <a
              className="tm-color-blue"
              href="https://www.teachmint.com/login"
              target="_blank"
              rel="noreferrer"
            >
              www.teachmint.com/login
            </a>
            <br />
            Step 2 : Share the &apos;Institute ID&apos; with your Teachers{' '}
            <br />
            Step 3 : Your Teachers will then have to create their classrooms and
            link the classrooms with Institute using the &apos;Institute
            ID&apos; Institute Owners and/or Admin will then be able to manage
            teachers, classrooms and students of the Institute using the
            &apos;Teachmint for Institute&apos; operating system.
          </Trans>
        </>
      ),
      answerString: t('faqsQuestionAnswerString2'),
    },
    {
      num: 3,
      question: t('faqsQuestion3'),
      answer: (
        <>
          <Trans i18nKey="faqsQuestionAnswer3">
            Plans and features of &apos;Teachmint for Institute&apos; are listed
            on the{' '}
            <Link
              to={PRICING}
              className="tm-color-blue"
              onClick={() => {
                eventManager.send_event(events.VIEW_YOUR_PLANS_CLICKED_TFI, {
                  screen_name: 'HELP_PAGE',
                })
              }}
            >
              &apos;View our Plans&apos;
            </Link>{' '}
            page.
          </Trans>
        </>
      ),
      answerString: t('faqsQuestionAnswerString3'),
    },
  ]

  useEffect(() => {
    setFilteredFaqs(faqs)
  }, [])

  return (
    <div className="px-4 pt-3 lg:px-6 lg:pb-6 lg:pt-3">
      <div>
        {filteredFaqs &&
          filteredFaqs.map(({num, question, answer}) => (
            <div
              key={num}
              className="bg-white my-3 px-3 py-3 tm-border-radius1 tm-box-shadow1 lg:my-4 cursor-pointer"
            >
              <div
                className="flex justify-between"
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedFaq(
                    selectedFaq === null || selectedFaq !== num ? num : null
                  )
                }}
              >
                <div className="tm-h5 w-11/12">{question}</div>
              </div>
              <div className="tm-para2 mt-3">{answer}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
