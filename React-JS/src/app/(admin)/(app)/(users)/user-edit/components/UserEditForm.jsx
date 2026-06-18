import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserEditForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Membre',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Nom complet</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div>
        <label className="form-label">Rôle</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-input"
          disabled // Keep role disabled for now as it's not in the update logic yet
        >
          <option value="Membre">Membre</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end mt-6">
        <Link to="/users-list" className="btn border border-default-200 hover:bg-default-100">
          Annuler
        </Link>
        <button type="submit" className="btn bg-primary text-white hover:bg-primary-600">
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
