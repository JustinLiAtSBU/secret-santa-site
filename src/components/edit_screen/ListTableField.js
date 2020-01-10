import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button, Icon, Row, Col, Card, CardItem, Modal, TextInput } from 'react-materialize';
import { firestoreConnect } from 'react-redux-firebase';

class ListTableField extends Component {
    render() {
        const { gifter, giftee, wish } = this.props
        return ( 
                <tr>
                    <td>
                        {gifter}
                    </td>
                    <td>
                        {giftee}
                    </td>
                    <td>
                        {wish}
                    </td>
                </tr>
            
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
)(ListTableField);



