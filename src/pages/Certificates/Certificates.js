import React, {useState} from 'react'
import NewCertificate from './components/NewCertificate/NewCertificate'
import CertificateList from './components/CertificatesList/CertificateList'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getCertificateData} from './redux/actions/certificateActions'
import {TAB_OPTIONS, ALL} from './Certificates.constants'
import Loader from '../../components/Common/Loader/Loader'

const Certificates = () => {
  const [activeTab, setActiveTab] = useState(ALL)
  const dispatch = useDispatch()

  const {
    certificate: {
      tabInfo: {allTabData, tabInfo, loading},
    },
    eventManager,
  } = useSelector((state) => state)

  const changeTab = (item) => {
    setActiveTab(item)
    eventManager.send_event(TAB_OPTIONS[item].eventName, {
      screen: 'certificate',
    })
    handleTabChange(item)
  }

  useEffect(() => {
    handleTabChange()
  }, [])
  const handleTabChange = (type) => {
    if (type) dispatch(getCertificateData(TAB_OPTIONS[type].type))
    else dispatch(getCertificateData())
  }
  // if certificate data is not there redirect to new route
  if (allTabData)
    return (
      <>
        <Loader show={loading} />
        <CertificateList
          key={activeTab}
          handleTabChange={changeTab}
          data={tabInfo}
          activeTab={activeTab}
        />
      </>
    )
  else if (!loading) return <NewCertificate />
  else return ''
}

export default Certificates
