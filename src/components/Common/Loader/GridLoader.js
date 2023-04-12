import React, {useEffect} from 'react'
import {useState} from 'react'
import {useSelector} from 'react-redux'
import Loader from './Loader'

export default function GridLoader() {
  const {loadingList} = useSelector((state) => state)
  const [showGridLoader, setShowGridLoader] = useState(false)

  const handleLoading = () => {
    const isLoading = Object.values(loadingList).some((item) => item === true)
    setShowGridLoader(isLoading)
  }
  useEffect(handleLoading, [loadingList])

  return <Loader show={showGridLoader} type="grid" />
}
