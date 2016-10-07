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
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import Dropzone from 'react-dropzone';


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
            photos: []
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
                this.state.title, this.state.description,
                this.state.marker.lat, this.state.marker.lng, this.state.photos,
                '/map');
        }
    }

    onDrop = (files) => {
        this.setState({ photos: files });
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isCreating
        });

        const photoPreviewClass = classNames({
            hidden: this.state.photos.length == 0
        });

        const center = [this.state.marker.lat, this.state.marker.lng];
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]

        let preview = (
            this.state.photos.map(function(s,i) {
                return (
                    <img key={i} className="ui tiny image" src={s.preview} />
                )
            })
        )

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
                                        url='https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'
                                        attribution='<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>'
                                    />
                                    <Marker 
                                        position={markerPosition}
                                        onDragend={this.updatePosition}
                                        draggable="true"
                                        icon={
                                            L.AwesomeMarkers.icon({
                                                prefix: 'fa',
                                                shadowSize: [0,0],
                                                icon: 'fa-home',
                                                markerColor: 'red'
                                            })
                                        }
                                        ref="marker"
                                        >
                                    </Marker>
                                </Map>
                            </div>
                            <div className="sixteen wide field">
                                <label>Upload building photos</label>
                                <Dropzone maxSize={10000000} accept={"image/jpeg,image/png,image/gif"} className="dropzone-style" onDrop={this.onDrop}>
                                    <div>Drag your photos into this box or click here.</div>
                                </Dropzone>
                            </div>
                            <div className={"sixteen wide field " + photoPreviewClass}>
                                <label>Photo preview</label>
                                <div className="ui tiny images">
                                    {preview}
                                </div>
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
