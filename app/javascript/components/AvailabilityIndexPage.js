import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import moment from 'moment';

import './AvailabilityIndexPage.css';

class AvailabilityIndexPage extends Component {

  render() {
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />

        <div className='availabilityIndexContainer'>
          I can teach:
          <ul className='availabilityIndexListContainer'>
            { _.map(this.props.courses, ({ name }) => <li key={name}>{ name }</li>) }
          </ul>

          <br/>
          On the following days:
          <ul className='availabilityIndexListContainer'>
            { this.renderAvailabilities() }
          </ul>
        </div>
      </div>
    );
  }

  renderAvailabilities() {
    const { availabilities } = this.props;

    return _.map(availabilities, ({ day , start_time, end_time, timezone }) => {
      return (
        <div key={ name+day+timezone } className='availabilityIndexItemContainer'>
          <li>
           <span>Day: </span>{ day }
          </li>

          <li>
            <span>From: </span>{ moment(start_time).format("HH:MM") }
          </li>
          <li>
            <span>To:</span>{ moment(end_time).format("HH:MM") }
          </li>

          <li>
            <span>Timezone: </span>{ timezone }
          </li>
        </div>
      );
    })
  }
}

AvailabilityIndexPage.propTypes = {
  courses: PropTypes.array,
  days: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
  })
};

AvailabilityIndexPage.defaultProps = {
  days: [],
  courses: [],
  currentUser: {
    first_name: '',
    email: '',
  }
};

export default AvailabilityIndexPage;
