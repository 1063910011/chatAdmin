import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PageContainer } from '@ant-design/pro-components';

const Uploads: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file as RcFile);
    });
    setUploading(true);

    fetch('/api/uploadfile', {
      // fetch('http://127.0.0.1:8000/api/uploadfile', {
      method: 'POST',
      body: formData,
      headers: {},
    })
      .then((res) => res.json())
      .then((response) => {
        console.log('response', response);
        if (response.code === 0) {
          message.success(`上传并添加在知识库成功!`);
        }
        setUploading(false);
      })
      .catch((error) => {
        console.log('error---', error);
        setFileList([]);
        setUploading(false);
      })
      .finally(() => {
        setFileList([]);
        setUploading(false);
      });

    // You can use any AJAX library you like
    // fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     setFileList([]);
    //     message.success('upload successfully.');
    //   })
    //   .catch(() => {
    //     message.error('upload failed.');
    //   })
    //   .finally(() => {
    //     setUploading(false);
    //   });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  return (
    <PageContainer>
      <div
        className=""
        style={{
          color: '#555',
          marginBottom: '20px',
        }}
      >
        (当前仅支持txt和pdf格式)
      </div>

      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading...' : 'Start Upload'}
      </Button>
    </PageContainer>
  );
};

export default Uploads;
