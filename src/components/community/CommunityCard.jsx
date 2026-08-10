// src/components/community/CommunityCard.jsx
import React from 'react';
import { MapPin, Users, Heart } from 'lucide-react';

export default function CommunityCard({ project }) {
  const { name, location, members, description, thumbnail, category } = project;

  return (
    <div className="community-card">
      <div className="community-card-img-wrapper">
        <img src={thumbnail} alt={name} className="community-card-img" />
        <span className="community-tag">{category}</span>
      </div>

      <div className="community-card-body">
        <h4 className="community-name">{name}</h4>

        <span className="community-location">
          <MapPin className="w-3 h-3" /> {location}
        </span>

        <p className="community-description">{description}</p>

        <div className="community-footer-row">
          <span className="community-members">
            <Users className="w-3 h-3" /> {members} members
          </span>
          <button className="community-join-btn">
            <Heart className="w-3 h-3" /> Support
          </button>
        </div>
      </div>
    </div>
  );
}