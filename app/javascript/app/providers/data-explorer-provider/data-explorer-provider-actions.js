import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { DATA_EXPLORER_SECTION_NAMES } from 'data/constants';
import isEmpty from 'lodash/isEmpty';

export const fetchDataExplorerInit = createAction('fetchDataExplorerInit');
export const fetchDataExplorerReady = createAction('fetchDataExplorerReady');
export const fetchDataExplorerFail = createAction('fetchDataExplorerFail');

export const fetchInitialMetadataInit = createAction(
  'fetchInitialMetadataInit'
);
export const fetchInitialMetadataReady = createAction(
  'fetchInitialMetadataReady'
);
export const fetchInitialMetadataFail = createAction(
  'fetchInitialMetadataFail'
);

export const fetchDataExplorer = createThunkAction(
  'fetchDataExplorer',
  section => (dispatch, state) => {
    const { dataExplorer } = state();
    if (
      dataExplorer &&
      (isEmpty(dataExplorer) ||
        (dataExplorer.data && !dataExplorer.data[section]) ||
        (dataExplorer.data &&
          (isEmpty(dataExplorer.data[section].data) && !dataExplorer.loading)))
    ) {
      dispatch(fetchDataExplorerInit());
      fetch(`/api/v1/data/${DATA_EXPLORER_SECTION_NAMES[section]}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw Error(response.statusText);
        })
        .then(data => {
          if (data) {
            dispatch(fetchDataExplorerReady({ data, section }));
          } else {
            dispatch(fetchDataExplorerReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchDataExplorerFail());
        });
    }
  }
);

export const fetchInitialMetadata = createThunkAction(
  'fetchInitialMetadata',
  () => dispatch => {
    dispatch(fetchInitialMetadataInit());
    const promises = [
      fetch('/api/v1/metadata').then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
    ];

    Promise.all(promises)
      .then(response => {
        const responseSections = ['section-metadata'];
        const metadata = {};
        responseSections.forEach((section, index) => {
          metadata[section] = response[index];
        });
        dispatch(fetchInitialMetadataReady({ metadata }));
      })
      .catch(error => {
        console.warn(error);
        dispatch(fetchInitialMetadataFail());
      });
  }
);

export default {
  fetchDataExplorer,
  fetchDataExplorerInit,
  fetchDataExplorerReady,
  fetchDataExplorerFail,
  fetchInitialMetadata,
  fetchInitialMetadataInit,
  fetchInitialMetadataReady,
  fetchInitialMetadataFail
};
