import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import { Map, Marker, Popup, TileLayer, setIconDefaultImagePath } from 'react-leaflet';
import DocumentTitle from 'react-document-title';
import './style.scss';
import redMarkerIcon from '../../images/marker-icons/marker-icon-red.png';
import * as buildingActionCreators from '../../actions/building';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';


class AddBuildingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            marker: {
                lat: 12.0000325,
                lng: -61.7738056
            },
            zoom: 15,
            title: null,
            description: null,
            leaseType: null
        };
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.createBuildingForm))
            .form({
                fields: {
                    title: {
                        identifier  : 'title',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a title'
                            },
                        ]
                    },
                    leaseType: {
                        identifier  : 'leaseType',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a lease type'
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
                    }
                },
                inline:true
            });
    }

    updatePosition = () => {
      const { lat, lng } = this.refs.marker.getLeafletElement().getLatLng()
      this.setState({
        marker: {lat, lng},
      })
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    updateZoom = (e) => {
        this.setState({zoom: e.target._zoom});
    }

    createBuilding = (e) => {
        $(ReactDOM.findDOMNode(this.refs.createBuildingForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.createBuildingForm)).form('is valid')) {
            this.props.actions.createBuilding(
                this.props.token,
                this.state.title, this.state.leaseType, this.state.description,
                this.state.marker.lat, this.state.marker.lng,
                '/map');
        }
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isCreating
        });

        const center = [this.state.marker.lat, this.state.marker.lng];
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]

        return (
            <div id="add-building-container">
                <DocumentTitle title='Add building'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Add building
                        </h2>
                        <form className="ui form" ref="createBuildingForm" >
                            <div className="six wide field">
                                <label>Title</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="title"
                                        onChange={(e) => { this.handleInputChange(e, 'title'); }}
                                    />
                                </div>
                            </div>
                            <div className="four wide field">
                                <label>Type of lease</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="leaseType"
                                        onChange={(e) => { this.handleInputChange(e, 'leaseType'); }}
                                    />
                                </div>
                            </div>
                            <div className="eight wide field">
                                <label>Description</label>
                                <textarea 
                                    name="description"
                                    rows="2"
                                    onChange={(e) => { this.handleInputChange(e, 'description')}}
                                ></textarea> 
                            </div>
                            
                            <div className="sixteen wide field">
                                <label>Location (drag the pin)</label>
                                <Map 
                                    OnZoomend={this.updateZoom}
                                    center={center} zoom={this.state.zoom}>
                                    <TileLayer
                                        url='http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
                                        attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a'
                                    />
                                    <Marker 
                                        position={markerPosition}
                                        onDragend={this.updatePosition}
                                        draggable="true"
                                        icon={
                                            L.icon({
                                                iconUrl: redMarkerIcon,
                                                iconSize: [25, 41],
                                                iconAnchor: [0,25]
                                            })
                                        }
                                        ref="marker"
                                        >
                                    </Marker>
                                </Map>
                            </div>


                            <div className={"ui green button " + buttonClass }
                                type="submit" onClick={this.createBuilding}
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
        isCreated: state.building.isCreated,
        isCreating: state.building.isCreating,
        statusText: state.building.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(buildingActionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBuildingView);
export { AddBuildingView as AddBuildingViewNotConnected };
