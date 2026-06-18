import React from 'react';

const UserDetails = ({ user }) => {
  if (!user) return null;

  return (
    <div className="lg:col-span-2">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Détails de l'utilisateur</h4>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-default-500 text-sm mb-1 block">Nom complet</label>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <label className="text-default-500 text-sm mb-1 block">Email</label>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <label className="text-default-500 text-sm mb-1 block">Rôle</label>
              <p className="font-semibold">{user.role}</p>
            </div>
            <div>
              <label className="text-default-500 text-sm mb-1 block">Emplacement</label>
              <p className="font-semibold">{user.location}</p>
            </div>
            <div>
              <label className="text-default-500 text-sm mb-1 block">Téléphone</label>
              <p className="font-semibold">{user.phone}</p>
            </div>
            <div>
              <label className="text-default-500 text-sm mb-1 block">Date d'adhésion</label>
              <p className="font-semibold">{user.joiningDate}</p>
            </div>
            <div>
              <label className="text-default-500 text-sm mb-1 block">Statut</label>
              <span className="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium bg-success/10 text-success rounded">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
