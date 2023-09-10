import React, { useEffect, useState } from 'react';
import { Button, Modal, Popconfirm, Space, Table } from 'antd';

const { Column } = Table;
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DataType {
  id: React.Key;
  type: string;
  user: string;
  q: string;
  a: string;
  create_at: string;
}

export default function Qalog() {
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [value, setValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState<DataType>();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);

    setConfirmLoading(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    // fetch('api/admin/qalog', {
    fetch('http://127.0.0.1:8000/api/admin/qalog', {
      method: 'get',

      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ results }) => {
        console.log(results);
        setTableData(results);
      });
  }, []);
  return (
    <div>
      <Table dataSource={tableData} bordered rowKey="id">
        <Column title="类型" dataIndex="type" key="type" align="center" width={10} />
        {/* <Column title="用户" dataIndex="user" key="user" align="center" /> */}
        <Column title="问题" dataIndex="q" key="q" align="center" />
        <Column title="回答" dataIndex="a" key="a" align="center" />
        <Column
          title="提问时间"
          dataIndex="create_at"
          key="create_at"
          render={(create_at: string) => <>{new Date(create_at).toLocaleString()}</>}
          width={10}
        />

        <Column
          title="操作"
          key="action"
          render={(row: any) => (
            <Space size="middle">
              <Button
                type="default"
                onClick={() => {
                  // setValue()
                  console.log(row);
                  setCurrentEditData(row);
                  setValue(row.a);
                  setIsModalOpen(true);
                }}
              >
                编辑回答
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title="修改回答"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        style={{
          height: '900px',
        }}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
      >
        <p>
          问题:
          <span
            style={{
              fontSize: '20px',
              marginLeft: '10px',
            }}
          >
            {currentEditData?.q}
          </span>
        </p>
        <p>原回答:</p>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          style={{
            height: '600px',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Popconfirm
            title="确认修改吗?"
            description="修改后将不可撤销"
            open={open}
            onConfirm={() => {
              setConfirmLoading(true);
              console.log(value);

              setTimeout(() => {
                // setOpen(false);
                setConfirmLoading(false);
              }, 2000);
            }}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={() => {
              console.log('Clicked cancel button');
              setOpen(false);
            }}
          >
            <Button
              style={{
                marginTop: '60px',
              }}
              type="primary"
              size="large"
              onClick={() => {
                setOpen(true);
              }}
            >
              修改
            </Button>
          </Popconfirm>
        </div>
      </Modal>
    </div>
  );
}
