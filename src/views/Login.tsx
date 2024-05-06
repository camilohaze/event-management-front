import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { Grid } from "@mui/material";

import { login } from "src/actions/login";
import { RequestLogin } from "src/interfaces/login";
import LoginForm from "src/components/LoginForm";

type LoginProps = {
  login?: boolean;
  actions: any;
};

type LoginState = {
  login: boolean;
};

class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    login: false,
  };

  constructor(props: LoginProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount(): void {
    // code here!
  }

  async onSubmit(user: RequestLogin): Promise<void> {
    const { actions } = this.props;

    return await actions.login(user);
  }

  render(): ReactNode {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={4} />
          <Grid item xs={12} sm={6} md={4}>
            <LoginForm onSubmit={this.onSubmit} />
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state: LoginState) => {
  const { login } = state;

  return Object.assign({}, login);
};
const actions = {
  login,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
