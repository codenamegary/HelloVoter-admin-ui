import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import filesize from 'filesize';

import Modal from '@material-ui/core/Modal';

import {
  faUser,
  faUsers,
  faMap,
  faClipboard,
  faChartPie,
  faMapMarkerAlt,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';

import { arrayMove } from 'react-sortable-hoc';

import {
  _fetch,
  notify_error,
  RootLoader,
  InviteSomeone,
} from '../../common.js';

import { Cards } from './Cards';

export default class App extends Component {
  constructor(props) {
    super(props);

    const dash = (localStorage.getItem('dash') || 'vol,turf,form,attributes,addr,dbsz').split(',');

    this.state = {
      global: props.global,
      loading: true,
      noAdmins: false,
      data: {},
      cards: [],
      dash,
    };
  }

  componentDidMount() {
    this._loadData();
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const dash = arrayMove(this.state.dash, oldIndex, newIndex);
    localStorage.setItem('dash', dash.map(n => n));
    this.setState(() => ({
      dash,
    }));
  }

  _loadData = async () => {
    const { global } = this.state;

    let data = {};
    let cards = [];

    this.setState({ loading: true });

    /*
    try {
      data = await _fetch(global, '/dashboard');

      if (data.admins === 0) this.setState({noAdmins: true});

      cards = {
        vol: {
          name: 'Ambassadors',
          stat: data.volunteers,
          icon: faUser,
        },
     };
    } catch (e) {
      notify_error(e, 'Unable to load dashboard info.');
    }
    */

    this.setState({ cards, data, loading: false });
  }

  render() {
    const { global, data, loading, noAdmins } = this.state;

    return (
      <RootLoader flag={loading} func={this._loadData}>
        {(data.version && data.version !== process.env.REACT_APP_VERSION)&&
        <h3 style={{color: "red"}}>WARNING: API version doesn't match HQ version.</h3>
        }
        <Cards
          state={this.state}
          axis="xy"
          onSortEnd={this.onSortEnd}
          cards={this.state.cards}
          dash={this.state.dash}
        />

        <InviteSomeone refer={this} />

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={noAdmins}
          onClose={() => this.setState({ noAdmins: false })}
        >
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: 200,
              right: 200,
              backgroundColor: 'white',
              padding: 40
            }}
          >
            Welcome! Looks like you're new here. By default, users have zero permissions
            when they sign in. To make yourself an admin and gain full access to the UI,
            run the follow command from the shell:
            <br />
            <br />
            <pre>npm run makeadmin -- {global.getUserProp("id")}</pre>
          </div>
        </Modal>
      </RootLoader>
    );
  }
}
