import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _isUndefined from 'lodash/isUndefined';
import _isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import MultiSelect from 'components/multiselect';
import Dropdown from 'components/dropdown';
import styles from './steps-styles';

const Step3 = props => {
  const selectProps = (f, format) => {
    let value = f.selected;
    if (!value) {
      value = f.multi ? [] : {};
    }
    const disabled = _isUndefined(f.disabled) ? _isEmpty(f.data) : f.disabled;
    return {
      disabled,
      [format]: value,
      options: (f.data || []).map(d => ({
        ...d,
        label: d.label || '',
        key: `${d.label}-${Date.now()}`
      })),
      placeholder: f.placeholder || f.name,
      loading: f.loading
    };
  };

  const { spec, handleFilterSelect } = props;
  return (
    <li className={styles.step}>
      <h2 className={styles.stepTitle}>3/4 - Filter the data</h2>
      {spec && (
        <ul className={styles.selectsContainer}>
          {_map(spec, (f, i) => {
            if (!f.data) return null;
            return (
              <li key={f.name || i} className={styles.selectsItem}>
                {f.multi ? (
                  <MultiSelect
                    className={styles.dropDowns}
                    {...selectProps(f, 'values')}
                    label={upperFirst(f.name)}
                    onMultiValueChange={e =>
                      handleFilterSelect({
                        values: e,
                        type: f.name,
                        multi: f.multi
                      })}
                  />
                ) : (
                  <Dropdown
                    {...selectProps(f, 'value')}
                    className={styles.dropDowns}
                    label={upperFirst(f.label)}
                    onValueChange={e =>
                      handleFilterSelect({
                        ...e,
                        type: f.name
                      })}
                    hideResetButton
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

Step3.propTypes = {
  spec: PropTypes.object.isRequired,
  handleFilterSelect: PropTypes.func.isRequired
};

export default Step3;
