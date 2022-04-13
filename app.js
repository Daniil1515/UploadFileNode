import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
  apiKey: "AIzaSyB3eqmVympmSb_Hd-n7E0R6EXBKh7iD7N8",
  authDomain: "uploadnode-57961.firebaseapp.com",
  projectId: "uploadnode-57961",
  storageBucket: "uploadnode-57961.appspot.com",
  messagingSenderId: "1037594449318",
  appId: "1:1037594449318:web:4385f77e1bbcebc2c72b67"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download URL', url)
        })
      })
    })
  }
})