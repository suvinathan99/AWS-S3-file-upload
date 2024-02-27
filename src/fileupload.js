import React, { useState } from 'react';
import AWS from 'aws-sdk';
import './fileupload.css'; // Import the CSS file

const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [selectedFileContent, setSelectedFileContent] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        const s3 = new AWS.S3({
            accessKeyId: '',
               secretAccessKey: '',
               region: '',
              });

        const folderName = ''; // Specify the folder name here
        const fileName = selectedFile.name;
        const key = `${folderName}/${fileName}`;

        const params = {
            Bucket: '',
            Key: key,
            Body: selectedFile,
        };

        try {
            await s3.upload(params).promise();
            const timestamp = new Date().toLocaleString();
            const fileFormat = fileName.split('.').pop();
            setFileList([...fileList, { name: fileName, timestamp, format: fileFormat }]);
            setSelectedFile(null);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again later.');
        }
    };

    const handleFileView = async (fileName) => {
        const s3 = new AWS.S3({
            accessKeyId: '',
               secretAccessKey: '',
               region: '',
              });

        const folderName = ''; // Specify the folder name here
        const key = `${folderName}/${fileName}`;

        const params = {
            Bucket: '',
            Key: key,
        };

        try {
            const response = await s3.getObject(params).promise(); // Fetch the S3 object

            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (['txt', 'jpg', 'jpeg', 'png', 'html', 'docx', 'pdf'].includes(fileExtension)) {
                if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                    // Image handling
                    const blob = new Blob([response.Body], { type: `image/${fileExtension}` });
                    const url = URL.createObjectURL(blob);
                    setSelectedFileContent(url);
                } else if (fileExtension === 'html') {
                    // HTML handling
                    const url = URL.createObjectURL(response.Body);
                    setSelectedFileContent(url);
                } else if (fileExtension === 'pdf') {
                    // PDF handling
                    const blob = new Blob([response.Body], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    setSelectedFileContent(url);
                } else if (fileExtension === 'docx') {
                    // DOCX handling
                    const blob = new Blob([response.Body], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                    const url = URL.createObjectURL(blob);
                    setSelectedFileContent(url);
                } else {
                    // Text file handling
                    const text = new TextDecoder().decode(response.Body);
                    setSelectedFileContent(text);
                }
            } else {
                // Unsupported file type
                setSelectedFileContent(`File type "${fileExtension}" is not supported for preview.`);
            }
        } catch (error) {
            console.error('Error fetching file:', error);
            alert('Error fetching file. Please try again later.');
        }
    };

    return (
        <div className="upload-container">
            <h2>File Upload to AWS S3</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            <h3>Uploaded Files:</h3>
            <ul>
                {fileList.map((file, index) => (
                    <li key={index}>
                        <span>{file.name} - {file.timestamp} - {file.format}</span>
                        <button className="view" onClick={() => handleFileView(file.name)}>View</button>
                    </li>
                ))}
            </ul>

            {selectedFileContent && (
                <div>
                    <h3>File Content:</h3>
                    {/* Displaying the file content */}
                    {selectedFileContent.includes('.png') || selectedFileContent.includes('.jpg') ? (
                        <img src={selectedFileContent} alt="Uploaded File" style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                        <iframe src={selectedFileContent} style={{ width: '100%', height: '500px' }}></iframe>
                    )}
                    <button className="close" onClick={() => setSelectedFileContent(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default UploadFile;
