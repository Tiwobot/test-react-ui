import React from "react";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";

// core components

function Navbars() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  return (
    <>
      <div className="section section-navbars">
        <div id="navbar">
          <div
            className="navigation-example"
            style={{
              backgroundImage: "url(" + require("assets/img/bg7.jpg") + ")"
            }}
          >
            <Navbar className="navbar-transparent" expand="lg">
              <Container>
                <div className="navbar-translate">
                  <NavbarBrand
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Transparent
                  </NavbarBrand>
                  <button
                    onClick={() => {
                      document.documentElement.classList.toggle("nav-open");
                      setCollapseOpen(!collapseOpen);
                    }}
                    aria-expanded={collapseOpen}
                    className="navbar-toggler"
                    type="button"
                  >
                    <span className="navbar-toggler-bar bar1"></span>
                    <span className="navbar-toggler-bar bar2"></span>
                    <span className="navbar-toggler-bar bar3"></span>
                  </button>
                </div>
                <Collapse isOpen={collapseOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fab fa-facebook-square"></i>
                        <p>Facebook</p>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fab fa-twitter"></i>
                        <p>Twitter</p>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fab fa-instagram"></i>
                        <p>Instagram</p>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Collapse>
              </Container>
            </Navbar>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbars;
