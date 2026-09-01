import '@css/trello/home.css';

// import './TrelloLayout.scss'; // Import file SCSS
// Nhớ cài đặt và import Bootstrap Icons vào file gốc (vd: index.js): 
import 'bootstrap-icons/font/bootstrap-icons.css';

import React, { useState } from 'react';
// import './TrelloLayout.scss';

const Navbar = () => (
  <nav className="navbar navbar-expand-md trello-navbar px-3 border-bottom">
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="d-flex align-items-center">
        <a className="navbar-brand d-flex align-items-center me-3" href="#!">
          <div className="trello-logo-icon me-1"><i className="bi bi-trello"></i></div>
          <span className="fw-bold text-dark logo-text">Trello</span>
        </a>
      </div>

      <div className="collapse navbar-collapse d-none d-md-flex">
        <ul className="navbar-nav me-auto gap-1 fw-semibold">
          <li className="nav-item"><a className="nav-link text-dark rounded px-2" href="#!">Workspaces <i className="bi bi-chevron-down fs-8"></i></a></li>
          <li className="nav-item"><a className="nav-link text-dark rounded px-2" href="#!">Recent <i className="bi bi-chevron-down fs-8"></i></a></li>
          <li className="nav-item"><a className="nav-link text-dark rounded px-2" href="#!">Starred <i className="bi bi-chevron-down fs-8"></i></a></li>
          <li className="nav-item"><a className="nav-link text-dark rounded px-2" href="#!">Templates <i className="bi bi-chevron-down fs-8"></i></a></li>
          <li className="nav-item ms-2 align-self-center">
            <button className="btn btn-primary btn-sm fw-bold px-3 create-btn">Create</button>
          </li>
        </ul>
      </div>
      
      {/* Right Actions (Search, Noti, Avatar) */}
<div className="d-flex align-items-center gap-2">
  <div className="input-group search-bar d-none d-sm-flex align-items-center rounded">
    <i className="bi bi-search ms-2 text-muted"></i>
    <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Search" />
  </div>
  <button className="btn btn-sm btn-icon rounded-circle"><i className="bi bi-bell"></i></button>
  <button className="btn btn-sm btn-icon rounded-circle"><i className="bi bi-question-circle"></i></button>
  
  {/* Profile Dropdown */}
  <div className="dropdown ms-1">
    <div 
      className="avatar-circle cursor-pointer" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
      // Added inline style just for the active ring shown in the image
      style={{ border: '0.2rem solid #1d7afc', padding: '0.2rem' }} 
    >
      <img 
        src="https://avatars.githubusercontent.com/u/1?v=4" // Replace with your actual user avatar
        alt="Nam Pham" 
        className="w-100 h-100 rounded-circle shadow-sm" 
        style={{ objectFit: 'cover' }} 
      />
    </div>
    
    <ul className="dropdown-menu dropdown-menu-end trello-profile-dropdown shadow-sm mt-2">
      <li className="dropdown-header">Account</li>
      <li>
        <div className="d-flex align-items-center px-3 py-2 mb-1">
          <div className="avatar-circle-lg me-3">
             <img src="https://avatars.githubusercontent.com/u/1?v=4" alt="Nam" className="w-100 h-100 rounded-circle" />
          </div>
          <div className="user-info">
            <div className="fw-bold fs-6">Nam Pham Van</div>
            <div className="text-muted fs-8">p_vannam@thk-hd.vn</div>
          </div>
        </div>
      </li>
      <li><a className="dropdown-item" href="#!">Switch accounts</a></li>
      <li>
        <a className="dropdown-item d-flex justify-content-between align-items-center" href="#!">
          Manage account <i className="bi bi-box-arrow-up-right fs-8 text-muted"></i>
        </a>
      </li>
      
      <li><hr className="dropdown-divider" /></li>
      
      <li className="dropdown-header">Trello</li>
      <li><a className="dropdown-item" href="#!">Profile and visibility</a></li>
      <li><a className="dropdown-item" href="#!">Activity</a></li>
      <li><a className="dropdown-item" href="#!">Cards</a></li>
      <li><a className="dropdown-item" href="#!">Settings</a></li>
      <li>
        <a className="dropdown-item d-flex justify-content-between align-items-center" href="#!">
          Labs 
          <span className="badge text-dark fs-8 px-2 py-1" style={{ backgroundColor: '#f5cd47' }}>
            <i className="bi bi-stars me-1"></i>Labs
          </span>
        </a>
      </li>
      <li>
        <a className="dropdown-item d-flex justify-content-between align-items-center" href="#!">
          <span><i className="bi bi-circle-half me-2"></i> Theme</span>
          <i className="bi bi-chevron-right fs-8 text-muted"></i>
        </a>
      </li>
      
      <li><hr className="dropdown-divider" /></li>
      
      <li>
        <a className="dropdown-item" href="#!">
          <i className="bi bi-people me-2 fs-6"></i> Create Workspace
        </a>
      </li>
      
      <li><hr className="dropdown-divider" /></li>
      
      <li><a className="dropdown-item" href="#!">Help</a></li>
      <li><a className="dropdown-item" href="#!">Shortcuts</a></li>
      
      <li><hr className="dropdown-divider" /></li>
      
      <li><a className="dropdown-item" href="#!">Log out</a></li>
    </ul>
  </div>
</div>
    </div>
  </nav>
);

const Sidebar = () => (
  <aside className="trello-sidebar pt-4 px-3 d-none d-md-block">
    <ul className="nav flex-column gap-1 mb-3">
      <li className="nav-item">
        <a className="nav-link active d-flex align-items-center rounded px-3 py-2" href="#!">
          <i className="bi bi-trello me-2"></i> Boards
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link d-flex align-items-center text-dark rounded px-3 py-2" href="#!">
          <i className="bi bi-person me-2"></i> Members
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link d-flex align-items-center text-dark rounded px-3 py-2" href="#!">
          <i className="bi bi-gear me-2"></i> Workspace settings <i className="bi bi-chevron-down ms-auto fs-8"></i>
        </a>
      </li>
    </ul>

    <div className="fw-semibold fs-7 text-muted mb-2 px-3">Workspace views</div>
    <ul className="nav flex-column gap-1">
      <li className="nav-item">
        <a className="nav-link d-flex align-items-center text-dark rounded px-3 py-2 fst-italic" href="#!">
          <i className="bi bi-table me-2"></i> Table
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link d-flex align-items-center text-dark rounded px-3 py-2 fst-italic" href="#!">
          <i className="bi bi-calendar4 me-2"></i> Calendar
        </a>
      </li>
    </ul>
  </aside>
);

const BoardCard = ({ title, bgType, bgValue }) => {
  const [isStarred, setIsStarred] = useState(false);

  const style = bgType === 'image' 
    ? { backgroundImage: `url('${bgValue}')` }
    : { backgroundColor: bgValue };

  const toggleStar = (e) => {
    e.preventDefault();
    setIsStarred(!isStarred);
  };

  return (
    <div className="col board-col">
      <a href="#!" className="board-tile rounded text-decoration-none d-block position-relative" style={style}>
        <div className="board-overlay w-100 h-100 position-absolute top-0 start-0 rounded"></div>
        <div className="p-2 d-flex flex-column h-100 position-relative z-1">
          <span className="text-white fw-bold fs-6 board-title">{title}</span>
          <i 
            className={`bi ${isStarred ? 'bi-star-fill text-warning opacity-100' : 'bi-star text-white'} mt-auto align-self-end star-icon fs-6`}
            onClick={toggleStar}
          ></i>
        </div>
      </a>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="trello-app vh-100 d-flex flex-column">
      <Navbar />
      
      <div className="d-flex flex-grow-1 overflow-hidden layout-body">
        <Sidebar />
        
        <main className="trello-main-content flex-grow-1 overflow-auto">
          <div className="boards-page-container">
            
            {/* Workspace Header exactly like Trello */}
            <div className="workspace-header d-flex align-items-center border-bottom pb-4 mb-4 mt-5">
              <div className="workspace-logo-xl text-white fw-bold me-3 d-flex justify-content-center align-items-center fs-2 rounded">
                N
              </div>
              <div className="workspace-header-info flex-grow-1">
                <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  Nam Pham's workspace <i className="bi bi-pencil fs-6 text-muted cursor-pointer hover-icon"></i>
                </h2>
                <span className="fs-7 text-muted">Free</span>
              </div>
            </div>
            
            {/* Boards Section */}
            <div className="boards-section">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="section-icon-box bg-dark text-white rounded d-flex justify-content-center align-items-center">
                  <i className="bi bi-person fs-5"></i>
                </div>
                <h4 className="fw-bold m-0 fs-5">Your boards</h4>
              </div>

              {/* Trello uses a specific tile width, usually fitting 4 in a row max */}
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3 board-grid">
                
                <BoardCard title="E-commerce Project" bgType="color" bgValue="#0079bf" />
                <BoardCard title="Marketing Campaign" bgType="image" bgValue="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=400&auto=format&fit=crop" />
                <BoardCard title="Q3 Roadmap" bgType="color" bgValue="#d29034" />

                <div className="col board-col">
                  <a href="#!" className="board-tile create-board rounded text-decoration-none d-flex justify-content-center align-items-center h-100">
                    <span className="text-dark fs-7">Create new board</span>
                  </a>
                </div>

              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};
