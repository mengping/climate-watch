import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EmissionsMetaProvider from 'providers/ghg-emissions-meta-provider';
import EmissionsProvider from 'providers/emissions-provider';
import RegionsProvider from 'providers/regions-provider';
import WorldBankDataProvider from 'providers/wb-country-data-provider';
import ButtonGroup from 'components/button-group';
import MultiDropdown from 'components/multi-dropdown';
import { Chart, Multiselect, Dropdown } from 'cw-components';
import ReactTooltip from 'react-tooltip';
import ModalMetadata from 'components/modal-metadata';
import { TabletPortraitOnly, TabletLandscape } from 'components/responsive';
import { toPlural } from 'utils/ghg-emissions';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';
import { ALL_SELECTED_OPTION, NO_ALL_SELECTED_COLUMNS } from 'data/constants';
import lineIcon from 'assets/icons/line_chart.svg';
import areaIcon from 'assets/icons/area_chart.svg';
import percentageIcon from 'assets/icons/icon-percentage-chart.svg';
import styles from './ghg-emissions-styles.scss';

const getValues = value => (value && (isArray(value) ? value : [value])) || [];
const addAllSelected = (filterOptions, f) => {
  const noAllSelected = NO_ALL_SELECTED_COLUMNS.includes(f);
  if (noAllSelected) return filterOptions && filterOptions[f];
  return (
    (filterOptions &&
    filterOptions[f] && [ALL_SELECTED_OPTION, ...filterOptions[f]]) ||
    []
  );
};

class GhgEmissions extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  renderDropdown(label, field, icons) {
    const {
      selected: selectedOptions,
      options,
      handleChange,
      chartTypeDisabled
    } = this.props;
    const value = selectedOptions && selectedOptions[`${field}Selected`];
    const iconsProp = icons ? { icons } : {};
    return (
      <Dropdown
        key={field}
        info={field === 'chartType'}
        infoText="Stacked and percentage charts are only available if the selected regions do not have countries in common"
        label={label || startCase(field)}
        placeholder={`Filter by ${startCase(field)}`}
        options={addAllSelected(options, field)}
        onValueChange={selected => handleChange(field, selected)}
        value={value || null}
        hideResetButton
        disabled={field === 'chartType' && chartTypeDisabled}
        {...iconsProp}
      />
    );
  }

  render() {
    const {
      data,
      domain,
      config,
      groups,
      handleInfoClick,
      handleChange,
      providerFilters,
      loading,
      downloadLink,
      options,
      selected: selectedOptions,
      legendOptions,
      legendSelected,
      fieldToBreakBy,
      hideRemoveOptions
    } = this.props;
    const { chartTypeSelected } = selectedOptions;
    const renderButtonGroup = () => (
      <ButtonGroup
        className={styles.colEnd}
        buttonsConfig={[
          {
            type: 'info',
            onClick: handleInfoClick
          },
          {
            type: 'share',
            shareUrl: '/embed/ghg-emissions',
            analyticsGraphName: 'Ghg-emissions',
            positionRight: true
          },
          {
            type: 'download',
            section: 'ghg-emissions',
            link: downloadLink
          },
          {
            type: 'addToUser'
          }
        ]}
      />
    );
    const icons = {
      line: lineIcon,
      area: areaIcon,
      percentage: percentageIcon
    };
    return (
      <div>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Global Historical Emissions</h2>
          <TabletLandscape>
            <div className={styles.buttonGroup}>{renderButtonGroup()}</div>
          </TabletLandscape>
        </div>
        <WorldBankDataProvider />
        <RegionsProvider />
        <EmissionsMetaProvider />
        <EmissionsProvider filters={providerFilters} />
        <div className={styles.col4}>
          {this.renderDropdown('Source', 'sources')}
          <Multiselect
            label={'Regions'}
            groups={groups}
            options={options.regions || []}
            values={getValues(selectedOptions.regionsSelected)}
            onValueChange={selected => handleChange('regions', selected)}
          />
          <MultiDropdown
            label="Sectors / Subsectors"
            theme={{ wrapper: styles.dropdown }}
            options={addAllSelected(options, 'sectors')}
            values={selectedOptions.sectorsSelected || []}
            onChange={selected => handleChange('sectors', selected)}
            multiselect
          />
          <Multiselect
            label={'Gases'}
            options={addAllSelected(options, 'gases')}
            values={getValues(selectedOptions.gasesSelected)}
            onValueChange={selected => handleChange('gases', selected)}
          />
          {this.renderDropdown('Break by', 'breakBy')}
          {this.renderDropdown(null, 'chartType', icons)}
        </div>
        <Chart
          className={styles.chartWrapper}
          type={chartTypeSelected && chartTypeSelected.value}
          theme={{ legend: styles.legend }}
          config={config}
          data={data}
          domain={domain}
          dataOptions={legendOptions}
          dataSelected={legendSelected || []}
          height={500}
          loading={loading}
          lineType="linear"
          showUnit
          onLegendChange={v => handleChange(toPlural(fieldToBreakBy), v)}
          hideRemoveOptions={hideRemoveOptions}
        />
        <TabletPortraitOnly>
          <div className={styles.buttonGroup}>{renderButtonGroup(true)}</div>
        </TabletPortraitOnly>
        <ModalMetadata />
        <ReactTooltip />
      </div>
    );
  }
}

GhgEmissions.propTypes = {
  data: PropTypes.array,
  domain: PropTypes.object,
  config: PropTypes.object,
  options: PropTypes.object,
  selected: PropTypes.object,
  fieldToBreakBy: PropTypes.string,
  legendOptions: PropTypes.array,
  legendSelected: PropTypes.array,
  groups: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
  handleInfoClick: PropTypes.func.isRequired,
  providerFilters: PropTypes.object,
  loading: PropTypes.bool,
  activeFilterRegion: PropTypes.object,
  downloadLink: PropTypes.string,
  chartTypeDisabled: PropTypes.bool,
  hideRemoveOptions: PropTypes.bool
};

export default GhgEmissions;
