import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Icon, Row, Col, Card, Modal, TextInput } from 'react-materialize';
import { firestoreConnect } from 'react-redux-firebase';

class Member extends Component {

    handleMemberEdit = () => {
        let name = document.getElementById('edit-name-input').value
        let email = document.getElementById('edit-email-input').value
        this.props.handleMemberEdit(name, email, this.props.member['email'])
    }

    render() {
        const { member } = this.props
        const removeHeader = 'Remove ' + member['name'] + '?'
        const editHeader = 'Edit ' + member['name'] 
    
        return ( 
            <div id={this.props.id}>
                <Modal
                    actions={[<Button flat modal="close" node="button" waves="green">Close</Button>]}
                    bottomSheet={false}
                    fixedFooter={false}
                    header={editHeader}
                    id="edit-member-modal"
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
                    trigger={
                        <Row>
                            <Col l={12} l={12}>
                                <Card
                                    style= {{ cursor: 'pointer' }}
                                    className="blue-grey darken-1"
                                    closeIcon={<Icon>close</Icon>}
                                    revealIcon={<Icon>more_vert</Icon>}
                                    textClassName="white-text"
                                    title={member['name']}
                                >
                                    {member['email']}
                                </Card>
                            </Col>
                        </Row>
                    }
                    >
                        <TextInput defaultValue={member['name']} label='Name' id='edit-name-input'/>
                        <TextInput defaultValue={member['email']} email label="Email" validate error='Invalid email' id='edit-email-input'/>
                        <p style={{ color: 'red', display: 'none'}}  id='edit-error-msg'>Error</p>
                        <Button flat waves='light' modal='close' onClick={this.handleMemberEdit}>Change</Button>
                        <Button flat waves='light' modal='close' onClick={(e) => this.props.handleRemoveMember(e, member['email'])} style={{ float: 'right' }}>delete</Button>
                </Modal>
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
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'secretSantaLists'},
      { collection: 'users'}
    ]),
)(Member);