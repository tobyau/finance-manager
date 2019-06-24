import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import credit_card from "../../img/credit_card.png";

class Landing extends Component {

  componentDidMount() {
    // If logged in, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <img
              src={credit_card}
              style={{ width: "350px" }}
              className="responsive-img credit-card"
              alt="Undraw"
            />
            <h4 className="flow-text">
              A personal banking web app built with the {" "}
              <span style={{ fontFamily: "monospace" }}>MERN</span> stack and the Plaid API
            </h4>
            <br />
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect white black-text"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
