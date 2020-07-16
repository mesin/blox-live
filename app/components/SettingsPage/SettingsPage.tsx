import React from 'react';
import { LeftMenuLayout } from '../../common/components';
import Header from '../common/Header';

import { General, Billing } from './components';
import Auth from '../Auth';

const auth = new Auth();

export const PAGES: Pages = [
  {
    name: 'General',
    path: '/settings/general',
    component: (props) => <General {...props} />,
  },
  {
    name: 'Billing',
    path: '/settings/billing',
    component: (props) => <Billing {...props} />,
  },
];

const SettingsPage = (props: Props) => (
  <>
    <Header withMenu={props.withMenu} />
    <LeftMenuLayout pages={PAGES} auth={auth} />
  </>
);

type Props = {
  withMenu: boolean;
};

type Pages = {
  name: string;
  path: string;
  component: any;
}[];

export default SettingsPage;
