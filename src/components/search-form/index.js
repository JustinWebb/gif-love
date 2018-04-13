import React from 'react';
import './search-form.css';

export default class SearchForm extends React.Component {

  state = {
    fields: {
      query: ''
    },
    fieldErrors: {}
  }

  onInputChange = (e) => {
    this.setState({ fields: { query: e.target.value } });
    console.log('onInputChange', this.state.fields.query);
  }

  validate = () => {
    const errors = {};
    const query = this.state.fields.query;

    if (query === '') errors.query = 'Cannot be blank';

    return errors;
  }

  handleSubmit = (e) => {
    const fieldErrors = this.validate();
    this.setState({ fieldErrors });
    e.preventDefault();

    if (Object.keys(fieldErrors).length) return;

    console.log('handleSubmit');
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.fields);
    }
  }

  handleClick = (e) => {
    if (this.state.fields.query) this.setState((prevState) => {
      return { fields: { query: '' }, fieldErrors: {} };
    });
  }

  render() {
    const klasses = ['search-form'];

    if (this.state.fieldErrors.length) klasses.push('form-error');

    return (
      <form className={klasses.join(' ')} onSubmit={this.handleSubmit}>
        <div className="composite-input">
          <input
            name="search"
            type="text"
            placeholder="Search for GIFs"
            value={this.state.fields.query}
            onChange={this.onInputChange}
          />
          <button name="clear" type="text" onClick={this.handleClick} />
          <button name="submit" type="submit" />
        </div>
        <span className="field-errors">{this.state.fieldErrors.query}</span>
      </form>
    );
  }
}