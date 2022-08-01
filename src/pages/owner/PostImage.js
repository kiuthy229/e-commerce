import React from 'react';
import axios from 'axios'
import { useState } from 'react';

const PostImage = () => {
    const [image, setImage] = useState(null);

    const handleClick = () => {

        axios.post('http://localhost:3001/upload', image)
        .then(res => {
          console.log('Axios response: ', res)
        })
        .catch((error) => {
            if (!error?.response) {
                console.log("No Server Response");
            } else if (error.response?.status === 404) {
                console.log("404 - Not Found");
            } else if (error?.code) {
                console.log("Code: " + error.code);
            } else {
                console.log("Unknown Error");
            }
        });
      }

      const handleFileInput = (e) => {
        console.log('handleFileInput working!')
        console.log(e.target.files[0]);
        const formData = new FormData(); 
        formData.append('pictures', e.target.files[0], e.target.files[0].name);
        setImage(formData);
      }

      return (
        <div>
          <h1>Image Upload Tutorial</h1>
          <button onClick={handleClick}>Upload!</button>
          <input type="file" onChange={handleFileInput}></input>
        </div>
      );
}
 
export default PostImage;