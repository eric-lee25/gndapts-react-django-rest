import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as unitActionCreators from '../../actions/unit';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import './tablesort.js';

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
        $(ReactDOM.findDOMNode(this.refs.settingsDropdown)).dropdown();
    }

    componentDidUpdate() {
        if (this.props.hasGottenList) {
            $(ReactDOM.findDOMNode(this.refs.unitTable)).tablesort();
            $(ReactDOM.findDOMNode(this.refs.unitTable)).data('tablesort').sort($("th.building"), 'asc');
            $(ReactDOM.findDOMNode(this.refs.unitTable)).data('tablesort').sort($("th.building"), 'asc'); // weird glitch
        }
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
                            <td><Link to={`/unit/show/${s.uuid}`}>{s.title}</Link></td>
                            <td>{s.number}</td>
                            <td><Link to={`/building/show/${s.building_data.uuid}`}>{s.building_data.title}</Link></td>
                            <td>{s.building_data.neighborhood_name}</td>
                            <td>${s.rent}</td>
                            <td>{s.num_beds}</td>
                            <td>{s.num_baths}</td>
                        </tr>
                    )
                });
            }
        }

        return (
            <div id="list-unit-container">
                <DocumentTitle title='My units'>
                    <div className="ui container">
                        <div className="ui right aligned grid">
                            <div className="left floated left aligned six wide column">
                                <h2 id="my-units-header" classNameName="ui header">
                                    My units
                                </h2>
                            </div>
                            <div className="right floated right aligned six wide column">
                                <div className="ui icon top right pointing blue dropdown button" ref="settingsDropdown">
                                    <i className="wrench icon"></i>
                                    <div className="menu">
                                        <div onClick={() => this.props.dispatch(push('/building/add'))}  className="item">
                                            Add building
                                        </div>
                                        <div className="item" onClick={() => this.props.dispatch(push('/unit/add'))}>
                                            Add unit
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form className={"ui form " + formClass} ref="createUnitForm" >
                            <table ref="unitTable" className="ui sortable fixed table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Unit</th>
                                        <th className="building">Building</th>
                                        <th>Neighborhood</th>
                                        <th>Rent</th>
                                        <th>Bedrooms</th>
                                        <th>Bathrooms</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitList}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>{unitCount} unit(s)</th>
                                        <th></th>
                                        <th></th>
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
