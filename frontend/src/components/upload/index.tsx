import React from 'react';
import './upload.css';

const Upload = () => {
    return (
        <div className="upload-container">
            <h4>Select a Sample Model</h4>
            <button className="upload-button">Select Model</button>
            <div className="upload-box">
                <p>Drag & drop or choose your CSD file to upload here.</p>
                <small>*Accepted files: doc, pdf, xcl<br />*Maximum file size: 100MB</small>
            </div>
        </div>
    );
};

export default Upload;
