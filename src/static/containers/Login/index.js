import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/auth';
import classNames from 'classnames';
import { push } from 'react-router-redux';
import './style.scss';

class LoginView extends React.Component {

    static propTypes = {
        dispatch: React.PropTypes.func.isRequired,
        isAuthenticated: React.PropTypes.bool.isRequired,
        isAuthenticating: React.PropTypes.bool.isRequired,
        statusText: React.PropTypes.string,
        actions: React.PropTypes.object.isRequired,
        location: React.PropTypes.object // this comes from react-router, not required
    };

    constructor(props) {
        super(props);

        const redirectRoute = this.props.location ? this.props.location.query.next || '/' : '/';
        this.state = {
            email: '',
            password: '',
            redirectTo: redirectRoute
        };
    }
    componentDidMount() {
        console.log(this.refs);
    }
    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push('/'));
        }

    }

    login = (e) => {
        e.preventDefault();
        this.props.actions.authLoginUser(this.state.email, this.state.password, this.state.redirectTo);
    };

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.currentTarget.value
        });
    };

    render() {
        let statusText = null;
        if (this.props.statusText) {
            const statusTextClassNames = classNames({
                alert: true,
                alert__error: this.props.statusText.indexOf('Authentication Error') === 0,
                alert__success: this.props.statusText.indexOf('Authentication Error') !== 0
            });

            statusText = (
                <div className="row">
                    <div className="small-12 columns">
                        <div className={statusTextClassNames}>
                            {this.props.statusText}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="ui middle aligned center aligned grid">
                <div className="column">
                    <h2 className="ui teal image header">
                        <img src="assets/images/logo.png" role="presentation" className="image"/>
                        <div className="content">
                            Log-in to your account
                        </div>
                    </h2>
                    <form className="ui large form" ref="loginForm">
                        <div className="ui stacked segment">
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon"></i>
                                    <input type="text"
                                        name="email"
                                        placeholder="E-mail address"
                                        onChange={(e) => { this.handleInputChange(e, 'email'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input type="text"
                                        name="password"
                                        placeholder="Password"
                                        onChange={(e) => { this.handleInputChange(e, 'password'); }}
                                    />
                                </div>
                            </div>
                            <div className="ui fluid large teal submit button">Login</div>
                        </div>

                        <div className="ui error message"></div>

                    </form>

                    <div className="ui message">
                        New to us? <a href="#">Sign Up</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
export { LoginView as LoginViewNotConnected };
