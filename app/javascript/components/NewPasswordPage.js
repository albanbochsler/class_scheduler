import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import FormData from './utils/FormData';
import Header from './reusable/Header';
import SnackBarComponent from './reusable/SnackBarComponent';
import { postData } from './utils/sendData';
import Footer from './reusable/Footer';
import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';

const schema = {
  email: Joi.string().email().required().options({
    language: {
      any: {
        required: 'Please enter a valid email.'
      },
      string: {
        email: 'Please enter a valid email.'
      }
    }
  }),
};

class NewPasswordPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleForgotClick = this.handleForgotClick.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);

    this.state = {
      showSnackBar: false,
      message: ''
    };
  }
  render() {
    const { errors, changeHandler, validateHandler, currentUser: { email, locale } } = this.props;

    return (
      <div>
        <Header  />
        <PageHeader
          title={
            <FormattedMessage
              id='NewPasswordPage.header'
              defaultMessage='New Password'
            />
          }
        />
        <form className="signInContainer">
          <TextField
            name='email'
            value={ email }
            className='signUpEmailInputField'
            hintText=''
            floatingLabelText={ <FormattedMessage id='NewPasswordPage.enterEmail' defaultMessage='Please enter your email to recover your password' /> }
            floatingLabelFixed
            errorText={ errors.email }
            onChange={ changeHandler('email') }
            onBlur={ validateHandler('email') }
            fullWidth
          />

          { this.renderSubmitButton() }

          <div className='signInLinkSecondaryContainer'>
            <a href={ formatLink('/sign_up/client', locale) } className='signInLinkSecondary'>
              <FlatButton primary label={ <FormattedMessage id='signUpClient' /> } />
            </a>

            <a href={ formatLink('/sign_up/volunteer', locale) } className='signInLinkSecondary'>
              <FlatButton primary label={ <FormattedMessage id='signUpVolunteer' /> } />
            </a>
          </div>

          { this.renderSnackBar() }
        </form>
        <Footer />
      </div>
    );
  }

  renderSubmitButton() {
    return (
      <RaisedButton
        primary
        label={
          <FormattedMessage
            id='resetPassword'
          />
        }
        onClick={ this.handleForgotClick }
        className='signInLink'
      />
    );
  }


  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleForgotClick() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {

      const { currentUser: { email } } = this.props;
      const attributes = FormData.from({ email });

      const requestParams = {
        url: '/password',
        attributes,
        method: 'POST',
        successCallBack: () => {
          this.setState({
            showSnackBar: true,
            message: <FormattedMessage
              id='NewPasswordPage.success'
              defaultMessage='A message has been sent to your email address.'
            />
          });

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        },
        errorCallBack: (message) => {
          this.setState({
            showSnackBar: true,
            message
          });

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        }
      };
      return postData(requestParams);
    }
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }
}

NewPasswordPage.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }),
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

NewPasswordPage.defaultProps = {
  errors: {},
  currentUser: {
    email: '',
  },
};

NewPasswordPage.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'currentUser'
};

export default validate(NewPasswordPage, validationOptions);
