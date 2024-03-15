import React, { ReactElement, useEffect } from 'react';

import Toaster from '../components/Toaster';
import http from '../service/request';

import PersistentDrawerRight from './drawer';

const Content = (): ReactElement => {
  // useEffect(() => {
  //   http.get('/api/share/trades', {
  //     trader: '123',
  //     subject: '123',
  //   });
  //   fetch('https://test-xfans-api.d.buidlerdao.xyz/api/share/trades')
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log(json);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 999,
        top: 0,
        right: 0,
      }}
    >
      <PersistentDrawerRight />
      <Toaster />
    </div>
  );
};

export default Content;
