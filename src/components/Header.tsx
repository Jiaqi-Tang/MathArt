import { Link } from "react-router-dom";
import { useState } from 'react';

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  const toggleSearchModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
    <header>
      <nav className="nav">
        <div className="nav-wrapper">
          <div className="nav-content-wrapper">
            <div className="nav-content">
              <Link to="/" className="nav-title">Math Art</Link>
              <div className="nav-menu">
                <div className="dropdown">
                  <div className="nav-item-wrapper">
                    <button className="nav-item-content">Gallerys</button>
                  </div>
                  <div className="dropdown-content">
                    <Link to="/gallery/spin">Spin Art</Link>
                  </div>
                </div>
                <div className="nav-item-wrapper">
                  <Link to="/about" className="nav-item-content">About</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}

