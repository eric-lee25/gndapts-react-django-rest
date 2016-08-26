import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as unitActionCreators from '../../actions/unit';
import * as buildingActionCreators from '../../actions/building';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';

class AddUnitView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buildingID: null,
            number: null,
            numBeds: null,
            numBaths: null,
            title: null,
            amenities: null,
            description: null,
            rent: null,
            securityDeposit: null
        };
    }

    componentWillUnmount() { 
        $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('destroy');
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown({
            'onChange': function(val){
                this.setState({buildingID: val});
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.createUnitForm))
            .form({
                fields: {
                    buildingID: {
                        identifier  : 'buildingID',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please select a building'
                            },
                        ]
                    },
                    number: {
                        identifier  : 'number',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    numBeds: {
                        identifier  : 'numBeds',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    numBaths: {
                        identifier  : 'numBaths',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    title: {
                        identifier  : 'title',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                        ]
                    },
                    amenities: {
                        identifier  : 'amenities',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                        ]
                    },
                    description: {
                        identifier  : 'description',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a description'
                            },
                        ]
                    },
                    rent: {
                        identifier  : 'rent',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    securityDeposit: {
                        identifier  : 'securityDeposit',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    }
                },
                inline:true
            });
            this.props.actions.listBuildings(this.props.token);
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    createUnit = (e) => {
        $(ReactDOM.findDOMNode(this.refs.createUnitForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.createUnitForm)).form('is valid')) {
            this.props.actions.createUnit(
                this.props.token,
                this.state.number, this.state.numBeds, this.state.numBaths,
                this.state.title, this.state.amenities, this.state.description,
                this.state.rent, this.state.securityDeposit, this.state.buildingID,
                '/map');
        }
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isCreating
        });
        
        const formClass = classNames({
            loading: this.props.isGettingList
        });

        let buildingList = null;

        if (this.props.hasGottenList == true) {
            buildingList = 
            this.props.buildingList.results.map(function(s, i){
                return (
                    <div key={i} className="item" data-value={s.uuid}>{s.title}</div>
                )
            });
        }

        return (
            <div id="add-unit-container">
                <DocumentTitle title='Add unit'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Add unit
                        </h2>
                        <form className={"ui form " + formClass} ref="createUnitForm" >
                            <div className="eight wide field">
                                <label>Building</label>
                                <div className="ui selection dropdown" ref="buildingDropdown">
                                    <input type="hidden" name="buildingID"/>
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select a building</div>
                                    <div className="menu">
                                        {buildingList}
                                    </div>
                                </div>
                            </div>
                            <div className="six wide field">
                                <label>Title</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="title"
                                        onChange={(e) => { this.handleInputChange(e, 'title'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Unit number</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="number"
                                        onChange={(e) => { this.handleInputChange(e, 'number'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Number of beds</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="numBeds"
                                        onChange={(e) => { this.handleInputChange(e, 'numBeds'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Number of baths</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="numBaths"
                                        onChange={(e) => { this.handleInputChange(e, 'numBaths'); }}
                                    />
                                </div>
                            </div>
                            <div className="eight wide field">
                                <label>Amenities</label>
                                <textarea 
                                    name="amenities"
                                    rows="2"
                                    onChange={(e) => { this.handleInputChange(e, 'amenities')}}
                                ></textarea> 
                            </div>
                            <div className="eight wide field">
                                <label>Description</label>
                                <textarea 
                                    name="description"
                                    rows="2"
                                    onChange={(e) => { this.handleInputChange(e, 'description')}}
                                ></textarea> 
                            </div>
                            <div className="two wide field">
                                <label>Rent</label>
                                <div className="ui right labeled input">
                                    <div className="ui label">$</div>
                                    <input type="text"
                                        name="rent"
                                        onChange={(e) => { this.handleInputChange(e, 'rent'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Security deposit</label>
                                <div className="ui right labeled input">
                                    <div className="ui label">$</div>
                                    <input type="text"
                                        name="securityDeposit"
                                        onChange={(e) => { this.handleInputChange(e, 'securityDeposit'); }}
                                    />
                                </div>
                            </div>

                            <div className={"ui green button " + buttonClass }
                                type="submit" onClick={this.createUnit}
                            >
                                Submit
                            </div>

                            <div className="ui error message">
                            </div>

                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isCreated: state.unit.isCreated,
        isCreating: state.unit.isCreating,
        statusText: state.unit.statusText,
        isGettingList: state.building.isGettingList,
        hasGottenList: state.building.hasGottenList,
        buildingList: state.building.buildingList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...unitActionCreators, ...buildingActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUnitView);
export { AddUnitView as AddUnitViewNotConnected };
