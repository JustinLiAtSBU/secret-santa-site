import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { TextInput, Collapsible, CollapsibleItem, Button, Tab, Tabs, Icon, Navbar, NavItem, SideNav, SideNavItem, ReactTabs, TabList, Modal } from 'react-materialize';
import { deleteSecretSantaList, saveSecretSantaList } from '../../store/database/asynchHandler'
import Member from './Member';

/**
 * Props:
 *  secretSantaList => 'name', 'description', 'participants', 'userID'
 */
class EditScreen extends Component {

    state = {
        name: this.props.secretSantaList['name'],
        description: this.props.secretSantaList['description'],
        participants: this.props.secretSantaList['participants'],
        userID: this.props.secretSantaList['userID']
    }

    // THIS IS FOR THE SECRET SANTA GENERATOR SCREEN FUNCTIONS
    handleDelete = (e, id) => {
        this.props.deleteSecretSantaList(id)
        this.props.history.push('/')
    }

    handleSave = (e, id) => {
        this.props.save(id, this.state)
        this.props.history.push('/list/' + this.props.id)
    }

    handleNameChange = () => {
        let newName = document.getElementById('secret-santa-name').value
        this.setState({ name: newName })
    }

    handleDescriptionChange = () => {
        let newDesc = document.getElementById('secret-santa-desc').value
        this.setState({ description: newDesc })
    }
    // THIS IS END OF SECRET SANTA GENERATOR SCREEN FUNCTIONS

    // For adding a new person
    handleAddPerson = () => {
        let newName = document.getElementById('secret-santa-add-name').value
        let newEmail = document.getElementById('secret-santa-add-email').value
        let errorMsg = document.getElementById('add-error-msg')
        if (newName == '' || newEmail == '') {
            errorMsg.innerHTML = "Fields must be filled in"
            errorMsg.style.display = 'block'
        } else {
            let oldParticipants = this.state.participants
            let newEntry = {'name': newName, 'email': newEmail}
            oldParticipants.push(newEntry)
            this.setState({ participants: oldParticipants })
            this.props.history.push('/list/' + this.props.id)
        }
    }

    handleMemberNameChange = (email) => {
        console.log('Handle member email change: ' + email)
    }

    // Is given an email to remove the member.
    handleRemoveMember= (e, id) => {
        e.stopPropagation()
        let newParticipants = this.state.participants
        for (var key in newParticipants) {
            if (newParticipants[key]['email'] == id) {    
                newParticipants.splice(key, 1)
            }
        }
        this.setState({ participants: newParticipants })
    }

    goHome = () => {
        this.props.history.push('/')
    }

    render() {
        const { auth, users, secretSantaList, id } = this.props
        const { participants } = this.state
        var theOne = 0;
        for (var user in users) {
            if (users[user]["id"] == auth.uid) {
                theOne = users[user];
                break;
            }
        }
        let userEmail = theOne["email"];
        let userName = theOne["firstName"] + " " + theOne["lastName"]
        return (
            <div style={{ position: 'relative' }}>
                <Navbar
                    alignLinks="right"
                    brand={<a href="#" onClick={this.goHome} style={{color: "#006622", fontWeight:"bold", fontFamily: "CourierPrimeRegular", fontSize: '30px'}} className="brand-logo" href="#">Secret Santa Generator</a>}
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
                            <SideNavItem onClick={this.handleLogout}>Logout<Icon>exit_to_app</Icon></SideNavItem>
                        </SideNav>
                    </NavItem>
                </Navbar>

                <div >
                    <div className='input-field' >
                        <label htmlFor='text'>Name</label>
                        <input onChange={this.handleNameChange} defaultValue={secretSantaList['name']} style= {{ fontFamily: 'CourierPrimeRegular'}} className='active' type='text' id='secret-santa-name' />     
                    </div>
                    <div className='input-field' >
                        <label htmlFor='text'>Description</label>
                        <input onChange={this.handleDescriptionChange} defaultValue={secretSantaList['description']} style= {{ fontFamily: 'CourierPrimeRegular'}} className='active' type='text' id='secret-santa-desc' />     
                    </div>

                    {participants && participants.map(member => {
                        let memberCardID = 'card-' + member['email']
                        return(
                            <Member 
                                id={memberCardID} 
                                handleMemberNameChange={this.handleMemberNameChange} 
                                handleRemoveMember={this.handleRemoveMember}
                                member={member}
                            />
                        )
                    })}

                    <div style={{ textAlign: 'center' }}>

                    <Modal
                        actions={[<Button flat modal="close" node="button" waves="green">Cancel</Button>]}
                            bottomSheet={false}
                            fixedFooter={false}
                            header="Details"
                            id='add-modal'
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
                            trigger={<Button flat node="button" waves="light" style={{ float: 'center', width: '98%' }}>
                            {<Icon>add_circle_outline</Icon>}
                        </Button>}
                        >
                        <TextInput label='Name' id='secret-santa-add-name'/>
                        <TextInput email label="Email" validate error='Invalid email' id='secret-santa-add-email'/>
                        <p style={{ color: 'red', display: 'none'}}  id='add-error-msg'>Error</p>
                        <Button modal='close' onClick={(e) => this.handleAddPerson(e, id)} id="add-button" flat type='submit'>Confirm</Button>
                    </Modal> 

                        
                    </div>
                </div>

                <Button className="red" fab={{direction: 'left'}} floating large node="button">
                    <Modal
                        actions={[<Button flat modal="close" node="button" waves="green">Cancel</Button>]}
                            bottomSheet={false}
                            fixedFooter={false}
                            header="Delete?"
                            id="delete-modal"
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
                            trigger={<Button
                                className="red"
                                floating
                                icon={<Icon>delete</Icon>}
                                node="button"
                            />}
                        >
                        <Button onClick={(e) => this.handleDelete(e, id)} id="delete-button" flat type='submit'>Confirm</Button>
                    </Modal>
                    <Modal
                        actions={[<Button flat modal="close" node="button" waves="green">Cancel</Button>]}
                            bottomSheet={false}
                            fixedFooter={false}
                            header="Save?"
                            id="save-modal"
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
                            trigger={<Button className="yellow darken-1" floating icon={<Icon>save</Icon>} node="button"/>}
                        >
                        <Button onClick={(e) => this.handleSave(e, id)} id="save-button" flat type='submit'>Confirm</Button>
                    </Modal>
                </Button>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const secretSantaLists = state.firestore.data.secretSantaLists;
    const secretSantaList = secretSantaLists ? secretSantaLists[id] : null
    return {
        id: id,
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
        secretSantaList: secretSantaList
    };
};

const mapDispatchToProps = dispatch => ({
    deleteSecretSantaList: (id) => dispatch(deleteSecretSantaList(id)),
    save: (id, state) => dispatch(saveSecretSantaList(id, state))
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'users'}
    ]),
)(EditScreen);