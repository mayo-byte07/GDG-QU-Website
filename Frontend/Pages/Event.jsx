import React from 'react'
import WelcomeEvents from '../Components/WelcomeEventSection'
import UpcomingEvents from '../Components/UpcomingEventsSection'
import PastEvents from '../Components/PastEventsSection'

const Event = () => {
  return (
    <>
    <WelcomeEvents/>
    <UpcomingEvents/>
    <PastEvents/>
    </>
  )
}

export default Event