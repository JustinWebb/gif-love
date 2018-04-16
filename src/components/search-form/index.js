import React from 'react';
import './search-form.css';

export default class SearchForm extends React.Component {

  state = {
    fields: {
      query: ''
    },
    fieldErrors: {},
    isQuerying: false
  }

  onInputChange = (e) => {
    const fields = { query: e.target.value };
    const fieldErrors = this.validate(fields.query);
    const isQuerying = (fields.query !== '');
    this.setState({ fields, fieldErrors, isQuerying });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = this.state.fieldErrors;
    const fields = this.state.fields;
    const errors = Object.assign({}, this.validate(), fieldErrors);
    // Prevent form submission and display errors if necessary
    if (Object.keys(errors).length) {
      this.setState({ fieldErrors: errors });
      return;
    }
    // Allow form submission via callback and reset form
    if (this.props.onSubmit) {
      this.props.onSubmit(fields);
    }
    this.setState({ fields: { query: '' }, fieldErrors, isQuerying: false });
  }

  onClick = (e) => {
    const fields = { query: '' };
    const fieldErrors = { query: 'Cannot be blank' }
    this.setState({ fields, fieldErrors, isQuerying: false });
  }

  validate = (queryVal) => {
    const errors = {};
    if (queryVal) {
      // test for 
      if (/^[@_A-z0-9\s]*$/g.test(queryVal) === false) errors.query = 'No special characters';
    } else {
      if (this.state.fields.query === '') errors.query = 'Cannot be blank';
    }
    return errors;
  }

  render() {
    const klasses = ['search-form'];
    const clearButton = (this.state.isQuerying)
      ? <button name="clear" type="text" onClick={this.onClick} tabIndex='-1' />
      : null;

    if (this.state.fieldErrors.length) klasses.push('form-error');

    return (
      <form className={klasses.join(' ')} onSubmit={this.onSubmit}>
        <div className="composite-input">
          <input
            name="search"
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.fields.query}
            onChange={this.onInputChange}
          />
          <button name="submit" type="submit" />
          {clearButton}
        </div>
        <span className="field-errors">{this.state.fieldErrors.query}</span>
      </form>
    );
  }
}