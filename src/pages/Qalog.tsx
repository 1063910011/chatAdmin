import React, { useEffect, useState } from 'react';
import { Button, Modal, Popconfirm, Space, Table, message, Input } from 'antd';

const { TextArea } = Input;
const { Column } = Table;
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DataType {
  id: React.Key;
  type: string;
  user: string;
  q: string;
  a: string;
  create_at: string;
}

const API_HOST_URL = process.env.API_HOST_URL;

export default function Qalog() {
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editContent, setEditContent] = useState<any>('');
  const [currentEditData, setCurrentEditData] = useState<DataType>();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleEditModalCancel = () => {
    setOpen(false);
    setEditContent('');
    setCurrentEditData({} as DataType);
    setConfirmLoading(false);
    setIsModalOpen(false);
  };
  const init = () => {
    // fetch('api/admin/qalog', {
    fetch(API_HOST_URL + 'api/admin/qalog', {
      method: 'get',

      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ results }) => {
        setTableData(results);
      });
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <Table dataSource={tableData} bordered rowKey="id" size="middle">
        <Column dataIndex="id" title="序号" width={75} align="center" />
        <Column
          title="提问时间"
          align="center"
          dataIndex="create_at"
          key="create_at"
          render={(create_at: string) => <>{new Date(create_at).toLocaleString()}</>}
          width={100}
        />
        <Column title="类型" dataIndex="type" key="type" align="center" width={100} />
        {/* <Column title="用户" dataIndex="user" key="user" align="center" /> */}
        <Column
          title="问题"
          dataIndex="q"
          key="q"
          render={(q: string) => {
            return (
              <div
                style={{
                  maxHeight: '160px',
                  overflow: 'auto',
                }}
                dangerouslySetInnerHTML={{ __html: q }}
              ></div>
            );
          }}
          width={250}
          onHeaderCell={() => {
            return {
              style: {
                textAlign: 'center',
                backgroundColor: '#fafafa',
              },
            };
          }}
        />
        <Column
          title="回答"
          dataIndex="a"
          key="a"
          width={500}
          render={(a: string) => {
            return (
              // <div
              //   style={{
              //     maxHeight: '160px',
              //     overflow: 'auto',
              //   }}
              //   dangerouslySetInnerHTML={{ __html: a }}
              // ></div>
              <pre
                style={{
                  whiteSpace: 'break-spaces',
                  maxHeight: '160px',
                  overflow: 'auto',
                }}
              >
                {a}
              </pre>
            );
          }}
          onHeaderCell={() => {
            return {
              style: {
                textAlign: 'center',
                backgroundColor: '#fafafa',
              },
            };
          }}
        />
        <Column
          title="引用"
          dataIndex="quote"
          key="quote"
          ellipsis={true}
          render={(a: string) => {
            return (
              // <div
              //   style={{
              //     maxHeight: '160px',
              //     overflow: 'auto',
              //   }}
              //   dangerouslySetInnerHTML={{ __html: a }}
              // ></div>
              <pre
                style={{
                  whiteSpace: 'break-spaces',
                  textOverflow: 'ellipsis',
                  maxHeight: '160px',
                  overflow: 'auto',
                }}
              >
                {a}
              </pre>
            );
          }}
          onHeaderCell={() => {
            return {
              style: {
                textAlign: 'center',
                backgroundColor: '#fafafa',
              },
            };
          }}
        />
        <Column
          title="操作"
          key="action"
          align="center"
          render={(row: any) => (
            <Space size="middle">
              <Button
                type="default"
                onClick={() => {
                  // setValue()
                  console.log(row);
                  setCurrentEditData(row);
                  setEditContent(row.a);
                  setIsModalOpen(true);
                }}
              >
                编辑回答
              </Button>
            </Space>
          )}
          width={120}
        />
      </Table>

      <Modal
        title="修改回答"
        open={isModalOpen}
        onCancel={handleEditModalCancel}
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
        <TextArea
          value={editContent}
          // onChange={setEditContent}
          onChange={(v) => {
            setEditContent(v.target.value);
          }}
          style={{
            minHeight: '350px',
          }}
        />
        {/* <ReactQuill
          theme="snow"
          value={editContent}
          onChange={setEditContent}
          style={{
            height: '300px',
          }}
        /> */}
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
              console.log(editContent);
              fetch(API_HOST_URL + 'api/admin/update_a', {
                method: 'post',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  id: currentEditData?.id,
                  a: editContent,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.code === 0) {
                    handleEditModalCancel();
                    message.success('修改成功');
                    init();
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    setConfirmLoading(false);
                  }, 500);
                });
            }}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={() => {
              console.log('Clicked cancel button');
              setOpen(false);
            }}
          >
            <Button
              style={{
                marginTop: '30px',
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
