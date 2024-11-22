import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { create, getList, remove, update } from '../Service/apiService';

const { Option } = Select;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);  // Store roles here
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await getList('user', { pagination: { page: 1, pageSize: 10 } });
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const { data } = await getList('role',{ pagination: { page: 1, pageSize: 10 } });  // Assuming the API to fetch roles is 'role'
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles(); // Fetch roles when component mounts
  }, []);

  // Add user with roles
  const handleAddUser = async (values) => {
    try {
      await create('user', values);  // Include roleIds in the form values
      message.success('User created successfully!');
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      message.error('Failed to add user.');
    }
  };


  const handleUpdate = async (values) => {
    try {
      await update('user', editingUser.id, values);
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
      message.success('User updated successfully!');
    } catch (error) {
      message.error('Failed to update user.');
    }
  };

  const handleEditUser = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      roleIds: record.roles.map(role => role.id) // Set roleIds to the current roles of the user
    });
    setIsModalVisible(true);
    fetchRoles(); // Fetch roles when editing user
  };
  const handleDeleteUser = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await remove('user', id);
          message.success('User has been deleted successfully!');
          const updatedUsers = users.filter(user => user.id !== id);
          setUsers(updatedUsers);
        } catch (error) {
          console.error('Failed to delete user:', error);
          message.error(`Failed to delete user: ${error.message}`);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Roles',
      key: 'roles',
      render: (text, record) => (
        <span>
          {record.roles.map(role => role.name).join(', ')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditUser(record)}>Edit</Button>
          <Button 
            danger 
            style={{ marginLeft: 8 }} 
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>User Management</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingUser(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Add User
      </Button>
      <Table columns={columns} dataSource={users} />

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingUser ? handleUpdate : handleAddUser}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter the password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
          >
            <Input />
          </Form.Item>
          
          {/* Role selection */}
          <Form.Item
            name="roleIds"
            label="Roles"
            rules={[{ required: true, message: 'Please select at least one role!' }]}
          >
            <Select
              mode="multiple" // Allows selection of multiple roles
              placeholder="Select roles"
            >
              {roles.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? 'Save Changes' : 'Add User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
