import ExamTemplateEditor from '../ExamTemplateEditor/ExamTemplateEditor'
import {useTranslation} from 'react-i18next'
import {Button} from '@teachmint/common'
import AdditionalExams from '../AdditionalExams/AdditionalExams'
const ClassExamPattern = () => {
  const t = useTranslation()
  return (
    <div>
      <div>
        <div>
          <div>{t('')}</div>
          <div>{t('examPatternDesc')}</div>
        </div>
        <div>
          <Button size="big" type="border">
            {t('preview')}
          </Button>
        </div>
      </div>

      <ExamTemplateEditor />
      <div>
        <AdditionalExams />
      </div>
    </div>
  )
}

export default ClassExamPattern
