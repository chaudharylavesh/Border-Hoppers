import PropTypes from 'prop-types';

const RulesModalPropTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  colorScheme: PropTypes.object.isRequired,
};

export default RulesModalPropTypes;
