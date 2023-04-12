import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import StudentsListStyles from '../../StudentsList.module.css'
import {
  Input,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import SubjectTooltipOptions from '../../../../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {events} from '../../../../../../../../../utils/EventsConstants'
import {
  DELETE_PREVIOUS_SESSION_DUE,
  HEADER_OPTIONS,
} from '../../../../PreviousSessionDues.constants.js'
import DeleteAllConfirmationPopup from '../DeleteConfirmationPopup/DeleteAllConfirmationPopup'

export default function HeaderSection({
  search,
  setSearch,
  setIsImportModalCSVOpen,
  setCSVModalType,
  handleDeletePreviousSessionDues,
}) {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false)

  return (
    <div className={StudentsListStyles.tableHeader}>
      {isDeleteAllModalOpen && (
        <DeleteAllConfirmationPopup
          onClose={setIsDeleteAllModalOpen}
          onDelete={handleDeletePreviousSessionDues}
        />
      )}
      <Input
        fieldName="search"
        placeholder={t('seachByName')}
        type="text"
        value={search || ''}
        classes={{wrapper: StudentsListStyles.inputWrapperClass}}
        onChange={(e) => setSearch(e.value)}
        suffix={
          search ? (
            <Icon
              name="close"
              onClick={() => setSearch('')}
              className={StudentsListStyles.closeIcon}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
            />
          ) : (
            ''
          )
        }
      />
      <div className={StudentsListStyles.rightButtons}>
        <Button
          size={BUTTON_CONSTANTS.SIZE.LARGE}
          onClick={() => {
            eventManager.send_event(
              events.FEE_PREVIOUS_SESSION_DUES_CSV_UPDATE_CLICKED_TFI
            )
            setIsImportModalCSVOpen(true)
            setCSVModalType('update')
          }}
          type={BUTTON_CONSTANTS.TYPE.OUTLINE}
        >
          {t('updateDuesCSV')}
        </Button>
        <SubjectTooltipOptions
          subjectItem={{}}
          options={HEADER_OPTIONS.map((item) => {
            return {
              ...item,
              labelStyle: StudentsListStyles[item?.labelStyle] || '',
              label: t(item.label),
            }
          })}
          trigger={
            <span
              data-size="m"
              data-qa="icon-moreVertical"
              className="icon-moreVertical_outlined krayon__Icon-module__h4WMz krayon__Icon-module__szG-X StudentsList_moreVerticalClass__2Bwq1"
              data-type="basic"
              aria-describedby="popup-2"
            ></span>
          }
          handleChange={(action) => {
            if (action == DELETE_PREVIOUS_SESSION_DUE) {
              setIsDeleteAllModalOpen(true)
            }
          }}
        />
      </div>
    </div>
  )
}
