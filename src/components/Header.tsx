import { Link } from "react-router-dom";

// Header Component for Website
export default function Header() {
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

