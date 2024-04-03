import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import { Button, Container, Row } from "reactstrap";

// core components

function Examples() {
  return (
    <>
      <div className="section section-examples" data-background-color="black">
        <div className="space-50"></div>
        <Container className="text-center">
          <Row>
            <div className="col">
              <a href="" target="_blank">
                <img
                  alt="..."
                  className="img-raised"
                  src={require("assets/img/landing.jpg")}
                ></img>
              </a>
              <Button
                className="btn-round"
                color="default"
                to=""
                outline
                tag={Link}
              >
                OPSHIFT
              </Button>
            </div>
            <div className="col">
              <a href="" target="_blank">
                <img
                  alt="..."
                  className="img-raised"
                  src={require("assets/img/profile.jpg")}
                ></img>
              </a>
              <Button
                className="btn-round"
                color="default"
                to=""
                outline
                tag={Link}
              >
                MoveMaster
              </Button>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Examples;
