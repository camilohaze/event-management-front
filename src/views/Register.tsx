import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { Grid } from "@mui/material";

import { register } from "src/actions/register";
import { RequestRegister } from "src/interfaces/register";
import RegisterForm from "src/components/RegisterForm";

type RegisterProps = {
  register?: boolean;
  actions: any;
};

type RegisterState = {
  register: boolean;
};

class Register extends Component<RegisterProps, RegisterState> {
  state: RegisterState = {
    register: false,
  };

  constructor(props: RegisterProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount(): void {
    // code here!
  }

  async onSubmit(user: RequestRegister): Promise<void> {
    const { actions } = this.props;

    return await actions.register(user);
  }

  render(): ReactNode {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={4} />
          <Grid item xs={12} sm={6} md={4}>
            <RegisterForm onSubmit={this.onSubmit} />
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state: RegisterState) => {
  const { register } = state;

  return Object.assign({}, register);
};
const actions = {
  register,
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
