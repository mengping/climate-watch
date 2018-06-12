import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';
import { actions } from 'components/modal-download';

import Component from './download-menu-component';

const { S3_BUCKET_NAME } = process.env;

const server = `http://${S3_BUCKET_NAME}.s3.amazonaws.com`;
const folder = '/climate-watch-download-zip';
const url = `${server}${folder}`;

// The NDC quantification and pathway files should not be made public
// before the functionality and data are available on production site
// {
//   label: 'NDC quantification (367 kB)',
//   link: `${url}/ndc-quantification.zip`,
//   target: '_self'
// }

const mapStateToProps = ({ modalDownload }) => ({
  isOpen: modalDownload.isOpen
});

class DownloadMenuContainer extends PureComponent {
  handleOnClick = (downloadUrl, size) => {
    this.props.setModalDownloadParams({
      open: true,
      downloadUrl,
      size
    });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      downloadMenuOptions: [
        {
          label: 'All data (62 MB)',
          action: this.handleOnClick.bind(this, `${url}/all.zip`, '62 MB')
        },
        {
          label: 'NDC Content (6.4 MB)',
          action: this.handleOnClick.bind(
            this,
            `${url}/ndc-content.zip`,
            '6.4 MB'
          )
        },
        {
          label: 'NDC Targets (329 kB)',
          action: this.handleOnClick.bind(
            this,
            `${url}/NDC_quantification.zip`,
            '329 kB'
          )
        },
        {
          label: 'NDC Text in HTML (53 MB)',
          action: this.handleOnClick.bind(
            this,
            `${url}/NDC_text_HTML.zip`,
            '53 MB'
          )
        },
        {
          label: 'GHG emissions (3.5 MB)',
          action: this.handleOnClick.bind(
            this,
            `${url}/ghg-emissions.zip`,
            '3.5 MB'
          )
        },
        {
          label: 'Adaptation (357 kB)',
          action: this.handleOnClick.bind(
            this,
            `${url}/adaptation.zip`,
            '357 kB'
          )
        },
        {
          label: 'Socioeconomic (450 kB)',
          action: this.handleOnClick.bind(
            this,
            `${url}/socioeconomic-indicators.zip`,
            '450 kB'
          )
        },
        {
          label: 'Pathways (2.1 MB)',
          action: this.handleOnClick.bind(this, `${url}/pathways.zip`, '2.1 MB')
        }
      ]
    });
  }
}

DownloadMenuContainer.propTypes = {
  downloadMenuOptions: PropTypes.array,
  setModalDownloadParams: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(DownloadMenuContainer);
