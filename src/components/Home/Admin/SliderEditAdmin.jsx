import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import React, {useState} from 'react'
import Documents from '../../../pages/DocumentUpload/Documents'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
// import {ROLE_ID} from '../../../constants/permission.constants'
// import {events} from '../../../utils/EventsConstants'
import Admin from '../../../pages/user-profile/components/Admin/Admin'
import {t} from 'i18next'

const SLIDER_TAB_IDS = {
  BASIC_INFO: 'BASIC_INFO',
  DOCUMENTS: 'DOCUMENTS',
}

const SLIDER_TABS = [
  {
    id: SLIDER_TAB_IDS.BASIC_INFO,
    label: t('profileTab'),
  },
  {
    id: SLIDER_TAB_IDS.DOCUMENTS,
    label: 'Documents',
  },
]

export default function SliderEditAdmin({
  setShowEditSlider,
  selectedAdminCard,
  isSameUser,
}) {
  const [selectedTab, setSelectedTab] = useState(SLIDER_TAB_IDS.BASIC_INFO)

  return (
    <div>
      <SliderScreen setOpen={() => setShowEditSlider(null)} width="900">
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
            title="Admin Details"
            options={SLIDER_TABS}
            optionsSelected={selectedTab}
            handleChange={setSelectedTab}
          />
          {selectedTab === SLIDER_TAB_IDS.BASIC_INFO && (
            <Admin
              iMemberId={selectedAdminCard._id}
              closeSlider={() => setShowEditSlider(false)}
              isSameUser={isSameUser}
              isSuperAdmin={
                selectedAdminCard?.roles?.includes('owner') ||
                selectedAdminCard?.roles_to_assign?.includes('owner')
              }
            />
          )}
          {selectedTab === SLIDER_TAB_IDS.DOCUMENTS && (
            <div className="h-full">
              <Documents memberId={selectedAdminCard._id} persona="STAFF" />
            </div>
          )}
        </>
      </SliderScreen>
    </div>
  )
}
