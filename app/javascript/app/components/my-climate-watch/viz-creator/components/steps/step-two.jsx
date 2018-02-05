import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';

import SelectableList from '../selectable-list';
import CardContent from '../card-content';

import styles from './steps-styles';

const Step2 = ({ visualisations, selectVisualisation }) => (
  <li className={styles.step}>
    <h2 className={styles.stepTitle}>2/4 - Select what you want to compare</h2>
    {_map(visualisations.data, vs => [
      <h3 className={styles.stepSubTitle} key={vs.id}>
        {vs.name}
      </h3>,
      <SelectableList
        type="visualisation"
        data={vs.visualisations}
        selected={visualisations.selected}
        key={`v-${vs.id}`}
        onClick={selectVisualisation}
      >
        {d => (
          <CardContent
            placeholder={d.placeholder}
            image={d.image}
            type="visualisation"
          >
            <div className={styles.cardContent}>
              <h1 className={styles.cardTitle}>{d.name}</h1>
              <p className={styles.cardTags}>{d.tags.join(' | ')}</p>
            </div>
          </CardContent>
        )}
      </SelectableList>
    ])}
  </li>
);

Step2.propTypes = {
  visualisations: PropTypes.shape({
    data: PropTypes.array.isRequired,
    selected: PropTypes.string
  }).isRequired,
  selectVisualisation: PropTypes.func.isRequired
};

export default Step2;
