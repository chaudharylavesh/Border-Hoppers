import PropTypes from 'prop-types';

const GameMapPropTypes = {
  geoJSONData: PropTypes.object,
  mapStyle: PropTypes.func.isRequired,
  onEachFeature: PropTypes.func.isRequired,
  colorScheme: PropTypes.object.isRequired,
};

export default GameMapPropTypes;
