import React, { useState, useRef } from 'react';
import { Button, Input, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

const { TextArea } = Input;

const UploadstText: React.FC = () => {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const TextAreaRef = useRef<any>(null);
  const handleUpload = () => {
    setUploading(true);

    fetch('/api/text_add', {
      method: 'POST',
      body: JSON.stringify({ textValue: text }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.code === 0) {
          message.success(`添加在知识库成功!`);
        }

        setText(() => {
          return '';
        });

        setUploading(false);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        setTimeout(() => {
          TextAreaRef.current.resizableTextArea.textArea.value = '';
        }, 1000);
        setUploading(false);
      });
    // TextAreaRef.current.resizableTextArea.textArea.value = '';
  };
  return (
    <PageContainer>
      <TextArea
        rows={10}
        placeholder="maxLength is 900"
        maxLength={900}
        onChange={(v) => {
          setText(v.currentTarget.value);
        }}
        allowClear
        ref={TextAreaRef}
      />
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={text.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
        size="large"
      >
        {uploading ? '添加中...' : '添加'}
      </Button>
    </PageContainer>
  );
};

export default UploadstText;
