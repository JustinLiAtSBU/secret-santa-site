import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { logoutHandler } from '../../store/database/asynchHandler';

import { Collapsible, CollapsibleItem, Button, Tab, Tabs, Icon, Navbar, NavItem, SideNav, SideNavItem, ReactTabs, TabList, Modal } from 'react-materialize';

class SecretSantaList extends Component {
    render() {
        const { secretSantaLists } = this.props

        return (
            <div>
                <Collapsible accordion popout>
                    {secretSantaLists && secretSantaLists.map(list => {
                        return (
                            <CollapsibleItem
                                expanded={false}
                                header={list['name']}
                                node='div'
                                style={{fontFamily: "CourierPrimeRegular", fontSize: '15px'}}
                            >
                                <Link to={'/list/' + list.id} key={list.id}>
                                    {list['description']}
                                </Link>
                            </CollapsibleItem>
                        )
                    })}
                </Collapsible>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
    };
};

const mapDispatchToProps = dispatch => ({
    logOut: firebase => dispatch(logoutHandler(firebase))
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'users'}
    ]),
)(SecretSantaList);