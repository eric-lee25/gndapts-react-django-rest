import React from 'react';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './style.scss';


class MapView extends React.Component {

    static propTypes = {
        statusText: React.PropTypes.string
    };

    componentDidMount() {
    }

    componentDidUpdate() {
    }
    
    render() {
        const position = [12.0564936,-61.7345381];
        // parent div is 4em padding - in jj
        const s = {height: window.innerHeight-56}

        return (
            <div id="map-view-container">
                <DocumentTitle title='Map'>
                    <Map style={s} center={position} zoom={13}>
                        <TileLayer
                            url='http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
                            attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a'
                        />
                        <Marker position={position}>
                            <Popup>
                                <span>go lakers!!</span>
                            </Popup>
                        </Marker>
                    </Map>
                </DocumentTitle>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusText: state.auth.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default connect(mapStateToProps)(MapView);
export { MapView as MapViewNotConnected };
