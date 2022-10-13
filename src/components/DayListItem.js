import React from "react";
import classNames from "classnames";
import "./DayListItem.scss";
import axios from "axios";

const DayListItem = ({ selected, name, spots, setDay }) => {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0,
  });

  return (
    <li className={dayClass} onClick={() => setDay(name)} data-testid="day">
      <h2 className="text--regular">{name}</h2>

      {spots === 0 && <h3 className="text--light">no spots remaining</h3>}
      {spots === 1 && <h3 className="text--light">1 spot remaining</h3>}
      {spots > 1 && <h3 className="text--light">{spots} spots remaining</h3>}
    </li>
  );
};

export default DayListItem;
