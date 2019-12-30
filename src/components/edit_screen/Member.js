import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Icon, Row, Col, Card, Modal } from 'react-materialize';
import { firestoreConnect } from 'react-redux-firebase';

class Member extends Component {

    handleClick = () => {
        window.alert(this.props.member['name'])
    }
    
    render() {
        // has () => this.props.handleMemberNameChange(member['email']) 
        const { member } = this.props
        const modalHeader = 'Remove ' + member['name'] + '?'
        return ( 
            <div id={this.props.id}>
                <Modal
                    actions={[
                        <Button flat modal="close" node="button" waves="green">Close</Button>
                    ]}
                    bottomSheet={false}
                    fixedFooter={false}
                    header="Modal Header"
                    id="modal-0"
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
                    trigger={<Button node="button">MODAL</Button>}
                    >
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    </p>
                </Modal>
                <Row>
                    <Col l={12} l={12}>
                        <Card
                            onClick={this.handleClick}
                            style= {{ cursor: 'pointer' }}
                            className="blue-grey darken-1"
                            closeIcon={<Icon>close</Icon>}
                            revealIcon={<Icon>more_vert</Icon>}
                            textClassName="white-text"
                            title={member['name']}
                        >
                            {member['email']}

                            <Modal
                                actions={[<Button flat modal="close" node="button" waves="green">Close</Button>]}
                                bottomSheet={false}
                                fixedFooter={false}
                                header={modalHeader}
                                id="remove-member-modal"
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
                                trigger={<Button flat style={{ float: 'right'}}>{<Icon>close</Icon>}</Button>}
                                >
                                <Button modal='close' onClick={(e) => this.props.handleRemoveMember(e, member['email'])}>Confirm</Button>  
                            </Modal>
                        </Card>
                    </Col>
                </Row>
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