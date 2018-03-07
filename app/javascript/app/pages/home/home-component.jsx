import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Intro from 'components/intro';
import Section from 'components/section';
import Icon from 'components/icon';
import Button from 'components/button';
import Dropdown from 'components/dropdown';
import AutocompleteSearch from 'components/autocomplete-search';
import Stories from 'components/stories';
import ReactPlayer from 'react-player';
import cx from 'classnames';
import GeoLocationProvider from 'providers/geolocation-provider';
import { MobileOnly, TabletLandscape } from 'components/responsive';

import cwLogo from 'assets/icons/cw-logo-white.svg';
import fullscreen from 'assets/icons/map-fullscreen.svg';
import background from 'assets/headers/home.jpg';
import countryBgScreenshot from 'assets/screenshots/country-bg-screenshot';
import countrySmScreenshot from 'assets/screenshots/country-sm-screenshot@2x';
import ndcBgScreenshot from 'assets/screenshots/ndc-explore-bg-screenshot';
import ndcSmScreenshot from 'assets/screenshots/ndc-explore-sm-screenshot@2x.png';
import ndcSdgBgScreenshot from 'assets/screenshots/ndc-sdg-bg-screenshot';
import ndcSdgSmScreenshot from 'assets/screenshots/ndc-sdg-sm-screenshot@2x.png';
import theme from 'styles/themes/dropdown/dropdown-links.scss';
import screenfull from 'screenfull';

import introDark from 'styles/themes/intro/intro-dark.scss';
import styles from './home-styles.scss';

class Home extends PureComponent {
  onClickFullscreen = () => {
    const playerNode = ReactDOM.findDOMNode(this.player); // eslint-disable-line react/no-find-dom-node
    screenfull.request(playerNode);
  };

  render() {
    const { geolocation, countriesOptions, handleDropDownChange } = this.props;
    return (
      <div className={styles.homeBg}>
        <Section
          className={cx(styles.section, styles.extraPadding)}
          backgroundImage={background}
        >
          <div className={cx(styles.column, styles.homeIntro)}>
            <Icon icon={cwLogo} className={styles.cwLogo} />
            <Intro description="Climate Watch offers open data, visualizations and analysis to help policymakers, researchers and other stakeholders gather insights on countries' climate progress." />
            <AutocompleteSearch />
          </div>
          <div className={cx(styles.column, styles.video)}>
            <TabletLandscape>
              <Button
                color="yellow"
                onClick={this.onClickFullscreen}
                className={styles.fullscreen}
                square
              >
                <Icon icon={fullscreen} />
              </Button>
            </TabletLandscape>
            <ReactPlayer
              width="100%"
              height="100%"
              ref={player => {
                this.player = player;
              }}
              url="https://youtu.be/C2nIcBqrHsk"
              controls
              youtubeConfig={{
                playerVars: {
                  playsinline: 0,
                  fs: 0 // remove full screen button
                },
                preload: true
              }}
            />
          </div>
        </Section>
        <div className={cx(styles.storiesLayout, styles.section)}>
          <Stories />
        </div>
        <Section className={cx(styles.section, styles.countries)}>
          <MobileOnly>
            {isMobile => (
              <div className={cx(styles.column, styles.invertOrder)}>
                <div className={styles.imgLayout}>
                  <div className="grid-column">
                    <img
                      className={isMobile ? '' : styles.imageTall}
                      src={isMobile ? countrySmScreenshot : countryBgScreenshot}
                      alt="Country section screenshot"
                    />
                  </div>
                </div>
              </div>
            )}
          </MobileOnly>
          <div className={styles.column}>
            <Intro
              theme={introDark}
              title="View Country Profiles"
              description="A snapshot of countries' climate action progress, risks and vulnerability. Navigate through historical and future emissions, climate vulnerabilities and readiness, identify sustainable development linkages and make comparisons between countries."
            />
            <GeoLocationProvider />
            <span
              className={cx(styles.geoLocation, {
                [styles.geoLocationHide]: !geolocation.country
              })}
            >
              Connected from {geolocation.country}?
            </span>
            <div className={cx(styles.doubleFold, styles.mobileDoubleAction)}>
              <Button
                color="yellow"
                link={`/countries/${geolocation.iso ? geolocation.iso : ''}`}
              >
                Explore your country
              </Button>
              <Dropdown
                className={theme.dropdownOptionWithArrow}
                placeholder="Select another country"
                options={countriesOptions}
                onValueChange={handleDropDownChange}
                plain
                hideResetButton
              />
            </div>
          </div>
        </Section>
        <Section
          className={cx(styles.section, styles.extraPadding, styles.ndcs)}
        >
          <div className={styles.column}>
            <Intro
              theme={introDark}
              title="Explore and Compare Nationally Determined Contributions"
              description="Analyze and compare national climate pledges under the Paris Agreement."
            />
            <div className={cx(styles.doubleFold, styles.mobileDoubleAction)}>
              <Button color="yellow" link="/ndcs">
                Explore NDC content
              </Button>
              <Button color="plain" link="/ndcs/compare">
                Compare NDCs
              </Button>
            </div>
          </div>
          <MobileOnly>
            {matches => (
              <div className={matches ? styles.ndcImageMobile : styles.column}>
                <img
                  className={matches ? '' : styles.imageRight}
                  src={matches ? ndcSmScreenshot : ndcBgScreenshot}
                  alt="Ndcs section screenshot"
                />
              </div>
            )}
          </MobileOnly>
        </Section>
        <Section
          className={cx(
            styles.section,
            styles.extraPadding,
            styles.sdgLinkages
          )}
        >
          <MobileOnly>
            {matches => (
              <div className={cx(styles.column, styles.invertOrder)}>
                <img
                  className={matches ? '' : styles.imageRight}
                  src={matches ? ndcSdgSmScreenshot : ndcSdgBgScreenshot}
                  alt="NDC SDGs screenshot"
                />
              </div>
            )}
          </MobileOnly>
          <div className={styles.column}>
            <Intro
              theme={introDark}
              title="Examine Links Between Sustainable Development and Climate Goals"
              description="Identify potential alignment between the targets, actions, policy measures and needs in countries’ Nationally Determined Contributions (NDCs) and the targets of the Sustainable Development Goals (SDGs)."
            />
            <div className={styles.doubleFold}>
              <Button color="yellow" link={'/ndcs-sdg'}>
                Explore NDC-SDG Linkages
              </Button>
            </div>
          </div>
        </Section>
      </div>
    );
  }
}

Home.propTypes = {
  geolocation: PropTypes.object,
  countriesOptions: PropTypes.array,
  handleDropDownChange: PropTypes.func
};

Home.defaultProps = {
  geolocation: {},
  countriesOptions: []
};

export default Home;
