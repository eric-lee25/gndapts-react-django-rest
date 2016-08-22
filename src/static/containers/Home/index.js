import React from 'react';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import './style.scss';
import { push } from 'react-router-redux';


class HomeView extends React.Component {

    static propTypes = {
        statusText: React.PropTypes.string
    };

    componentDidMount() {
    }

    componentDidUpdate() {
    }
    
    render() {
        return (
            <div id="home-view-container" className="ui container">
            <DocumentTitle title='Home'>
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                        <div onClick={() => this.props.dispatch(push('/map'))} className={"ui massive green button"}>
                            <i className="fa fa-map-marker" aria-hidden="true"></i> Map
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    i need copy for this page
                </div>
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

export default connect(mapStateToProps)(HomeView);
export { HomeView as HomeViewNotConnected };
