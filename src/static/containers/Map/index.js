import React from 'react';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';


class MapView extends React.Component {

    static propTypes = {
        statusText: React.PropTypes.string
    };

    componentDidMount() {
    }

    componentDidUpdate() {
    }
    
    render() {
        const position = [51.505, -0.09];

        return (
            <DocumentTitle title='Map'>
                <div>
                    <Map center={position} zoom={5} style={{height:400}}>
                        <TileLayer
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </Map>
                </div>
            </DocumentTitle>
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
