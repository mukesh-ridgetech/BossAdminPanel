import React from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Upload,
    Switch,
  } from "antd";

const DownloadPdf = ({url}) => {
  const pdfUrl = 'https://example.com/sample.pdf'; // Replace with your PDF URL

  return (
    <div>
      <a href={url} download="sample.pdf">
        <Button>Download PDF</Button>
      </a>
    </div>
  );
};

export default DownloadPdf;
