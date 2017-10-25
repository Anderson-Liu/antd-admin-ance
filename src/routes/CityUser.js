import React from 'react';
import { connect } from 'dva';
import styles from './CityUser.css';

function CityUser() {
  return (
    <div className={styles.normal}>
      Route Component: CityUser
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(CityUser);
