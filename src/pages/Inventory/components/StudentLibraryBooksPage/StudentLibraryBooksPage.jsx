import {
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import Permission from '../../../../components/Common/Permission/Permission'
import {
  showLoadingAction,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {utilsAssignBook} from '../../../../routes/dashboard'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {studentWiseBooksList} from '../../pages/Overview/apiServices'
import {STUDENT_LIBRARY_BOOKS_TABLE_HEADERS} from '../../utils/Inventory.constants'
import styles from './StudentLibraryBooksPage.module.css'

export default function StudentLibraryBooksPage({currentStudent}) {
  const [libraryBooksData, setLibraryBooksData] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentStudent?._id) getLibraryBooksData(currentStudent._id)
  }, [currentStudent])

  const getLibraryBooksData = (studentId) => {
    dispatch(showLoadingAction(true))
    studentWiseBooksList({iid: studentId})
      .then(({obj}) => setLibraryBooksData(obj))
      .catch(() => {})
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleReturn = (bookId) => {
    dispatch(showLoadingAction(true))
    utilsAssignBook(bookId, currentStudent?._id, false)
      .then(() => {
        dispatch(showSuccessToast(t('bookReturnToastMsg')))
        getLibraryBooksData(currentStudent?._id)
      })
      .catch(() => {})
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getTableRows = () => {
    const rows = []
    if (libraryBooksData?.list?.length > 0) {
      libraryBooksData.list.forEach(({_id, name, author, c}) => {
        rows.push({
          bookDetail: (
            <div>
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                className={styles.bookName}
              >
                {name}
              </Para>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{author}</Para>
            </div>
          ),
          assignedOn: (
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {DateTime.fromSeconds(c).toFormat('dd/MM/yyyy')}
            </Para>
          ),
          return: (
            <div className={styles.returnButtonWrapper}>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.bookController_associate_update
                }
              >
                <Button
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                  onClick={() => handleReturn(_id)}
                >
                  {t('return')}
                </Button>
              </Permission>
            </div>
          ),
        })
      })
    }
    return rows
  }

  return (
    <div>
      {libraryBooksData?.list?.length > 0 ? (
        <div className={styles.tableWrapper}>
          <Table
            rows={getTableRows()}
            cols={STUDENT_LIBRARY_BOOKS_TABLE_HEADERS}
            classes={{table: styles.table}}
            virtualized
            autoSize
          />
        </div>
      ) : (
        <div className={styles.emptyStateWrapperOuter}>
          <EmptyState
            iconName="viewQuilt"
            content={t('emptyLibraryBooksDescription')}
            button={null}
          />
        </div>
      )}
    </div>
  )
}
