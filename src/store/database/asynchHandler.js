import * as actionCreators from '../actions/actionCreators.js'
import { getFirebase } from "react-redux-firebase";

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      console.log("LOGIN_SUCCESS");
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });
  };

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
        email: newUser.email
    })).then(() => {
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        dispatch(actionCreators.registerError);
    });
};

export const createSecretSantaList = (theName, theDesc, user) => {
  return(dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();
      const firebase = getFirebase();
      firestore.collection('secretSantaLists').add({
        name: theName,
        description: theDesc,
        participants: [],
        userID: user,
        list: []
      }).then(() => {
        dispatch({ type: 'CREATE_SECRET_SANTA_LIST_SUCCESS'});
      }).catch((err) => {
        dispatch({ type: 'CREATE_SECRET_SANTA_LIST_ERROR'})
      })
  }
}

export const deleteSecretSantaList = (id) => {
  return(dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();
      const firebase = getFirebase();
      firestore.collection('secretSantaLists').doc(id).delete()
      .then(() => {
        dispatch({ type: 'DELETE_SECRET_SANTA_LIST_SUCCESS'});
      }).catch((err) => {
        dispatch({ type: 'DELETE_SECRET_SANTA_LIST_ERROR'})
      })
  }
}

export const saveSecretSantaList = (id, state) => {
  return(dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();
      const firebase = getFirebase();
      firestore.collection('secretSantaLists').doc(id).update({
        ...state
      }).then(() => {
        dispatch({ type: 'SAVE_SECRET_SANTA_LIST_SUCCESS'});
      }).catch((err) => {
        dispatch({ type: 'SAVE_SECRET_SANTA_LIST_ERROR'})
      })
  }
}