import React, { ReactElement, useEffect } from 'react';

import Toaster from '../components/Toaster';
import http from '../service/request';

import PersistentDrawerRight from './drawer';

const Content = (): ReactElement => {
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
