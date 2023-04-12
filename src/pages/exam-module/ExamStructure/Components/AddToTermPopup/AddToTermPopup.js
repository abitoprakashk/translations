import {Button, Icon, Input, Modal, Tag} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
// import {useOutsideClickHandler} from '@teachmint/common'
import history from '../../../../../history'
// import {useRef} from 'react'
import {
  useAddToTermExam,
  useExamStructureForClass,
} from '../../Redux/ExamStructureSelectors'
import styles from './AddToTermPopup.module.css'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {postAddToTermExam} from '../../Redux/ExamStructureActions'
import useQuery from '../../../../../hooks/UseQuery'

const AddToTermPopup = () => {
  const [selectedTerm, setSelectedterm] = useState(null)
  const {t} = useTranslation()
  //   const wrapperRef = useRef(null)
  //   useOutsideClickHandler(wrapperRef, () => history.goBack())
  const dispatch = useDispatch()
  const addToTermExam = useAddToTermExam()
  const query = useQuery()

  const classId = query.get('classId')

  //   if (addToTermExam === null) history.goBack()

  let terms = []
  const termObjArray = useExamStructureForClass().examStructure?.children

  termObjArray?.map((item) => {
    const {_id: id, name} = item
    terms.push({value: id, label: name})
  })

  const colorCode = ['danger', 'success', 'info', 'warning']

  return (
    <Modal show={true} className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.outerCircle}>
          <div className={styles.icon}>
            <Icon type="outlined" size="xxl" color="inverted" name="add" />
          </div>
        </div>
        <div className={styles.subjectsContainer}>
          {addToTermExam?.subjects.map((item, index) => (
            <Tag key={index} content={item} accent={colorCode[index % 4]} />
          ))}
        </div>
        <div className={styles.title}>{`${t('selectTermFor')} ${
          addToTermExam?.name
        }`}</div>

        <div className={styles.warning}>{t('addToTermWarning')}</div>

        <Input
          className={styles.dropdown}
          fieldName="termName"
          type="select"
          value={selectedTerm}
          options={terms}
          onChange={({value}) => {
            setSelectedterm(value)
          }}
          classes={{title: 'tm-para'}}
        />
        <div className={styles.ctaContainer}>
          <Button
            size="big"
            type="border"
            className={styles.cancel}
            onClick={() => history.goBack()}
          >
            {t('cancel')}
          </Button>
          <Button
            size="big"
            type="fill"
            disabled={selectedTerm === null ? true : false}
            className={styles.addToTerm}
            onClick={() => {
              dispatch(
                postAddToTermExam({
                  examId: addToTermExam.id,
                  termId: selectedTerm,
                  classId,
                })
              )
              history.goBack()
            }}
          >
            {t('addToTerm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddToTermPopup
