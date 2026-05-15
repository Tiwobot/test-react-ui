/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap-compat";

function DarkFooter() {
  return (
    <footer className="footer" data-background-color="black">
      <Container>
        <nav>
          <ul>
            <li>
              <a
                href="https://liavenic.online"
                target="_blank"
              >
                LiaVenic
              </a>
            </li>
            <li>
              <a
                href="https://aboutus.com"
                target="_blank"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://blog.com"
                target="_blank"
              >
                Blog
              </a>
            </li>
          </ul>
        </nav>
        <div className="copyright" id="copyright">
          © {new Date().getFullYear()}, LiaVenic{" "}
        </div>
      </Container>
    </footer>
  );
}

export default DarkFooter;
