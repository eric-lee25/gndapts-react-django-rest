import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as buildingActionCreators from '../../actions/building';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';

class ShowBuildingView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() { 
        this.props.actions.resetGetBuilding();
        this.props.actions.resetCreateFavorite();
    }

    componentDidMount() {
        this.props.actions.getBuilding(this.props.token, this.props.params.id);
    }

    componentDidUpdate() {
        // Needs to run in componentDidUpdate() because the reviews are dynamically added
        if (this.props.hasGottenBuilding) {
            for (var i=0; i<this.props.building.review_set.length; ++i) {
                $(ReactDOM.findDOMNode(this.refs["review-" + i])).rating('disable');
            }
            $(ReactDOM.findDOMNode(this.refs.settingsDropdown)).dropdown();
        }
    }

    favorite = () => {
        this.props.jiggleFavorites();
        this.props.actions.createFavorite(this.props.token, this.props.params.id);
    }

    render() {
        const formClass = classNames({
            loading: this.props.isGettingBuilding
        });

        let buildingInformation = null;
        let favoriteClass = null;
        let actionMenu = null;

        if (this.props.hasGottenBuilding) {
            favoriteClass = classNames({
                disabled: this.props.hasCreatedFavorite || this.props.building.is_favorite
            });

            if (this.props.isAuthenticated) {
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
                        </div>
                    </div>
                )
            }

            let center = [parseFloat(this.props.building.latitude), parseFloat(this.props.building.longitude)];


            let unitList = (
                this.props.building.unit_set.map(function(s,i) {
                    return (
                        <tr key={i}>
                            <td><Link to={`/unit/show/${s.uuid}`}>{s.title}</Link></td>
                            <td>${s.rent}</td>
                            <td>{s.num_beds}</td>
                            <td>{s.num_baths}</td>
                        </tr>
                    )
                })
            )

            let reviews = (
                this.props.building.review_set.map(function(s,i) {
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

            buildingInformation = (
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
                                            icon: 'fa-building',
                                            markerColor: 'purple'
                                        })
                                    }
                                > 
                                </Marker>
                            </Map>
                        </div>
                        <div className="seven wide column">
                            <h3 className="ui header">
                                {this.props.building.title}
                                <div className="sub header">
                                    {this.props.building.unit_set.length} unit(s)
                                </div>
                            </h3>
                            <p>
                                {this.props.building.description}
                            </p>
                            <table className="ui fixed table">
                                <thead>
                                    <tr>
                                        <th>Unit</th>
                                        <th>Rent</th>
                                        <th>Bed</th>
                                        <th>Bath</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitList}
                                </tbody>
                            </table>
                        </div>
                        <div className="four wide column">
                            {reviews}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div id="show-building-container">
                <DocumentTitle title='Building'>
                    <div className="ui container">
                        <div className="ui right aligned grid">
                            <div className="left floated left aligned six wide column">
                                <h2 id="" classNameName="ui header">
                                    Building
                                </h2>
                            </div>
                            <div className="right floated right aligned six wide column">
                                {actionMenu}
                            </div>
                        </div>
                        <form className={"ui form " + formClass} ref="buildingForm" >
                            {buildingInformation}
                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isGettingBuilding: state.building.isGettingBuilding,
        hasGottenBuilding: state.building.hasGottenBuilding,
        building: state.building.building,
        isCreatingFavorite: state.user.isCreatingFavorite,
        hasCreatedFavorite: state.user.hasCreatedFavorite,
        favoriteID: state.user.favoriteID,
        isAuthenticated: state.auth.isAuthenticated,
        token: state.auth.token // We usually get this from requireAuthentication wrapper but this does not go through that
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({...buildingActionCreators, ... userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowBuildingView);
export { ShowBuildingView as ShowBuildingViewNotConnected };
