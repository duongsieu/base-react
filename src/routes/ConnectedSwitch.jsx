import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

const mapStateToProps = state => ({ location: state.router.location });

const ConnectedSwitch = connect(mapStateToProps)(Switch);

export default ConnectedSwitch;
