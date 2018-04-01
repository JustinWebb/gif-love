import React from 'react';
import './search-form.css';

export default class SearchForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit');
  }

  render() {
    return (
      <form className="search-form" onSubmit={this.handleSubmit}>
        <input
          name="search"
          type="text"
          placeholder="Search for GIFs"
        />
        <button name="submit-query" type="submit" />
      </form>
    );
  }
}