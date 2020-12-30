import React from "react";
import dayjs from "dayjs";

const Header = ({ activeYear, activeMonth }) => {
  let title = "";
  if (activeYear === 0) {
    title = "All";
  } else if (activeMonth === 0) {
    title = `${activeYear}`;
  } else {
    const monthName = dayjs()
      .month(activeMonth - 1)
      .format("MMMM");
    title = `${monthName} ${activeYear}`;
  }
  return (
    <div className="stats-header">
      <h3>{title}</h3>
    </div>
  );
};

export default Header;
