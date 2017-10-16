import _ from 'lodash';
import React, { Component } from 'react';
import Header from './Header';

import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import './SearchBar.css';

function restfulUrl({ day, course, start_time, end_time }) {
  const start = start_time? moment(start_time).format("HH:MM") : '';
  const end = end_time? moment(end_time).format("HH:MM"): '';

  return `/results?course=${course}&day=${day}&start_time=${start}&end_time=${end}`;
}

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: '',
      day: '',
      course: '',
      teachers: { },
      start_time: { },
      end_time: { }
    };
  }

  render() {
    return (
      <div className='searchBarContainer'>
        <Header currentUser={ this.props.currentUser }/>

        <div className='errorField'>
          { this.state.error }
        </div>
        <div className='searchBarOptionContainer'>
          <SelectField
            hintText='Select Class'
            value={ this.state.course }
            onChange={ this.handleClassChange }
            autoWidth
          >
            { this.renderClasses() }
          </SelectField>

          <SelectField
            hintText='Select Day (optional)'
            value={ this.state.day }
            onChange={ this.handleDayChange }
            autoWidth
            multiple
          >
            <MenuItem value='Monday' primaryText='Monday' />
            <MenuItem value='Tuesday' primaryText='Tuesday' />
            <MenuItem value='Wednesday' primaryText='Wednesday' />
            <MenuItem value='Thursday' primaryText='Thursday' />
            <MenuItem value='Friday' primaryText='Friday' />
            <MenuItem value='Saturday' primaryText='Saturday' />
            <MenuItem value='Sunday' primaryText='Sunday' />
          </SelectField>

          <TimePicker
            format="24hr"
            hintText="Start Time - 24Hr Format"
            value={ this.state.start_time }
            onChange={ this.handleChangeStartTime }
          />

          <TimePicker
            format="24hr"
            hintText="End Time - 24Hr Format"
            value={ this.state.end_time }
            onChange={ this.handleChangeEndTime }
          />
        </div>

        <RaisedButton onClick={ this.handleSubmit } label='Search' primary />

        <div className='teacherContainer'>
          { this.renderTeachers() }
        </div>
      </div>
    );
  }

  renderTeachers() {
    const { teachers } = this.state;
    if (_.size(teachers) > 0) {
      return _.map(teachers, (teacher, index) => <div className='teacher' key={ index }>{ teacher.display_name }</div>);
    } else {
      return (
        <div className='searchError' >
          Oops. It seems like no teacher is available. Why not try a different search?
        </div>
      )
    }
  }

  handleSubmit() {
    if (this.state.course) {
      this.postSearch();
    } else {
      this.setState({
        error: 'Please select a class'
      });
    }
  }

  postSearch() {
    return fetch(restfulUrl(this.state), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include'
      }
    }).then(response => {
      if (response.status < 400) {

        return response.json().then(({ teachers })=> {
          return this.setState({
            teachers
          });
        });
      }
    })
  }

  renderTimes() {
    //TODO render start and end time input fields
    //Add morning/afternoon options
    return null;
  }

  renderClasses() {
    const { courses } = this.props;

    if (_.size(courses)) {
      return courses.map((item) => {
        return (
          <MenuItem key={ item.id } value={ item.id } primaryText={ item.name } />
        );
      })
    }
  }

  handleChangeStartTime(event, date) {
    this.setState({
      start_time: date
    });
  }

  handleChangeEndTime(event, date) {
    this.setState({
      end_time: date
    });
  }

  handleClassChange(event, index, value) {
    this.setState({
      course: value
    });
  }

  handleDayChange(event, index, value) {
    this.setState({
      day: value
    });
  }
}

SearchBar.propTypes = {
  courses: PropTypes.array,
  days: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
  })
};

SearchBar.defaultProps = {
  days: [],
  courses: [],
  currentUser: {
    first_name: '',
    email: '',
  }
};

export default SearchBar;
