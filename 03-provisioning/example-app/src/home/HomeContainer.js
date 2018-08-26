import HomeComponent from './HomeComponent';
import {actions} from './.duck';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  store: state.home,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: Object.keys(actions).reduce((e, operation) =>
    Object.assign({}, e, {
      [operation]: (...vals) => dispatch(actions[operation](...vals)),
    }), {}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeComponent);
