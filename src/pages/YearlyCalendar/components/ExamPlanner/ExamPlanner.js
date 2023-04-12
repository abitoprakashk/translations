import {ErrorBoundary} from '@teachmint/common'
import React from 'react'
import ExamPlannerPage from './components/ExamPlannerPage'

export default function ExamPlanner() {
  return (
    <div className="px-4 pt-3 lg:px-6 lg:pb-6 lg:pt-3">
      <ErrorBoundary>
        <ExamPlannerPage />
      </ErrorBoundary>
    </div>
  )
}
