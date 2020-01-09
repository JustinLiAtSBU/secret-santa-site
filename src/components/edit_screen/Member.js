import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button, Icon, Row, Col, Card, CardItem, Modal, TextInput } from 'react-materialize';
import { firestoreConnect } from 'react-redux-firebase';

class Member extends Component {

    handleMemberEdit = (e) => {
        e.stopPropagation()
        let name = document.getElementById('edit-name-input' + this.props.member['email']).value
        let email = document.getElementById('edit-email-input' + this.props.member['email']).value
        this.props.handleMemberEdit(name, email, this.props.member['email'], this.props.member['name'])
    }

    render() {
        const { member } = this.props
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
                                    style= {{ cursor: 'pointer', background: '#ff8080' }}
                                    //className="blue-grey darken-1"
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
                        <TextInput label='Name' id={'edit-name-input' + member['email']}/>
                        <TextInput email label="Email" validate error='Invalid email' id={'edit-email-input' + member['email']}/>
                        <p style={{ color: 'red', display: 'none'}}  id='edit-error-msg'>Error</p>
                        <div>
                            <Button flat waves='light' modal='close' onClick={(e) => this.handleMemberEdit(e)} >Change</Button>
                            <Button flat waves='light' modal='close' onClick={(e) => this.props.handleRemoveMember(e, member['email'])} >delete</Button>
                        </div>
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