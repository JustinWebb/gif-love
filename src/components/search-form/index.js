import React from 'react';

const SearchForm = () => (
  <form className="search-form">
    <input
      name="search"
      type="text"
      value=""
      placeholder="Search for GIFs"
    />
    <button name="submit-query" type="submit" />
  </form>
);

export default SearchForm;
