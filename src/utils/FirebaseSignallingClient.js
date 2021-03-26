import firebase from 'firebase/app'
import 'firebase/database'

export default class FirebaseSignallingClient {
  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyAaVe1DuNFoeBYxGSFg-yeCciFbxr8JdVA',
      authDomain: 'webrtc-react-firebase-by-fo-ji.firebaseapp.com',
      databaseURL:
        'https://webrtc-react-firebase-by-fo-ji-default-rtdb.firebaseio.com',
      projectId: 'webrtc-react-firebase-by-fo-ji',
      storageBucket: 'webrtc-react-firebase-by-fo-ji.appspot.com',
      messagingSenderId: '465722831732',
      appId: '1:465722831732:web:67dd13ff5fcbe5213a3221',
    }
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig)
    this.database = firebase.database()
    this.localPeerName = ''
    this.RemotePeerName = ''
  }
}