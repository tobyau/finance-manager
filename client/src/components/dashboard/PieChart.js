import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTransactions } from "../../actions/accountActions";
import { VictoryPie } from 'victory';

class PieChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const { accounts } = this.props;
    this.props.getTransactions(accounts);
  }

  render() {
    return(
      <div className="pie-container">
        <VictoryPie
          data={[
            { x: "Cats", y: 35 },
            { x: "Dogs", y: 40 },
            { x: "Birds", y: 55 }
          ]}
        />
      </div>
    );
  }
};

PieChart.propTypes = {
  getTransactions: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  plaid: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  plaid: state.plaid
});

export default connect(
  mapStateToProps,
  { getTransactions }
)(PieChart);
