import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Buscar productos..."
          className="search-input"
          aria-label="Buscar productos"
        />
      </div>
      <button 
        type="submit" 
        className="search-button"
        aria-label="Buscar"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar; 