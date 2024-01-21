import { useState, useEffect } from 'react'
import axios from 'axios'
import nameService from './services/names'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const Style = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style ={Style} className='added'>
      {message}
    </div>
  )
}

const PersonForm = ({addName, handleNameChange, handleNumberChange, newName, newNumber }) => {
  return (
    <form onSubmit={addName}>
      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number:<input value={newNumber} onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
const Filter = ({searchTerm, handleSearchChange}) => (
    <div>
    Filter shown with <input value={searchTerm} onChange={handleSearchChange} />
    </div>
)
const Persons = ({persons, handleDelete}) =>(
  <ul>
  {persons.map(person =>
    (<li key={person.name}>{person.name} {person.number}
    <button onClick={() => handleDelete(person.id)}>Delete</button>
    </li>)
  )}
  </ul>
)
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [addedMessage, setAddedMessage] = useState(null)
  useEffect(() => {
    nameService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      window.confirm(`${existingPerson.name} is already added to the phonebook, replace the old number with a new one ?`)
      const updatedPerson = { ...existingPerson, number: newNumber }
      nameService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id === existingPerson.id ? returnedPerson : person
            )
          );
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          console.error('Error updating contact:', error)
        })
    } else {
      const nameObject = {
      name: newName,
      id: `${persons.length + 1}`,
      number: newNumber
    }
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === nameObject.name) {
        alert(`${nameObject.name} is already added to the phonebook`)
        return 
      }
    }
    nameService
    .create(nameObject)
    .then(returnedName => {
      setPersons(persons.concat(returnedName))
      setAddedMessage(`Added ${returnedName.name}`)
      setTimeout(() => {
        setAddedMessage("")
      }, 3000)
      setNewName('')
      setNewNumber('')
    })
  }
  }
  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      nameService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error("Error deleting contact:", error);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value) 
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value) 
  }
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setShowAll(event.target.value.length === 0)
  }
  const filteredNames = persons.filter((person) =>
  person.name.toLowerCase().includes(searchTerm.toLowerCase())
)
  const namesToShow = showAll ? persons : filteredNames
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addedMessage} />
      <Filter
      searchTerm = {searchTerm}
      handleSearchChange = {handleSearchChange}/>
      <h3>Add a new</h3>
      <PersonForm 
      addName={addName}
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      newName={newName}
      newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons persons = {namesToShow} handleDelete={handleDelete} />
    </div>
  )
  
}

export default App