// ContactList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    mobileNumber: '',
    email: '',
  });

  useEffect(() => {
    // Fetch contacts from the backend API
    fetchContacts();
  }, [currentPage, contactsPerPage, filters]);

  const fetchContacts = () => {
    axios.get(`http://localhost:8800/api/contacts?page=${currentPage}&limit=${contactsPerPage}`, {
      params: { ...filters },
    })
      .then(response => setContacts(response.data))
      .catch(error => console.error(error));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
  };

  const handleFilterApply = () => {
    setCurrentPage(1); 
  };

  return (
    <div>
      <div>
        <label>Name:</label>
        <input type="text" value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} />

        <label>Mobile Number:</label>
        <input type="text" value={filters.mobileNumber} onChange={(e) => handleFilterChange('mobileNumber', e.target.value)} />

        <label>Email:</label>
        <input type="text" value={filters.email} onChange={(e) => handleFilterChange('email', e.target.value)} />

        <button onClick={handleFilterApply}>Apply Filters</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.phoneNumber}</td>
              <td>{contact.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactList;
