import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { create, getList, remove, update } from '../Service/apiService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await getList('category', { pagination: { page: 1, pageSize: 10 } });
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (values) => {
    try {
      await create('category', values);
      message.success('thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories(); // Tải lại danh sách danh mục
    } catch (error) {
      console.error('Error adding category:', error);
      message.error('Có lỗi xảy ra khi thêm danh mục.');
    }
  };

  const handleUpdate = async (values) => {
    console.log(values)
    try {
      await update('category', editingCategory.id, values);
      message.success('Danh mục đã cập thêm thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories(); 
      message.success('thành công!');
    } catch (error) {
      message.error('Cập nhật danh mục không thành công.');
    }
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa danh mục này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await remove('category', id);
          const updatedCategories = categories.filter(category => category.id !== id);
          setCategories(updatedCategories);
          message.success(' thành công.');
        } catch (error) {
          console.error('Failed to delete category:', error);
          message.error('Xóa danh mục không thành công.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => {
        const parentCategory = categories.find(cat => cat.id === parentId);
        return <span>{parentCategory ? parentCategory.name : 'Không có'}</span>;
      },
    },
    {
      title: 'Meta Keywords',
      dataIndex: 'metakey',
      key: 'metakey',
    },
    {
      title: 'Meta Description',
      dataIndex: 'metadesc',
      key: 'metadesc',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span>{status ? 'Hoạt động' : 'Không hoạt động'}</span>
      ),
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditCategory(record)}>Chỉnh sửa</Button>
          <Button 
            danger 
            style={{ marginLeft: 8 }} 
            onClick={() => handleDeleteCategory(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý danh mục</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingCategory(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Thêm danh mục
      </Button>
      <Table columns={columns} dataSource={categories} />

      <Modal
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingCategory ? handleUpdate : handleAddCategory}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentId"
            label="Danh mục cha"
          >
            <Select
              allowClear
              placeholder="Chọn danh mục cha (nếu có)"
            >
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="metakey"
            label="Meta Keywords"
            rules={[{ required: true, message: 'Vui lòng nhập meta keywords!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="metadesc"
            label="Meta Description"
            rules={[{ required: true, message: 'Vui lòng nhập meta description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
