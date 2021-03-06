import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { AVAILABLE_STATS } from "../queries";

const DateSelection = ({
  activeMonth,
  activeYear,
  setActiveMonth,
  setActiveYear,
}) => {
  const { data } = useQuery(AVAILABLE_STATS);

  useEffect(() => {
    if (data && data.availableStats) {
      const recentYear = Object.keys(data.availableStats).reduce((a, c) => {
        return a > c ? a : c;
      }, 0);
      const recentMonth =
        data.availableStats[recentYear][
          data.availableStats[recentYear].length - 1
        ];
      setActiveYear(Number(recentYear));
      setActiveMonth(Number(recentMonth));
    }
  }, [data]);

  const availableStats = data ? data.availableStats : {};

  function handleClick({ target }) {
    const { type } = target.dataset;
    const value = Number(target.dataset.value);
    if (value === 0 && type === "year") {
      setActiveMonth(0);
      setActiveYear(0);
    } else if (type === "year") {
      setActiveYear(value);
      setActiveMonth(0);
    } else {
      setActiveMonth(value);
    }
  }

  const months = Array(12)
    .fill(0)
    .map((_m, i) => {
      const month = dayjs().month(i).format("MMM");
      const available =
        availableStats[activeYear] &&
        availableStats[activeYear].includes(i + 1);
      return { name: month, value: i + 1, disabled: !available };
    });

  const minYear = Number(
    Object.keys(availableStats).reduce((a, c) => {
      return Number(a) < Number(c) ? a : c;
    }, dayjs().year())
  );

  const years = Array(1 + dayjs().year() - minYear)
    .fill(0)
    .map((_y, i) => {
      const year = Number(
        dayjs()
          .year(minYear + i)
          .format("YYYY")
      );
      const available = availableStats.hasOwnProperty(year);
      return { name: year, value: year, disabled: !available };
    });

  return (
    <div className="py-2 mt-2 mb-4 bg-white w-11/12 mx-auto rounded rounded-b-none shadow text-center">
      <Buttons
        buttons={years}
        activeButton={activeYear}
        setActiveButton={handleClick}
        type="year"
      />
      <Buttons
        buttons={months}
        activeButton={activeMonth}
        setActiveButton={handleClick}
        type="month"
      />
    </div>
  );

  function Buttons({ buttons, activeButton, setActiveButton, type }) {
    const defaultStyle =
      "px-2 py-1 m-2 rounded-lg font-bold focus:outline-none shadow ";
    const disabledStyle = "opacity-30";
    const activeStyle = "border-blue-500 border bg-blueGray-100 text-blue-500";
    const buttonElements = [
      { name: "All", value: 0, disabled: false },
      ...buttons,
    ].map(({ name, disabled, value }) => {
      let className = defaultStyle;
      if (disabled) {
        className += disabledStyle;
      } else if (value === activeButton) {
        className += activeStyle;
      } else {
        className +=
          "hover:border-blue-500 hover:bg-blueGray-100 hover:text-blue-500 border border-gray-300";
      }
      return (
        <button
          data-value={value}
          data-type={type}
          className={className}
          onClick={setActiveButton}
          key={name}
          disabled={disabled}
        >
          {name}
        </button>
      );
    });
    return <div>{buttonElements}</div>;
  }
};

export default DateSelection;
