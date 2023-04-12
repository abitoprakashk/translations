import React, {useState} from 'react'
import {CERTIFICATE_LABELS} from '../../Certificates.constants'
import cx from 'classnames'
import s from '../../Certificates.module.css'
import style from './CertificateList.module.css'
import {
  TAB_OPTIONS,
  ALL,
  certificateTypeMap,
  GENERATED_CERTIFICATE_COL,
  CERTIFICATE_STATUS_TYPES,
  GENERATED_CERTIFICATE_COL_ALL,
} from '../../Certificates.constants'
import LinearTabOptions from '../../../../components/Common/LinearTabOptions/LinearTabOptions'
import CertificateRequestTable from '../CertificateRequestTable/CertificateRequestTable'
import SearchBox from '../../../../components/Common/SearchBox/SearchBox'
import userDefaultImg from '../../../../assets/images/icons/user-profile.svg'
import {useEffect} from 'react'
import {Icon} from '@teachmint/common'
import {saveAs} from 'file-saver'
import {useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'

const CertificateList = ({data, activeTab, handleTabChange}) => {
  const [filterString, setFilterString] = useState('')
  const [tableData, setTableData] = useState([])
  useEffect(() => {
    setTableData(formatRowData(data))
  }, [data, filterString])

  const {eventManager} = useSelector((store) => store)

  const NotifyOrDownload = (link, profile, type) => {
    link = `${link}?timestamp=${+new Date()}`
    const {name, middle_name, last_name} = profile
    const fullname = `${name} ${middle_name ? middle_name : ''} ${
      last_name ? last_name : ''
    }`
    return (
      <div>
        <span></span>
        <a
          style={{cursor: 'pointer'}}
          onClick={() => handleDownload(link, fullname, type)}
        >
          <Icon color="primary" name="download" />
        </a>
      </div>
    )
  }
  const handleDownload = async (link, name, type) => {
    eventManager.send_event(events.DOWNLOAD_CERTIFICATE_CLICKED_TFI, {
      screen_name: 'Generated Certificates List Page',
    })
    let blob = await fetch(link).then((r) => r.blob())
    const filename = `${name}-${certificateTypeMap[type]}.pdf`
    saveAs(blob, filename)
  }
  const getStudentInfo = (item) => {
    const {
      profile: {name, phone_number, last_name, middle_name},
    } = item
    const fullName = `${name}${middle_name ? ' ' + middle_name : ' '} ${
      last_name ? last_name : ''
    }`
    return (
      <div className="flex items-center">
        <img
          src={userDefaultImg}
          alt=""
          className="w-9 h-9 lg:w-11 lg:h-11 mr-2 cover rounded-full"
        ></img>
        <div className={`w-full py-4 pr-4 tm-color-blue`}>
          <p>
            {fullName.length > 50
              ? fullName.substring(0, 49) + '...'
              : fullName}
          </p>
          <p className="tm-para tm-para-14 mt-2">
            {phone_number ? phone_number?.split('-')[1] : '-'}
          </p>
        </div>
      </div>
    )
  }
  const formatRowData = (data) => {
    if (filterString) {
      const obj = {}
      const str = filterString.toLowerCase()
      data.forEach((item) => {
        const {profile, status, class_room, remarks} = item
        const {name, middle_name, last_name, phone_number} = profile
        if (
          name.toLowerCase().replace('  ', ' ').includes(str) ||
          middle_name?.toLowerCase().includes(str) ||
          last_name?.toLowerCase().includes(str) ||
          class_room?.toLowerCase().includes(str) ||
          phone_number?.toLowerCase().includes(str) ||
          certificateTypeMap[item.type]?.toLowerCase().includes(str)
        ) {
          if (!(CERTIFICATE_STATUS_TYPES[status]?.label in obj))
            obj[CERTIFICATE_STATUS_TYPES[status]?.label] = []
          obj[CERTIFICATE_STATUS_TYPES[status]?.label].push({
            name: getStudentInfo(item),
            class: class_room || 'NA',
            reason: remarks?.remark,
            action: NotifyOrDownload(item.certificate_link, profile, item.type),
            type: certificateTypeMap[item.type],
          })
        }
      })
      return obj
    } else {
      const obj = {}
      data.forEach((item) => {
        const {status, class_room, remarks} = item

        if (!(CERTIFICATE_STATUS_TYPES[status]?.label in obj))
          obj[CERTIFICATE_STATUS_TYPES[status]?.label] = []
        obj[CERTIFICATE_STATUS_TYPES[status]?.label].push({
          name: getStudentInfo(item),
          class: class_room || 'NA',
          reason: remarks?.remark,
          action: NotifyOrDownload(
            item.certificate_link,
            item?.profile,
            item.type
          ),
          type: certificateTypeMap[item.type],
        })
      })
      return obj
    }
  }

  return (
    <div className={s.wrapper}>
      <div className={cx(s.header, s.flex_space_between)}>
        <h1 className="tm-h1">{CERTIFICATE_LABELS.CERTIFICATES}</h1>
      </div>
      <div className={style.wrapper}>
        <SearchBox
          value={filterString}
          placeholder="Search by student name, class and certificate type..."
          handleSearchFilter={(s) => setFilterString(s)}
        />
        <LinearTabOptions
          options={Object.keys(TAB_OPTIONS).map((key) => {
            return TAB_OPTIONS[key]
          })}
          selected={activeTab}
          handleChange={handleTabChange}
        />
        {data.length > 0 ? (
          <CertificateRequestTable
            key={activeTab}
            rows={tableData}
            cols={
              activeTab == ALL
                ? GENERATED_CERTIFICATE_COL_ALL
                : GENERATED_CERTIFICATE_COL
            }
          />
        ) : (
          <>
            <div className={style.no_result}>
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/search-secondary.svg"
                alt=""
              />
              <p>There are no certificates available</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CertificateList
