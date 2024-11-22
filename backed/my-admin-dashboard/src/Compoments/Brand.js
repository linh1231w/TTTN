import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { create, getList, remove, update } from '../Service/apiService';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBrand, setEditingBrand] = useState(null);
  const [fileList, setFileList] = useState([]);
                            

  const fetchBrands = async () => {
    try {
      const { data } = await getList('brand', { pagination: { page: 1, pageSize: 10 } });
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = async (values) => {
    try {
      const brandData = {
        ...values,
        image: fileList.length > 0 ? fileList[0].originFileObj : null, // Chỉ lấy hình ảnh đầu tiên
      };
  
      // Gọi hàm create để gửi dữ liệu đến server
      await create('brand', brandData);
  
      message.success('Thương hiệu đã được thêm thành công!');
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]); // Reset danh sách hình ảnh
      fetchBrands(); // Tải lại danh sách thương hiệu
    } catch (error) {
      console.error('Error adding brand:', error);
      message.error('Có lỗi xảy ra khi thêm thương hiệu.');
    }
  };


  const handleUpdate = async (values) => {
    try {
        const brandData = {
            ...values,
        image: fileList.length > 0 ? fileList[0].originFileObj : null,// Chỉ lấy hình ảnh đầu tiên
          };
          console.log(brandData)
     
      await update('brand',editingBrand.id,brandData)
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]); // Reset danh sách hình ảnh
      fetchBrands(); // Tải lại danh sách thương hiệu
   
      message.success('Thương hiệu đã được cập nhật thành công!');
    } catch (error) {
      message.error('Cập nhật thương hiệu không thành công.');
    }
  };
  
  

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => ({
      ...file,
      rawFile: file.originFileObj, // Thêm thuộc tính rawFile
    })));
  };

  const handleEditBrand = (record) => {
    setEditingBrand(record);
    form.setFieldsValue(record);

    // Đặt danh sách hình ảnh hiện có của thương hiệu vào fileList
    if (record.image) {
        setFileList([{
          uid: '-1', // Dùng uid để tránh bị xóa
          name: 'image',
          status: 'done',
          url: `http://localhost:5011/api/admin${record.image}`,
        }]);
      } else {
        setFileList([]); // Nếu không có hình ảnh, đảm bảo fileList rỗng
      }


    setIsModalVisible(true);
  };

  const handleDeleteBrand = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await remove('brand', id); // Gọi API để xóa thương hiệu
          // Cập nhật danh sách thương hiệu sau khi xóa
          const updatedBrands = brands.filter(brand => brand.id !== id);
          setBrands(updatedBrands);
        } catch (error) {
          console.error('Failed to delete brand:', error);
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
          <img src={`http://localhost:5011/api/admin${image}`} alt="Brand" style={{ width: 100, height: 100, objectFit: 'cover' }} />
        ) : (
          'Không có hình'
        )
      ),
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
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
          <Button onClick={() => handleEditBrand(record)}>Edit</Button>
          <Button 
            danger 
            style={{ marginLeft: 8 }} 
            onClick={() => handleDeleteBrand(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý thương hiệu</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingBrand(null);
          form.resetFields();
          setFileList([]);   
          setIsModalVisible(true);
        }}
      >
        Thêm thương hiệu
      </Button>
      <Table columns={columns} dataSource={brands} />

      <Modal
        title={editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);  // Reset danh sách hình ảnh về trống khi đóng modal
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingBrand ? handleUpdate : handleAddBrand}
        //   onFinish={handleAddBrand}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu!' }]}
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
          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Ngăn tự động tải lên
              customRequest={({ file, onSuccess }) => {
                // Xử lý upload thủ công nếu cần
                onSuccess(); // Giả sử upload thành công ngay lập tức
              }}
            >
              {fileList.length < 1 && <div><PlusOutlined /> Tải lên</div>}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBrand ? 'Lưu thay đổi' : 'Thêm thương hiệu'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandList;
