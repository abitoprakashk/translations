import React from 'react'
import {useSelector} from 'react-redux'
import * as SHC from '../../../utils/SchoolSetupConstants'
import Accordion from '../../Common/Accordion/Accordion'
import {events} from '../../../utils/EventsConstants'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
export default function HeirarchySidebar({hierarchy, handleActions}) {
  const {eventManager} = useSelector((state) => state)

  return (
    <div>
      {hierarchy && hierarchy.frontendOptions.isVisible && (
        <div className="w-full py-2">
          {hierarchy.type === SHC.NODE_ADD_SEC ? (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClass_addSection_create
              }
            >
              <div
                className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
                onClick={() => {
                  hierarchy.eventName &&
                    eventManager.send_event(
                      hierarchy.eventName,
                      ...(hierarchy.eventOptions
                        ? [hierarchy.eventOptions]
                        : [])
                    )
                  handleActions(hierarchy.id, hierarchy.type)
                }}
              >
                {hierarchy.name}
              </div>
            </Permission>
          ) : (
            <Accordion
              title={hierarchy.name}
              icon={hierarchy.icon}
              iconSelected={hierarchy.iconSelected}
              isOpen={hierarchy.frontendOptions.isOpen}
              isLeafNode={hierarchy.frontendOptions.isLeafNode}
              handleActions={() => {
                eventManager.send_event(events.NODE_CLICKED_TFI, {
                  type: hierarchy.type,
                  action: !hierarchy.frontendOptions.isOpen
                    ? 'opened'
                    : 'closed',
                })
                hierarchy.eventName &&
                  eventManager.send_event(
                    hierarchy.eventName,
                    ...(hierarchy.eventOptions ? [hierarchy.eventOptions] : [])
                  )
                handleActions(hierarchy.id, hierarchy.type)
              }}
            />
          )}
        </div>
      )}
      {!hierarchy.frontendOptions.isLeafNode && (
        <div className={`${hierarchy.frontendOptions.isVisible ? 'pl-4' : ''}`}>
          {hierarchy.frontendOptions.isOpen && hierarchy.children
            ? hierarchy.children
                // .filter(({status}) => status !== 2)   //show inactive classes to admin
                .map((item) => (
                  <HeirarchySidebar
                    key={item.id}
                    hierarchy={item}
                    handleActions={handleActions}
                  />
                ))
            : null}
        </div>
      )}
    </div>
  )
}
