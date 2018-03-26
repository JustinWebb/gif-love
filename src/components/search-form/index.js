import React from 'react';
import './search-form.css';

const SearchForm = () => (
  <form className="search-form">
    <input
      name="search"
      type="text"

      placeholder="Search for GIFs"
    />
    <button name="submit-query" type="submit" />
  </form>
);

export default SearchForm;
