import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { range } from 'lodash';

import logger from '../../../logger';

import './DateSelector.css';

logger.configure({ active: true });

const years = range(1990, (new Date()).getFullYear() + 1, 1);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


const CalendarContainer = ({ className, children }) => (
  <div className={className} style={{ zIndex: 9999 }}>
    {children}
  </div>
);

class DateSelector extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange:PropTypes.func.isRequired,
    label: PropTypes.string,
  };

  render() {
    // Custom header adapted from https://github.com/Hacker0x01/react-datepicker/blob/master/docs-site/src/examples/render_custom_header.jsx
    const { value, onChange, label, ...restProps } = this.props;
    return (
      <React.Fragment>
        <ControlLabel>{label}{' '}</ControlLabel>
        <DatePicker
          selected={value}
          onChange={onChange}
          dateFormat={'yyyy-MM-dd'}
          isClearable
          changeYear={true}
          renderCustomHeader={({
                                 date,
                                 changeYear,
                                 changeMonth,
                                 decreaseMonth,
                                 increaseMonth,
                                 prevMonthButtonDisabled,
                                 nextMonthButtonDisabled
                               }) => (
            <div
              style={{
                margin: 10,
                display: "flex",
                justifyContent: "center"
              }}
            >
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                {"<"}
              </button>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                {years.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={date.getMonth()}
                onChange={({ target: { value } }) => changeMonth(value)}
              >
                {months.map((option, index) => (
                  <option key={option} value={index}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                {">"}
              </button>
            </div>
          )}
          calendarContainer={CalendarContainer}
          {...restProps}
        />
      </React.Fragment>
    );
  }
}

export default DateSelector;
