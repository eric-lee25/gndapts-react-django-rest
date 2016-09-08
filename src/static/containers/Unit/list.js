import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as unitActionCreators from '../../actions/unit';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';

class ListUnitsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            units: null,
        };
    }

    componentWillUnmount() { 
    }

    componentDidMount() {
        this.props.actions.listUnits(this.props.token);
    }

    render() {
        const formClass = classNames({
            loading: this.props.isGettingList
        });

        let unitList = null;
        let unitCount = null;

        if (this.props.hasGottenList == true) {
            unitCount = this.props.unitList.results.length;
            if (unitCount == 0) {
                unitList = ( 
                    <tr key="0">
                        <td colspan="5">No units</td>
                    </tr>
                )
            }

            else {
                unitList = 
                this.props.unitList.results.map(function(s, i){
                    return (
                        <tr key={i}>
                            <td>{s.title}</td>
                            <td>{s.building_data.title}</td>
                            <td>{s.rent}</td>
                            <td>{s.num_beds}</td>
                            <td>{s.num_baths}</td>
                        </tr>
                    )
                });
            }
        }

        return (
            <div id="list-unit-container">
                <DocumentTitle title='List units'>
                    <div className="ui container">
                        <h2 className="ui header">
                            My units
                        </h2>
                        <form className={"ui form " + formClass} ref="createUnitForm" >
                            <table className="ui fixed table">
                                <thead>
                                    <tr>
                                        <th>Unit</th>
                                        <th>Building</th>
                                        <th>Rent</th>
                                        <th>Number bedrooms</th>
                                        <th>Number bathrooms</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitList}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>{unitCount} units</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </tfoot>
                            </table>
                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isGettingList: state.unit.isGettingList,
        hasGottenList: state.unit.hasGottenList,
        unitList: state.unit.unitList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(unitActionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListUnitsView);
export { ListUnitsView as ListUnitsViewNotConnected };
