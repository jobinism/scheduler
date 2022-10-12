import React from "react";
import DayListItem from "./DayListItem";

const DayList = ({ days, value, onChange }) => {
  const allDays = days.map(day => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === value}
        setDay={onChange}
      />
    );
  });

  return <ul>{allDays}</ul>;
};

export default DayList;
