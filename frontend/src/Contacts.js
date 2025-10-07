import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Sécuriser l'accès à la page contacts
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Récupérer la liste des contacts
  useEffect(() => {
    fetch(`${API_BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(() => setError('Erreur de chargement'));
  }, [token]);

  // Ajouter un contact
  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName, phone })
      });
      if (res.ok) {
        const newContact = await res.json();
        setContacts([...contacts, newContact]);
        setFirstName(''); setLastName(''); setPhone('');
        setSuccess('Contact ajouté !');
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de l\'ajout');
      }
    } catch {
      setError('Erreur serveur');
    }
  };

  // Supprimer un contact
  const handleDelete = async (id) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setContacts(contacts.filter(c => c._id !== id));
        setSuccess('Contact supprimé !');
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch {
      setError('Erreur serveur');
    }
  };

  // Préparer l'édition
  const startEdit = (contact) => {
    setEditId(contact._id);
    setEditFirstName(contact.firstName);
    setEditLastName(contact.lastName);
    setEditPhone(contact.phone);
  };

  // Valider l'édition
  const handleEdit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/contacts/${editId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstName: editFirstName, lastName: editLastName, phone: editPhone })
      });
      if (res.ok) {
        const updated = await res.json();
        setContacts(contacts.map(c => c._id === editId ? updated : c));
        setEditId(null); setEditFirstName(''); setEditLastName(''); setEditPhone('');
        setSuccess('Contact modifié !');
      } else {
        setError('Erreur lors de la modification');
      }
    } catch {
      setError('Erreur serveur');
    }
  };

  return (
    <div>
      <h2>Contacts</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Téléphone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {contacts.map(contact => (
          <li key={contact._id}>
            {editId === contact._id ? (
              <form onSubmit={handleEdit}>
                <input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} required />
                <input value={editLastName} onChange={e => setEditLastName(e.target.value)} required />
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)} required />
                <button type="submit">Valider</button>
                <button type="button" onClick={() => setEditId(null)}>Annuler</button>
              </form>
            ) : (
              <>
                <span>{contact.firstName} {contact.lastName} - {contact.phone}</span>
                <button onClick={() => startEdit(contact)}>Éditer</button>
                <button onClick={() => handleDelete(contact._id)}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
