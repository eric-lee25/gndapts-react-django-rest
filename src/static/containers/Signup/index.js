import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as accountActionCreators from '../../actions/account';
import * as authActionCreators from '../../actions/auth';
import { bindActionCreators } from 'redux';

class SignupView extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            'firstname': '',
            'lastname': '',
            'email': '',
            'password': ''
        }
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.signupForm)).form({
            fields: {
                firstname: {
                    identifier  : 'firstname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your firstname'
                        },
                    ]
                },
                lastname: {
                    identifier  : 'lastname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your lastname'
                        },
                    ]
                },
                email: {
                    identifier  : 'email',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your e-mail'
                        },
                        {
                            type   : 'email',
                            prompt : 'Please enter a valid e-mail'
                        }
                    ]
                },
                password: {
                    identifier  : 'password',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your password'
                        },
                        {
                            type   : 'length[6]',
                            prompt : 'Your password must be at least 6 characters'
                        }
                    ]
                }
            }
        });

        // To prevent the redirect on form submission
        $(ReactDOM.findDOMNode(this.refs.signupForm)).submit(function(e) {
            this.signup();
            return false;
        }.bind(this));
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    componentWillReceiveProps(nextProps) {
        // Once the account has been created, log the user in
        if (nextProps.isCreated && nextProps.isCreated == true) {
            this.props.actions.authLoginUser(this.state.email, this.state.password);
        }
    }

    signup = (e) => {
        $(ReactDOM.findDOMNode(this.refs.signupForm)).form('validate form');

        if ($(ReactDOM.findDOMNode(this.refs.signupForm)).form('is valid')) {
            this.props.actions.accountCreateUser(this.state.firstname, this.state.lastname, this.state.email, this.state.password);
        }
    }

    render() {
        return (
            <div className="ui middle aligned center aligned grid">
                <div className="column">
                    <h2 className="ui header">
                        Signup
                    </h2>
                    <form className="ui large form" ref="signupForm" >
                        <div className="ui stacked segment">
                            <div className="field">
                                <div className="ui big input">
                                    <input type="text"
                                        name="firstname"
                                        placeholder="First name"
                                        onChange={(e) => { this.handleInputChange(e, 'firstname'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui big input">
                                    <input type="text"
                                        name="lastname"
                                        placeholder="Last name"
                                        onChange={(e) => { this.handleInputChange(e, 'lastname'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui big input">
                                    <input type="text"
                                        name="email"
                                        placeholder="E-mail address"
                                        onChange={(e) => { this.handleInputChange(e, 'email'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui big input">
                                    <input type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={(e) => { this.handleInputChange(e, 'password'); }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"ui fluid large green submit button " + 'aa'}
                            type="submit" onClick={this.signup}
                        >
                            Create account
                        </div>

                        <div className="ui error message"></div>

                    </form>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        isCreating: state.account.isCreating,
        isCreated: state.account.isCreated,
        statusText: state.account.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...authActionCreators, ...accountActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupView);
export { SignupView as SignupViewNotConnected };
