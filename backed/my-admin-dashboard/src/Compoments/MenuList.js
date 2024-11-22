import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { create, getList, remove, update } from '../Service/apiService';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMenu, setEditingMenu] = useState(null);

  const fetchMenus = async () => {
    try {
      const { data } = await getList('menu', { pagination: { page: 1, pageSize: 10 } });
      setMenus(data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddMenu = async (values) => {
    try {
      await create('menu', values);
      message.success('Menu đã được thêm thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchMenus(); // Tải lại danh sách menu
    } catch (error) {
      console.error('Error adding menu:', error);
      message.error('Có lỗi xảy ra khi thêm menu.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await update('menu', editingMenu.id, values);
      message.success('Menu đã được cập nhật thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchMenus(); // Tải lại danh sách menu
    } catch (error) {
      message.error('Cập nhật menu không thành công.');
    }
  };

  const handleEditMenu = (record) => {
    setEditingMenu(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteMenu = async (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa menu này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await remove('menu', id);
          const updatedMenus = menus.filter(menu => menu.id !== id);
          setMenus(updatedMenus);
        } catch (error) {
          console.error('Failed to delete menu:', error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Tên Menu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditMenu(record)}>Edit</Button>
          <Button 
            danger 
            style={{ marginLeft: 8 }} 
            onClick={() => handleDeleteMenu(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Menu</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingMenu(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Thêm Menu
      </Button>
      <Table columns={columns} dataSource={menus} rowKey="id" />

      <Modal
        title={editingMenu ? 'Sửa Menu' : 'Thêm Menu'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingMenu ? handleUpdate : handleAddMenu}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên Menu"
            rules={[{ required: true, message: 'Vui lòng nhập tên menu!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: 'Vui lòng nhập URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingMenu ? 'Lưu thay đổi' : 'Thêm Menu'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuList;
