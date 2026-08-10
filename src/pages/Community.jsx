// src/pages/Community.jsx
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, PlusCircle, Search, ShieldCheck, MapPin, Share2, Sparkles } from 'lucide-react';


const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    author: 'Dr. Tariq Mahmood',
    role: 'Conservation Biologist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Urgent Patrol Need: Sector MGH-422 Illegal Tree Felling',
    category: 'Forest Protection',
    time: '2 hours ago',
    location: 'Margalla Hills Sector MGH-422',
    content: 'Recent Sentinel-2 satellite data indicates 22% canopy degradation near the northern trail. Local ranger teams require community support for field ground-truthing and documentation.',
    upvotes: 48,
    replies: 14,
    hasUpvoted: false,
  },
  {
    id: 2,
    author: 'Ayesha Khan',
    role: 'GIS Analyst',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    title: 'How Remote Sensing LiDAR Detects Pine Wilt Disease Early',
    category: 'Satellite Tech',
    time: '5 hours ago',
    location: 'Islamabad GIS Lab',
    content: 'By analyzing multi-spectral NIR spectral variance, we can isolate stress signals in Himalayan Pine needles before visual yellowing occurs. Check out our open dataset!',
    upvotes: 62,
    replies: 19,
    hasUpvoted: false,
  },
  {
    id: 3,
    author: 'Margalla Wildlife Trust',
    role: 'Verified NGO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Monsoon Reforestation Drive 2024: 5,000 Saplings Target',
    category: 'Reforestation',
    time: '1 day ago',
    location: 'Margalla National Park Boundary',
    content: 'Join our volunteer team this Sunday! We are planting indigenous Chir Pine and Wild Olive saplings along degraded buffer zones.',
    upvotes: 112,
    replies: 34,
    hasUpvoted: false,
  },
];

const VOLUNTEER_GROUPS = [
  {
    id: 1,
    name: 'Margalla Eco Guardians',
    members: '1,420 Active Volunteers',
    location: 'Islamabad, PK',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
    role: 'Patrol & Monitoring'
  },
  {
    id: 2,
    name: 'Himalayan Forest Watch',
    members: '980 Active Volunteers',
    location: 'Rawalpindi & Margalla',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400',
    role: 'Conservation & Tech'
  },
  {
    id: 3,
    name: 'Green Youth Coalition',
    members: '2,150 Active Volunteers',
    location: 'National Youth Network',
    img: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=400',
    role: 'Tree Plantation'
  }
];

export default function Community() {
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Post Form Modal state
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Forest Protection');
  const [newContent, setNewContent] = useState('');

  const categories = ['All', 'Forest Protection', 'Satellite Tech', 'Reforestation', 'Local Action'];

  const handleUpvote = (id) => {
    setDiscussions(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          upvotes: item.hasUpvoted ? item.upvotes - 1 : item.upvotes + 1,
          hasUpvoted: !item.hasUpvoted
        };
      }
      return item;
    }));
  };

  const handleCreatePostSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: 'Furqan User',
      role: 'Community Analyst',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      title: newTitle,
      category: newCategory,
      time: 'Just now',
      location: 'Margalla Hills AOI',
      content: newContent,
      upvotes: 1,
      replies: 0,
      hasUpvoted: true,
    };

    setDiscussions([newPost, ...discussions]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const filteredDiscussions = discussions.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="community-page">
      
      {/* Header Banner */}
      <div className="community-header">
        <div>
          <h1 className="community-title">GreenGuard Eco Hub</h1>
          <p className="community-subtitle">
            Connect with satellite analysts, forest rangers, and conservationists protecting the Margalla Hills ecosystem.
          </p>
        </div>

        <button 
          type="button" 
          className="create-post-btn"
          onClick={() => setShowNewPostModal(true)}
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="community-layout-grid">
        
        {/* Left Column: Discussions Stream */}
        <div className="discussions-stream">
          
          {/* Search & Filter Bar */}
          <div className="community-filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search community topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="community-search-input"
              />
            </div>

            <div className="category-pills">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="discussions-list">
            {filteredDiscussions.map(post => (
              <div key={post.id} className="post-card-glass">
                
                {/* Author Info */}
                <div className="post-header">
                  <div className="post-author-box">
                    <img src={post.avatar} alt={post.author} className="author-avatar" />
                    <div>
                      <div className="author-name-row">
                        <span className="author-name">{post.author}</span>
                        <span className="author-role-badge">{post.role}</span>
                      </div>
                      <div className="post-meta-sub">
                        <span>{post.time}</span> &bull; 
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {post.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="post-category-tag">{post.category}</span>
                </div>

                {/* Content */}
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>

                {/* Card Actions */}
                <div className="post-actions-row">
                  <button 
                    type="button"
                    className={`post-action-btn ${post.hasUpvoted ? 'upvoted' : ''}`}
                    onClick={() => handleUpvote(post.id)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button type="button" className="post-action-btn">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} Replies</span>
                  </button>

                  <button type="button" className="post-action-btn ml-auto">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Conservation Groups & Stats */}
        <div className="community-sidebar">
          
          <div className="sidebar-card-glass">
            <h3 className="sidebar-card-title">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Volunteer Conservation Groups
            </h3>
            
            <div className="groups-list">
              {VOLUNTEER_GROUPS.map(group => (
                <div key={group.id} className="group-item">
                  <img src={group.img} alt={group.name} className="group-thumb" />
                  <div className="group-info">
                    <h4 className="group-name">{group.name}</h4>
                    <span className="group-members">{group.members}</span>
                  </div>
                  <button type="button" className="join-group-btn">Join</button>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card-glass">
            <h3 className="sidebar-card-title">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Deforestation Awareness Stats
            </h3>
            
            <div className="sidebar-stats-list">
              <div className="sidebar-stat-item">
                <span className="stat-num text-emerald-600">520 km²</span>
                <span className="stat-lbl">Margalla Forest Monitored</span>
              </div>
              <div className="sidebar-stat-item">
                <span className="stat-num text-red-500">15.2 km²</span>
                <span className="stat-lbl">Degradation Isolated</span>
              </div>
              <div className="sidebar-stat-item">
                <span className="stat-num text-emerald-600">4,550+</span>
                <span className="stat-lbl">Community Reports Filed</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* New Post Modal Popup */}
      {showNewPostModal && (
        <div className="save-modal-backdrop">
          <div className="save-modal-glass">
            <div className="save-modal-header">
              <div className="save-modal-title-group">
                <div className="save-modal-icon-badge">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="save-modal-title">Create Community Discussion</h3>
                  <p className="save-modal-subtitle">Share environmental insights and report forest incidents</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreatePostSubmit}>
              <div className="save-form-group">
                <label className="save-form-label">Discussion Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Forest Fire Risk Alert near Sector MGH-104"
                  className="save-form-input"
                  required
                />
              </div>

              <div className="save-form-group">
                <label className="save-form-label">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="save-form-input"
                >
                  <option value="Forest Protection">Forest Protection</option>
                  <option value="Satellite Tech">Satellite Tech</option>
                  <option value="Reforestation">Reforestation</option>
                  <option value="Local Action">Local Action</option>
                </select>
              </div>

              <div className="save-form-group">
                <label className="save-form-label">Details / Observations</label>
                <textarea 
                  rows="4"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your environmental observations or field notes..."
                  className="save-form-input"
                  required
                ></textarea>
              </div>

              <div className="save-modal-actions">
                <button 
                  type="button" 
                  className="save-modal-btn btn-cancel"
                  onClick={() => setShowNewPostModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-modal-btn btn-save">
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}