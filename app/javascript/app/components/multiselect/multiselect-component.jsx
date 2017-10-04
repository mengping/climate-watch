import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { ReactSelectize, MultiSelect } from 'react-selectize'; // eslint-disable-line
import Icon from 'components/icon';
import { themr } from 'react-css-themr';
import cx from 'classnames';

import dropdownArrow from 'assets/icons/dropdown-arrow.svg';
import theme from 'styles/themes/dropdown/react-selectize.scss';
import styles from './multiselect-styles.scss';

class Multiselect extends Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      values,
      selectedClassName,
      placeholderText,
      handleChange,
      filterOptions,
      label
    } = this.props;
    return (
      <div className={styles.multiSelectWrapper}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={cx(theme.dropdown, styles.multiSelect)}>
          <div className={styles.values}>
            {placeholderText && !values.length ? (
              placeholderText
            ) : (
              `${values.length} selected`
            )}
          </div>
          <MultiSelect
            filterOptions={filterOptions}
            renderValue={value =>
              (values.length > 1 ? <span /> : <span>{value}</span>)}
            renderOption={option => {
              const className = option.isSelected ? selectedClassName : '';
              return (
                <div className={className}>
                  {option.label}
                  {option.isSelected && <span className={styles.checked} />}
                </div>
              );
            }}
            onValuesChange={handleChange}
            renderToggleButton={({ open }) => (
              <Icon
                className={open ? styles.isOpen : ''}
                icon={dropdownArrow}
              />
            )}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}

Multiselect.propTypes = {
  values: Proptypes.array.isRequired,
  selectedClassName: Proptypes.string,
  onMultiValueChange: Proptypes.func,
  placeholderText: Proptypes.string,
  filterOptions: Proptypes.func,
  handleChange: Proptypes.func,
  label: Proptypes.string
};

Multiselect.defaultProps = {
  selectedClassName: styles.selected
};

export default themr('MultiSelect', styles)(Multiselect);
