import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Find countries <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const CountryDetails = ({ countries, showCountryDetails}) => {
  if(!countries ) {
    return null
  }
  if (countries.length > 10) {
    return <p>Too many matches, please make your query more specific.</p>;
  }
  if (countries.length === 1) {
    const [detail, setDetail] = useState(null);
    useEffect(() => {
      const countryName = countries[0].name.common.toLowerCase()
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        .then(response => {
          setDetail(response.data);
        })
        .catch(error => {
          console.error('Error fetching country details:', error);
        });
    }, [countries]);

    if (!detail) {
      return null
    }

    return (
      <div>
        <h1>{detail.name.common}</h1>
        
        <p>capital {detail.capital}</p>
        <p>area {detail.area}</p>
        <h3>Languages:</h3>
        <ul>
          {Object.entries(detail.languages).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
        </ul>
        <img src={detail.flags.svg} alt={detail.flags.alt} width='150' />
      </div>
    );
  } 
  else{
  return (
    <div>
        {countries.map(country => (
        <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button onClick={() => showCountryDetails(country)}>show </button>
        </div>
        ))}
    </div>
  )}
}

const App = () => {
  const [countries, setCountries] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(true)
  useEffect(() => {
    if (searchTerm) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const Countries = response.data;
          setCountries(Countries);
        })
        .catch(error => {
          console.error('Error fetching country details:', error);
        });
    }
  }, [searchTerm])
  
  const filteredNames = countries
  ? countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : []
  const namesToShow = showAll ? countries : filteredNames

  const onSearch = (event) => {
    event.preventDefault();
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setShowAll(event.target.value.length === 0)
  }

  const showCountryDetails = selectedCountry => {
    setCountries([selectedCountry])
    setShowAll(false)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
        <CountryDetails countries={namesToShow} showCountryDetails={showCountryDetails} />
      </form>
    </div>
  )
}

export default App
