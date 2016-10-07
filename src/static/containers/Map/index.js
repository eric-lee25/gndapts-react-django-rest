import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './style.scss';
import * as buildingActionCreators from '../../actions/building';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import './range.js';
import './range.css';
import { push } from 'react-router-redux';


class MapView extends React.Component {

    static propTypes = {
        statusText: React.PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            maximumRent: 1500,
            numberBedrooms: 0,
            numberBathrooms: 0,
            flag: false,
            shit: false,
            favoriteBuildings: {}
        };
    }

    updateBuildings() {
        this.props.actions.listBuildings(this.props.token, this.state.maximumRent, this.state.numberBedrooms, this.state.numberBathrooms);
    }

    componentDidMount() {
        this.updateBuildings();

        // Set a flag to true if they are dragging a slider.
        $(ReactDOM.findDOMNode(this.refs.rentSlider)).mousedown(function() {
            this.setState({flag: true});
        }.bind(this));

        $(ReactDOM.findDOMNode(this.refs.bedroomSlider)).mousedown(function() {
            this.setState({flag: true});
        }.bind(this));

        $(ReactDOM.findDOMNode(this.refs.bathroomSlider)).mousedown(function() {
            this.setState({flag: true});
        }.bind(this));

        // If they release the mouse button and the flag is set, that means
        // they just finished dragging the rent slider
        $('body').mouseup(function(e) {
            if (this.state.flag) {
                this.setState({flag: false});
                this.updateBuildings();
            }
        }.bind(this));

        $(ReactDOM.findDOMNode(this.refs.rentSlider)).range({
            min: 0,
            max: 15,
            start: 15,
            onChange: function(val) { 
                this.setState({maximumRent: val*100});
            }.bind(this)
        });
        
        $(ReactDOM.findDOMNode(this.refs.bedroomSlider)).range({
            min: 0,
            max: 5,
            start: 0,
            onChange: function(val) { 
                this.setState({numberBedrooms: val});
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.bathroomSlider)).range({
            min: 0,
            max: 5,
            start: 0,
            onChange: function(val) { 
                this.setState({numberBathrooms: val});
            }.bind(this)
        });
    }

    componentDidUpdate() {
    }

    favorite = (buildingID) => {
        // Keep track of the buildings we favorite so that we can disable the button down below
        const favoriteBuildings = this.state.favoriteBuildings;
        favoriteBuildings[buildingID] = "true";
        this.setState({
            favoriteBuildings: favoriteBuildings,
        });

        this.props.jiggleFavorites();
        this.props.actions.createFavorite(this.props.token, buildingID);
    }
    
    render() {
        const centerPosition = [12.0000325,-61.7738056];
        const stGeorgeUniversityPosition = [12.000933,-61.773806];
        
        // parent div is 4em padding - header height
        const mapStyle = {height: window.innerHeight-56}

        const formClass = classNames({
            loading: this.props.isGettingBuildingList
        });

        let buildingList = null;

        if (this.props.hasGottenBuildingList == true) {
            buildingList = 
            this.props.buildingList.results.map(function(s, i){
                const favoriteClass = classNames({
                    disabled: s.is_favorite || (s.uuid in this.state.favoriteBuildings)
                });

                const p = [parseFloat(s.latitude), parseFloat(s.longitude)]
                const lt = 
                    s.unit_summary.lease_types.map(function(t,j) {
                        return <span key={j}>{t}{j==s.unit_summary.lease_types.length-1 ? "" : ", "}</span>
                    }); 

                let photos, thumbContainer = null;

                if (s.photos != null) {
                    const maxThumbs = 6;
                    photos = (
                        s.photos.map(function(t,j) {
                            if (j < maxThumbs-1) {
                                return <img className="ui image" key={j} src={t.thumb} />
                            }
                        })
                    )
                    thumbContainer = (
                        <div id="thumb-container" className="sixteen wide column">
                            <div className="ui tiny images">
                                {photos}
                            </div>
                        </div>
                    )
                }

                return (
                    <Marker key={i} position={p}
                        icon={
                            L.AwesomeMarkers.icon({
                                prefix: 'fa',
                                shadowSize: [0,0],
                                icon: 'fa-home',
                                markerColor: 'red'
                            })
                        }
                    > 
                        <Popup closeButton={false} maxWidth="256" minWidth="256">
                            <div className="ui info-window grid">
                                <div className="name sixteen wide column">
                                    <h4 className="ui header">
                                        {s.title}
                                    </h4>
                                </div>
                                <div className="details-left eight wide column">
                                    <div className="ui list">
                                        <div className="item">
                                            <div className="header">Rent</div>
                                            ${s.unit_summary.rent__min} - ${s.unit_summary.rent__max}
                                        </div>
                                        <div className="item">
                                            <div className="header">Bedroom</div>
                                            {s.unit_summary.num_beds__min} - {s.unit_summary.num_beds__max}
                                        </div>
                                    </div>
                                </div>
                                <div className="details-right eight wide column">
                                    <div className="ui list">
                                        <div className="item">
                                            <div className="header">Lease type</div>
                                            {lt}
                                        </div>
                                    </div>
                                </div>
                                {thumbContainer}
                                <div id="button-group" className="sixteen wide column center aligned">
                                    <div className="ui small labeled icon buttons">
                                        <button onClick={() => this.props.dispatch(push('/building/show/' + s.uuid))} className="small ui primary button">
                                          <i className="building icon"></i>
                                            Building
                                        </button>
                                        <div onClick={() => { this.favorite(s.uuid) }} className={"small ui green button " + favoriteClass}>
                                          <i className="heart icon"></i>
                                            Favorite
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            }.bind(this));
        }

        return (
            <div id="map-view-container">
                <form className={"ui form " + formClass}>
                    <DocumentTitle title='Map'>
                        <Map style={mapStyle} center={centerPosition} zoom={15}>
                            <TileLayer
                                url='https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'
                                attribution='<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>'
                            />
                            <Marker position={stGeorgeUniversityPosition}
                                icon={
                                    L.AwesomeMarkers.icon({
                                        prefix: 'fa',
                                        shadowSize: [0,0],
                                        icon: 'fa-hospital-o',
                                        markerColor: 'purple'
                                    })
                                }
                            > 
                            </Marker>
                            {buildingList}
                        </Map>
                    </DocumentTitle>
                </form>
                <div id="filter-box" className="ui raised segments">
                    <div className="ui segment">
                        <p>Rent <span className="info-text"><b>&lt;${this.state.maximumRent}</b></span></p>
                        <div className="ui range" ref="rentSlider"></div>
                    </div>
                    <div className="ui segment">
                        <p>Bedrooms <span className="info-text"><b>&gt;{this.state.numberBedrooms}</b></span></p>
                        <div className="ui red range" ref="bedroomSlider"></div>
                    </div>
                    <div className="ui segment">
                        <p>Bathrooms <span className="info-text"><b>&gt;{this.state.numberBathrooms}</b></span></p>
                        <div className="ui green range" ref="bathroomSlider"></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusText: state.auth.statusText,
        isGettingBuildingList: state.building.isGettingList,
        hasGottenBuildingList: state.building.hasGottenList,
        buildingList: state.building.buildingList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({... buildingActionCreators, ... userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
export { MapView as MapViewNotConnected };
