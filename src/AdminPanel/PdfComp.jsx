import React, { useState } from 'react';
import PDF from 'react-pdf-js';
import './PdfComponent.css'; // Import your CSS

const PdfComp = ({ url }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-viewer-container">
      <h1 className="pdf-viewer-title">Resume Pdf</h1>
      
      <div className="pdf-controls">
        <button 
          onClick={() => setPageNumber(pageNumber - 1)} 
          disabled={pageNumber <= 1} 
          className="pdf-button"
        >
          Previous
        </button>
        <span className="pdf-page-info">
          Page {pageNumber} of {numPages}
        </span>
        <button 
          onClick={() => setPageNumber(pageNumber + 1)} 
          disabled={pageNumber >= numPages} 
          className="pdf-button"
        >
          Next
        </button>
      </div>

      <div className="pdf-canvas-wrapper">
        <PDF
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          page={pageNumber}
          // Set scale to make it fit
          scale={1.5} // Adjust scale as needed
        />
      </div>
    </div>
  );
};

export default PdfComp;
