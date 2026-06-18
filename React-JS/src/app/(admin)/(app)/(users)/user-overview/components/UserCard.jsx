import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="col-span-1">
      <div className="card">
        <div className="card-body text-center">
          <div className="mx-auto size-24 mb-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="size-full rounded-full border-4 border-primary/10" />
            ) : (
              <div className="size-full flex items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <h4 className="text-xl font-bold mb-1">{user.name}</h4>
          <p className="text-default-500 mb-4">{user.role}</p>
          
          <div className="flex flex-col gap-2">
            <Link to="/users-list" className="btn border border-default-200 hover:bg-default-100">
              Retour à la liste
            </Link>
            <Link to={`/user-edit/${user.id}`} className="btn bg-primary text-white hover:bg-primary-600">
              Modifier l'utilisateur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
