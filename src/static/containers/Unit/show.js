import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as unitActionCreators from '../../actions/unit';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';

class ShowUnitView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showContactInformationFlag: false
        };
    }

    componentWillUnmount() { 
        this.props.actions.resetGetUnit();
    }

    componentDidMount() {
        this.props.actions.getUnit(this.props.token, this.props.params.id);
    }

    componentDidUpdate() {
        // Needs to run in componentDidUpdate() because the reviews are dynamically added
        if (this.props.hasGottenUnit) {
            for (var i=0; i<this.props.unit.building_reviews.length; ++i) {
                $(ReactDOM.findDOMNode(this.refs["review-" + i])).rating('disable');
            }
            $(ReactDOM.findDOMNode(this.refs.settingsDropdown)).dropdown();
        }
    }

    showContactInformation = (e) => {
        this.setState({showContactInformationFlag:true});
    }
    
    favorite = () => {
        this.props.jiggleFavorites();
        this.props.actions.createFavorite(this.props.token, null, this.props.unit.uuid);
    }

    delete = () => {
        this.props.actions.deleteUnit(this.props.token, this.props.params.id,'/unit/list');
    }

    render() {
        const formClass = classNames({
            loading: this.props.isGettingUnit
        });

        let favoriteClass = null;
        let unitInformation = null;
        let actionMenu = null;

        if (this.props.hasGottenUnit) {
            favoriteClass = classNames({
                disabled: this.props.hasCreatedFavorite || this.props.unit.is_favorite
            });

            if (this.props.isAuthenticated) {
                let deleteUnit = null;
                
                if (this.props.userID == this.props.unit.creator) {
                    deleteUnit = (
                        <div onClick={this.delete} className={"item " }>
                            Delete
                        </div>
                    )
                }

                actionMenu = (
                    <div className="ui icon top right pointing blue dropdown button" ref="settingsDropdown">
                        <i className="wrench icon"></i>
                        <div className="menu">
                            <div onClick={() => this.props.dispatch(push('/review/add'))}  className="item">
                                Add review 
                            </div>
                            <div onClick={this.favorite} className={"item " + favoriteClass}>
                                Add to favorites 
                            </div>
                            {deleteUnit}
                        </div>
                    </div>
                )
            }
            
            let center = [parseFloat(this.props.unit.building_data.latitude), parseFloat(this.props.unit.building_data.longitude)];

            let reviews = (
                this.props.unit.building_reviews.map(function(s,i) {
                    return (
                        <div key={i} className="ui relaxed divided list">
                            <div className="item">
                                <i className="middle aligned fa-comment icon"></i>
                                <div className="content">
                                    <a className="header">
                                        <div data-max-rating="5" className="ui star rating" ref={"review-" + i} data-rating={s.rating}></div>
                                    </a>
                                    <div className="description">{s.comments}<br/><i className="reviewee">{s.anonymous == true ? "anonymous" : s.reviewee.first_name + " " + s.reviewee.last_name[0]}.</i></div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )

            let contactBlock = null;

            if (!this.state.showContactInformationFlag) {
                contactBlock = (
                    <a onClick={this.showContactInformation} className="">
                        Show contact information
                    </a>
                )
            }

            else {
                contactBlock = (
                    <span>
                        {this.props.unit.contact_information}
                    </span>
                )
            }

            unitInformation = (
                <div className="ui grid">
                    <div className="ui row">
                        <div className="five wide column">
                            pictures will go here
                            <br/>
                            <br/>
                            <Map zoomControl={false} center={center} zoom={14} ref="map">
                                <TileLayer
                                    url='https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'
                                    attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
                                />
                                <Marker position={center}
                                    icon={
                                        L.AwesomeMarkers.icon({
                                            prefix: 'fa',
                                            shadowSize: [0,0],
                                            icon: 'fa-unit',
                                            markerColor: 'red'
                                        })
                                    }
                                > 
                                </Marker>
                            </Map>
                        </div>
                        <div className="seven wide column">
                            <h3 className="ui header">
                                {this.props.unit.title}
                            </h3>
                            <div className="ui list">
                                <div className="item">
                                    <i className="icon fa-bed"></i>
                                    <div className="content">
                                        {this.props.unit.num_beds} bed / {this.props.unit.num_baths} bath
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="icon fa-usd"></i>
                                    <div className="content">
                                        {this.props.unit.rent} / month
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="icon fa-phone"></i>
                                    <div className="content">
                                        {contactBlock}
                                    </div>
                                </div>
                            </div>
                            <p>
                                {this.props.unit.description}
                            </p>
                        </div>
                        <div className="four wide column">
                            {reviews}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div id="show-unit-container">
                <DocumentTitle title='Unit'>
                    <div className="ui container">
                        <div className="ui right aligned grid">
                            <div className="left floated left aligned six wide column">
                                <h2 id="" classNameName="ui header">
                                    Unit
                                </h2>
                            </div>
                            <div className="right floated right aligned six wide column">
                                {actionMenu}
                            </div>
                        </div>
                        <form className={"ui form " + formClass} ref="unitForm" >
                            {unitInformation}
                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isGettingUnit: state.unit.isGettingUnit,
        hasGottenUnit: state.unit.hasGottenUnit,
        unit: state.unit.unit,
        isCreatingFavorite: state.user.isCreatingFavorite,
        hasCreatedFavorite: state.user.hasCreatedFavorite,
        favoriteID: state.user.favoriteID,
        isAuthenticated: state.auth.isAuthenticated,
        userID: state.auth.userID,
        token: state.auth.token // We usually get this from requireAuthentication wrapper but this does not go through that
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({... unitActionCreators, ... userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowUnitView);
export { ShowUnitView as ShowUnitViewNotConnected };
