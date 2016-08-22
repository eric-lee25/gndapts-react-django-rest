import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import { Map, Marker, Popup, TileLayer, setIconDefaultImagePath } from 'react-leaflet';
import DocumentTitle from 'react-document-title';
import './style.scss';
import logoImage from './img/marker-icon-red.png';


class AddBuildingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            marker: {
                lat: 12.0000325,
                lng: -61.7738056
            },
            zoom: 15
        };
    }

    componentDidMount() {
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

    render() {
            const buttonClass = classNames({
                loading: this.props.isCreating || this.props.isAuthenticating
            });
            /*title = models.CharField(max_length=128)
    type_lease = models.CharField(max_length=64)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    photos = JSONField()
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)
    */
        const center = [this.state.marker.lat, this.state.marker.lng];
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]
        const s = logoImage.toString();

        return (
            <div id="add-building-container">
                <DocumentTitle title='Add building'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Add building
                        </h2>
                        <form className="ui form" ref="addBuildingForm" >
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
                                <textarea rows="2"></textarea> 
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
                                                iconUrl: logoImage,
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
                                type="submit" onClick={this.signup}
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

export default connect()(AddBuildingView);
export { AddBuildingView as AddBuildingViewNotConnected };
