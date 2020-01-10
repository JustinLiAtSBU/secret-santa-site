import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { TextInput, Button, Icon, Navbar, NavItem, SideNav, SideNavItem, Modal, Table } from 'react-materialize';
import { deleteSecretSantaList, saveSecretSantaList } from '../../store/database/asynchHandler';
import Member from './Member';
import ListTableField from './ListTableField'

/**
 * Props:
 *  secretSantaList => 'name', 'description', 'participants', 'userID', 'list'
 */
class EditScreen extends Component {

    state = {
        name: this.props.secretSantaList['name'],
        description: this.props.secretSantaList['description'],
        participants: this.props.secretSantaList['participants'],
        userID: this.props.secretSantaList['userID'],
        list: this.props.secretSantaList['list']
    }

    /**
     * These functions are for the actual secret santa list.
     */
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

    /**
     * These functions are for editing members.
     */
    handleAddPerson = () => {
        let newName = document.getElementById('secret-santa-add-name').value
        let newEmail = document.getElementById('secret-santa-add-email').value
        let newWish = document.getElementById('secret-santa-add-wish').value
        let errorMsg = document.getElementById('add-error-msg')
        if (newName == '' || newEmail == '' || newWish == '') {
            errorMsg.innerHTML = "Fields must be filled in"
            errorMsg.style.display = 'block'
        } else {
            let oldParticipants = this.state.participants
            let newEntry = {'name': newName, 'email': newEmail, 'wish': newWish}
            oldParticipants.push(newEntry)
            this.setState({ participants: oldParticipants })
            document.getElementById('secret-santa-add-name').value = ''
            document.getElementById('secret-santa-add-email').value = ''
            document.getElementById('secret-santa-add-wish').value = ''
            this.props.history.push('/list/' + this.props.id)
        }
    }

    handleMemberEdit = (name, email, wish, ogEmail, ogName, ogWish) => {
        let newParticipants = this.state.participants
        let editedMember = {'name': name, 'email': email, 'wish': wish}
        for (var key in newParticipants) {
            if (newParticipants[key]['email'] == ogEmail && newParticipants[key]['name'] == ogName) {  
                newParticipants.splice(key, 1, editedMember)
                break;
            }
        }
        this.setState({ participants: newParticipants })
        console.log(this.state)  
    } 

    handleRemoveMember= (e, id) => {
        e.stopPropagation()
        let newParticipants = this.state.participants
        for (var key in newParticipants) {
            if (newParticipants[key]['email'] == id) {    
                newParticipants.splice(key, 1)
                break;
            }
        }
        this.setState({ participants: newParticipants })
    }

    generateRandom = () => {
        let participants = this.state.participants
        let newList = []                // For the list in secretSantaList database
        let namesDidntGetChosen = []    // For names that didn't get picked as giftees
        let namesWhoDidntGo = []        // For names who didn't get picked as gifters
        let data = {}                   // For mapping name|email to their wish

        for (var key in participants) {
            data[participants[key]['name'] + '|' + participants[key]['email']] = participants[key]['wish']
            namesDidntGetChosen.push(participants[key]['name'] + '|' + participants[key]['email'])
            namesWhoDidntGo.push(participants[key]['name'] + '|' + participants[key]['email'])
        }

        let count = 0;
        // Start pairing gifters with giftees until 2 people are left
        while (count != Object.keys(data).length - 2) {    
            let namesDidntGetChosenSize = namesDidntGetChosen.length
            let secretSantaName = namesWhoDidntGo[0]      // Get first name in list of keys in data
            let sameName = true                             // Bool to keep track of if the same name was picked
            let randInt = Math.floor(Math.random() * namesDidntGetChosenSize)  // Get random integer between 0 and namesDidntGetChosenSize
            let receivingName = namesDidntGetChosen[randInt]
            // If the names are the same, get new receiver
            while (sameName) {
                if (!(receivingName == secretSantaName)) {    // If names are not equal, continue
                    sameName = false
                    break;
                } else {                                      // get new random giftee
                    randInt = Math.floor(Math.random() * namesDidntGetChosenSize)
                    receivingName = namesDidntGetChosen[randInt]
                }
            }
            namesDidntGetChosen.splice(randInt, 1) // Remove giftee from namesDidntGetChose
            namesWhoDidntGo.splice(0, 1)           // Remove gifter from namesWhoDidntGo
            // Create dom elements to append
            let receiverWish = data[receivingName]          // Wish of the giftee
            let newEntry = {'gifter': secretSantaName, 'giftee': receivingName, 'wish': receiverWish}
            newList.push(newEntry)
            count++
        }

        // This part is to pair up the last two gifters and giftees
        let firstSecretSanta = namesWhoDidntGo[0]
        let secondSecretSanta = namesWhoDidntGo[1]
        let firstSecretSantaGiftee = namesDidntGetChosen[0]
        let secondSecretSantaGiftee = namesDidntGetChosen[1]
        if (firstSecretSanta == firstSecretSantaGiftee || secondSecretSanta == secondSecretSantaGiftee) {
            let temp = firstSecretSantaGiftee
            firstSecretSantaGiftee = secondSecretSantaGiftee
            secondSecretSantaGiftee = temp
        }
        // Add first
        let receiverWish = data[firstSecretSantaGiftee]
        newList.push({'gifter': firstSecretSanta, 'giftee': firstSecretSantaGiftee, 'wish': receiverWish})
        // Add second
        receiverWish = data[secondSecretSantaGiftee]
        newList.push({'gifter': secondSecretSanta, 'giftee': secondSecretSantaGiftee, 'wish': receiverWish})
        this.setState({ list: newList })         // Set state of list to the newly created list
    }

    goHome = () => {
        this.props.history.push('/')
    }

    render() {
        const { auth, users, secretSantaList, id } = this.props
        const { participants, list } = this.state
        var theOne = 0;
        for (var user in users) {
            if (users[user]["id"] == auth.uid) {
                theOne = users[user];
                break;
            }
        }
        let userEmail = theOne["email"];
        let userName = theOne["firstName"] + " " + theOne["lastName"]

        console.log(this.state)
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
                    
                    <div>
                        <div style={{ float: 'left', width: '50vw', fontWeight:"bold", fontFamily: "CourierPrimeRegular" }}>
                            {participants && participants.map(member => {
                                let memberCardID = 'card-' + member['email']
                                return(
                                    <Member 
                                        id={memberCardID} 
                                        handleMemberEdit={this.handleMemberEdit} 
                                        handleRemoveMember={this.handleRemoveMember}
                                        member={member}
                                    />
                                )
                            })}
                        </div>
                        <div style={{ float: 'right', width: '45vw', fontWeight:"bold", fontFamily: "CourierPrimeRegular", fontSize: '25px' }}>
                            Secret Santa List
                            <div style={{ fontWeight:"bold", fontFamily: "CourierPrimeRegular", fontSize: '15px' }}>
                                <Table>
                                    <thead>
                                        <tr>
                                        <th data-field="gifter">
                                            Gifter
                                        </th>
                                        <th data-field="giftee">
                                            Giftee
                                        </th>
                                        <th data-field="wish">
                                            Wish
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list && list.map(listItem => {
                                            return (
                                                <ListTableField
                                                    gifter={listItem['gifter']}
                                                    giftee={listItem['giftee']}
                                                    wish={listItem['wish']}
                                                />
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                <Button onClick={this.generateRandom} waves='light' flat large node='button'>Generate</Button>

                            </div>
                        </div>
                    </div>

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
                            <TextInput label='Wish' id='secret-santa-add-wish'/>
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