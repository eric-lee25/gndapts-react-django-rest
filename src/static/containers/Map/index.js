import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './style.scss';
import * as buildingActionCreators from '../../actions/building';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import './range.js';
import './range.css';


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
            flag: false
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
                const p = [parseFloat(s.latitude), parseFloat(s.longitude)]
                const lt = 
                    s.unit_summary.lease_types.map(function(t,j) {
                        return <span key={j}>{t}{j==s.unit_summary.lease_types.length-1 ? "" : ", "}</span>
                    }); 

                return (
                    <Marker key={i} position={p}
                        icon={
                            L.AwesomeMarkers.icon({
                                prefix: 'fa',
                                shadowSize: [0,0],
                                icon: 'fa-building',
                                markerColor: 'red'
                            })
                        }
                    > 
                        <Popup closeButton="false" maxWidth="200" minWidth="200">
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
                                <button className="fluid mini ui primary button">
                                      View units
                                  </button>
                            </div>
                        </Popup>
                    </Marker>
                )
            });
        }

        return (
            <div id="map-view-container">
                <form className={"ui form " + formClass}>
                    <DocumentTitle title='Map'>
                        <Map style={mapStyle} center={centerPosition} zoom={15}>
                            <TileLayer
                                url='http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
                                attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a'
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
        actions: bindActionCreators({ ...buildingActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
export { MapView as MapViewNotConnected };
