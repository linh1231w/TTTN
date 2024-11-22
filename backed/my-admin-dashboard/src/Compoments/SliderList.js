import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { create, getList, remove, update } from '../Service/apiService';

const SliderList = () => {
  const [sliders, setSliders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSlider, setEditingSlider] = useState(null);
  const [fileList, setFileList] = useState([]);

  const fetchSliders = async () => {
    try {
      const { data } = await getList('slider', { pagination: { page: 1, pageSize: 10 } });
      setSliders(data);
    } catch (error) {
      console.error('Failed to fetch sliders:', error);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleAddSlider = async (values) => {
    try {
      const sliderData = {
        ...values,
        image: fileList.length > 0 ? fileList[0].originFileObj : null,
      };
      await create('slider', sliderData);
      message.success('Slider đã được thêm thành công!');
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchSliders();
    } catch (error) {
      console.error('Error adding slider:', error);
      message.error('Có lỗi xảy ra khi thêm slider.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const sliderData = {
        ...values,
        image: fileList.length > 0 ? fileList[0].originFileObj : null,
      };
      await update('slider', editingSlider.id, sliderData);
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchSliders();
      message.success('Slider đã được cập nhật thành công!');
    } catch (error) {
      message.error('Cập nhật slider không thành công.');
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => ({
      ...file,
      rawFile: file.originFileObj,
    })));
  };

  const handleEditSlider = (record) => {
    setEditingSlider(record);
    form.setFieldsValue(record);
    if (record.image) {
      setFileList([{
        uid: '-1',
        name: 'image',
        status: 'done',
        url: `http://localhost:5011/api/admin${record.image}`,
      }]);
    } else {
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleDeleteSlider = async (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa slider này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await remove('slider', id);
          const updatedSliders = sliders.filter(slider => slider.id !== id);
          setSliders(updatedSliders);
          message.success('Slider đã được xóa thành công!');
        } catch (error) {
          console.error('Failed to delete slider:', error);
          message.error('Có lỗi xảy ra khi xóa slider.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        image ? (
          <img src={`http://localhost:5011/api/admin${image}`} alt="Slider" style={{ width: 100, height: 100, objectFit: 'cover' }} />
        ) : (
          'Không có hình'
        )
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
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
          <Button onClick={() => handleEditSlider(record)}>Sửa</Button>
          <Button 
            danger 
            style={{ marginLeft: 8 }} 
            onClick={() => handleDeleteSlider(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Slider</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingSlider(null);
          form.resetFields();
          setFileList([]);   
          setIsModalVisible(true);
        }}
      >
        Thêm Slider
      </Button>
      <Table columns={columns} dataSource={sliders} />

      <Modal
        title={editingSlider ? 'Sửa Slider' : 'Thêm Slider'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingSlider ? handleUpdate : handleAddSlider}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên slider!' }]}
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
          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              customRequest={({ file, onSuccess }) => {
                onSuccess();
              }}
            >
              {fileList.length < 1 && <div><PlusOutlined /> Tải lên</div>}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingSlider ? 'Lưu thay đổi' : 'Thêm Slider'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SliderList;