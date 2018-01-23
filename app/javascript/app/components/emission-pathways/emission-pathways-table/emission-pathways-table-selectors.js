import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { deburrUpper } from 'app/utils';
import remove from 'lodash/remove';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import { ESP_BLACKLIST, FILTERS_BY_CATEGORY } from 'data/constants';

const getCategory = state =>
  (state.category && state.category.toLowerCase()) || null;
const getData = state => state.categoryData || null;
const getQuery = state => deburrUpper(state.query) || '';
const getSearch = state => state.search || null;

export const getDefaultColumns = createSelector([getCategory], category => {
  switch (category) {
    case 'models':
      return [
        'full_name',
        'developed_by',
        'geographic_coverage',
        'time_horizon',
        'url'
      ];
    case 'scenarios':
      return ['model', 'name', 'geographic_coverage_country'];
    case 'indicators':
      return ['category', 'subcategory', 'name'];
    default:
      return null;
  }
});

export const getFullTextColumns = createSelector([getCategory], category => {
  switch (category) {
    case 'models':
      return ['full_name', 'geographic_coverage'];
    case 'scenarios':
      return ['geographic_coverage_country'];
    case 'indicators':
      return [];
    default:
      return null;
  }
});

export const filteredDataBySearch = createSelector(
  [getData, getQuery],
  (data, query) => {
    if (!data || isEmpty(data)) return null;
    if (!query) return data;
    const updatedData = data;
    return updatedData.filter(d =>
      Object.keys(d).some(key => {
        if (Object.prototype.hasOwnProperty.call(d, key) && d[key] !== null) {
          return deburrUpper(d[key]).indexOf(query) > -1;
        }
        return false;
      })
    );
  }
);

export const titleLinks = createSelector(
  [getCategory, getData],
  (categoryName, data) => {
    if (!data || isEmpty(data) || !categoryName) return null;
    const linkInfo = {
      models: [
        { columnName: 'full_name', linkToId: true },
        { columnName: 'url' }
      ],
      scenarios: [{ columnName: 'name', linkToId: true }],
      indicators: []
    };
    const updatedData = data;
    return updatedData.map(d =>
      linkInfo[categoryName].map(l => ({
        columnName: l.columnName,
        url: l.linkToId ? `${categoryName}/${d.id}` : 'self'
      }))
    );
  }
);

const getSelectedFields = createSelector(
  [getSearch, getCategory],
  (search, category) => {
    if (!search) return null;
    let selectedFields = search;
    const selectedKeys = Object.keys(selectedFields).filter(k =>
      k.startsWith(category)
    );
    selectedFields = pick(selectedFields, selectedKeys);

    const fieldsWithoutPrefix = {};
    Object.keys(selectedFields).forEach(k => {
      const keyWithoutPrefix = k.replace(`${category}-`, '');
      fieldsWithoutPrefix[keyWithoutPrefix] = selectedFields[k];
    });
    return fieldsWithoutPrefix;
  }
);

export const getSelectedFieldOptions = createSelector(
  [getSelectedFields],
  fields => {
    if (!fields) return null;
    const fieldOptions = {};
    Object.keys(fields).forEach(key => {
      fieldOptions[key] = { value: fields[key], label: fields[key] };
    });
    return fieldOptions;
  }
);

export const filteredDataByFilters = createSelector(
  [filteredDataBySearch, getSelectedFields],
  (data, filters) => {
    if (!data) return null;
    if (!filters) return data;
    let filteredData = data;
    Object.keys(filters).forEach(key => {
      filteredData = filteredData.filter(
        d => d[key] && (d[key] === filters[key] || d[key].name === filters[key])
      );
    });
    return filteredData;
  }
);

export const getAvailableSubcategories = createSelector(
  [filteredDataBySearch, getSelectedFields],
  (data, filters) => {
    if (!data) return null;
    if (!filters || !filters.category) return [];
    const availableSubcategories = [];
    data.forEach(d => {
      if (d.category.name === filters.category) {
        availableSubcategories.push(d.subcategory.name);
      }
    });
    return uniq(availableSubcategories);
  }
);

export const getFilterOptionsByCategory = createSelector(
  [getCategory, getData, getAvailableSubcategories],
  (category, data, subcategories) => {
    if (!category || !data || isEmpty(data)) return null;
    const filters = FILTERS_BY_CATEGORY[category];
    const categoryOptions = {};
    filters.forEach(f => {
      const sanitizedFilterData = [];
      data.forEach(d => {
        if (d[f] !== null && d[f] !== '' && d[f] !== undefined) {
          const filterName = typeof d[f] === 'string' ? d[f] : d[f].name;
          sanitizedFilterData.push(filterName);
        }
      });
      let availableData = uniq(sanitizedFilterData);
      if (f === 'subcategory') {
        availableData = uniq(sanitizedFilterData).filter(
          d => subcategories.indexOf(d) > -1
        );
      }
      categoryOptions[f] = availableData.map(filterData => ({
        value: filterData,
        label: filterData
      }));
    });
    return categoryOptions;
  }
);

export const filterDataByBlackList = createSelector(
  [filteredDataByFilters, getCategory],
  (data, category) => {
    if (!data || isEmpty(data)) return null;
    const whiteList = remove(
      Object.keys(data[0]),
      n => ESP_BLACKLIST[category].indexOf(n) === -1
    );
    return data.map(d => pick(d, whiteList));
  }
);

export const renameDataColumns = createSelector(
  [filterDataByBlackList, getCategory],
  (data, category) => {
    if (!data || isEmpty(data)) return null;
    if (category === 'models') {
      let renamedData = data;
      const changes = [{ old: 'maintainer_name', new: 'developed_by' }];
      renamedData = renamedData.map(d => {
        const updatedD = d;
        changes.forEach(change => {
          if (d[change.old]) {
            updatedD[change.new] = d[change.old];
            delete updatedD[change.old];
          }
        });
        return updatedD;
      });
      return renamedData;
    }
    return data;
  }
);

export default {
  renameDataColumns,
  titleLinks,
  filteredDataByFilters,
  getFilterOptionsByCategory,
  getSelectedFieldOptions
};
