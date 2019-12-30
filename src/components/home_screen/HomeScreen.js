import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Tab, Tabs, Icon, Navbar, NavItem, SideNav, SideNavItem, ReactTabs, TabList, Modal } from 'react-materialize';
import { firestoreConnect } from 'react-redux-firebase';
import { logoutHandler, createSecretSantaList } from '../../store/database/asynchHandler';
import SecretSantaList from './SecretSantaList';

class HomeScreen extends Component {

    handleLogout = () => {
        this.props.logOut(this.props.firebase)
    }

    handleCreateSecretSanta = (e, userID) => {
        let name = document.getElementById('secret-santa-name-input').value
        let desc = document.getElementById('secret-santa-description-input').value
        let errorMsg = document.getElementById('create-error-msg')
        if (name == '' || desc == '') {
            errorMsg.innerHTML = "Fields must be filled in"
            errorMsg.style.display = 'block'
        } else {
            errorMsg.style.display = 'none'
            this.props.createSecretSantaList(name, desc, userID)
            this.props.history.push('/')
        }
    }

    render() {
        const { auth, secretSantaLists, users } = this.props;
        if (!auth.uid) {
            return <Redirect to="/login" />;
        }

        var theOne = 0;
        for (var user in users) {
            if (users[user]["id"] == auth.uid) {
                theOne = users[user];
                break;
            }
        }
        let userEmail = theOne["email"];
        let userName = theOne["firstName"] + " " + theOne["lastName"]
        let userLists = []
        for (var key in secretSantaLists) {
            if (secretSantaLists[key]["userID"] == theOne.id) {
                userLists.push(secretSantaLists[key])
            }
        }
        return (
            <div>
                <Navbar
                    alignLinks="right"
                    brand={<a style={{color: "#006622", fontWeight:"bold", fontFamily: "CourierPrimeRegular", fontSize: '30px'}} className="brand-logo" href="#">Secret Santa Generator</a>}
                    menuIcon={<Icon>menu</Icon>}
                    options={{ draggable: true, edge: 'left', inDuration: 250, onCloseEnd: null, onCloseStart: null, onOpenEnd: null, onOpenStart: null, outDuration: 200, preventScrolling: true }}
                    >
                    <NavItem>
                        <SideNav options={{ closeOnClick: true }}
                            trigger={<Button style={{background:"#006622"}} node="button"><Icon>account_circle</Icon></Button>}
                        >
                            <SideNavItem 
                                user={{
                                    background: 'https://placeimg.com/640/480/tech',
                                    email: userEmail,
                                    name: userName
                                }}
                                userView
                            />
                            <Modal
                                actions={[<Button flat modal="close" node="button" waves="green">Close</Button>]}
                                bottomSheet={false}
                                fixedFooter={false}
                                header="Create Secret Santa Generator"
                                id="create-modal"
                                options={{
                                    dismissible: true,
                                    endingTop: '10%',
                                    inDuration: 250,
                                    onCloseEnd: null,
                                    onCloseStart: null,
                                    onOpenEnd: null,
                                    onOpenStart: null,
                                    opacity: 0.5,
                                    outDuration: 250,
                                    preventScrolling: true,
                                    startingTop: '4%'
                                }}
                                trigger={<SideNavItem>Create Secret Santa Generator<Icon>mode_edit</Icon></SideNavItem>}
                                >
                                <div className='input-field' >
                                    <label htmlFor='text'>Name</label>
                                    <input className='active' type='text' id='secret-santa-name-input' />     
                                </div>
                                <div className='input-field'>
                                    <label htmlFor='text'>Description</label>
                                    <input className='active' type='text' id='secret-santa-description-input' />   
                                </div>
                                <p style={{ color: 'red', display: 'none'}}  id='create-error-msg'>Error</p>
                                <Button modal='close' onClick={(e) => this.handleCreateSecretSanta(e, theOne.id)} id="create-submit-button" flat type='submit'>Create</Button>
                            </Modal>
                            <SideNavItem onClick={this.handleLogout}>Logout<Icon>exit_to_app</Icon></SideNavItem>
                        </SideNav>
                    </NavItem>
                </Navbar>

                <SecretSantaList secretSantaLists={userLists} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        secretSantaLists: state.firestore.ordered.secretSantaLists,
        users: state.firestore.ordered.users
    };
};

const mapDispatchToProps = dispatch => ({
    logOut: firebase => dispatch(logoutHandler(firebase)),
    createSecretSantaList: (name, desc, userID) => dispatch(createSecretSantaList(name, desc, userID))
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'secretSantaLists'},
      { collection: 'users'}
    ]),
)(HomeScreen);