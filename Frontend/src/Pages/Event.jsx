import React from "react";
import WelcomeEvents from "../Components/event/WelcomeEventSection";
import UpcomingEvents from "../Components/event/UpcomingEventsSection";
import JoinCommunity from "../Components/event/JoinCommunity";

const Event = () => {
  return (
    <>
      <WelcomeEvents />
      <UpcomingEvents />
      <JoinCommunity />
    </>
  );
};

export default Event;
