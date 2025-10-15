import React from 'react';

export default function NavbarBrand() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{ background: 'linear-gradient(90deg,#6ee7f9,#7c3aed)' }}
    >
      <div className="container">
        <span className="navbar-brand fw-semibold">
          <i className="bi bi-heart-pulse me-2"></i> SaludApp
        </span>
      </div>
    </nav>
  );
}
