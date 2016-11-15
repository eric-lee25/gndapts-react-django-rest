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
            <div id="home-view-container" className="">
            <DocumentTitle title='Home'></DocumentTitle>
                <div className="ui vertical masthead center aligned segment">
                    <div id="masthead-content" className="ui middle aligned center aligned grid">
                        <h1 className="ui header">
                            Student Accomodation In The Spice Island
                        </h1>
                        <h3 id="masthead-text">
                            Tired of pouring through Facebook posts and stressful last minute searching? With GNDAPTS, you have access to the island's comprehensive resource for all available apartments and home. Whether you want beachside-living, affordable options, or close proximity to campus, find it all on GNDAPTS. Help out your colleagues, classmates, and friends by reviewing your living experience!<br/>
                            The key to renting in Grenada are now in your hands...
                        </h3>
                        <div id="cta" className="row">
                            <div className="eight column wide">
                                <div onClick={() => this.props.dispatch(push('/map'))} className={"ui massive green button"}>
                                    <i className="fa fa-map-marker" aria-hidden="true"></i> Map
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui vertical stripe segment">
                    <div className="ui middle aligned stackable grid container">
                        <div className="centered row">
                            <h1 className="ui huge header">SEARCH. RENT. REVIEW.</h1>
                        </div>
                        <div id="three-benefits" className="row">
                            <div className="third column">
                                <img className="ui centered medium circular image" src={require("./images/search.png")}/>
                                <h3 className="ui header centered">SEARCH FOR YOUR PERFECT HOME</h3>
                            </div>
                            <div className="third column">
                                <img className="ui centered medium circular image" src={require("./images/contact.png")}/>
                                <h3 className="ui header centered">CONTACT OWNERS DIRECTLY</h3>
                            </div>
                            <div className="third column">
                                <img className="ui centered medium circular image" src={require("./images/review.png")}/>
                                <h3 className="ui header centered">REVIEW YOUR STAY</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui vertical stripe segment">
                    <div className="ui middle aligned stackable grid container">
                        <div className="centered row">
                            <h1 className="ui huge header">STUDENT ACCOMODATION IN THE SPICE ISLAND</h1>
                        </div>
                        <div id="selling-points" className="centered row">
                            <h3 className="ui header">The keys to renting in Grenada are now in your hands. No more ________, no more hard to find listings.</h3>
                            <h3 className="ui header">With GNDAPTS, you now have access to the island’s comprehensive resource for available apartments and homes</h3>
                            <h3 className="ui header">Whether you want beachside-living, affordable accomodation, or proximity to campus, find it on GNDAPTS</h3>
                            <h3 className="ui header"> Help out your colleagues, classmates, and friends by reviewing your living experience!</h3>
                        </div>
                    </div>
                </div>
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
