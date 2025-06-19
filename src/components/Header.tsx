import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Header Component for Website
export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header>
      <nav className="nav">
        <div className="nav-wrapper">
          <div className="nav-content-wrapper">
            <div className="nav-content">
              <Link to="/" className="nav-title">
                Math Art
              </Link>
              <div className="nav-menu">
                <div
                  className={`dropdown ${isDropdownOpen ? "open" : ""}`}
                  ref={dropdownRef}
                >
                  <div className="nav-item-wrapper">
                    <button
                      className="nav-item-content"
                      onClick={toggleDropdown}
                    >
                      Galleries
                    </button>
                  </div>
                  <div className="dropdown-content">
                    <Link
                      to="/gallery/spin"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Spin Art
                    </Link>
                  </div>
                </div>
                <div className="nav-item-wrapper">
                  <Link to="/about" className="nav-item-content">
                    About
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
