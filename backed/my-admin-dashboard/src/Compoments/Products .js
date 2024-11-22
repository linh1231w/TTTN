import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Select, Upload, message, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { create, getList, remove, update } from '../Service/apiService';



const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [brands, setBrands] = useState([]); // Lưu danh sách thương hiệu
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục
  
  const fetchBrands = async () => {
    try {
      const { data } = await getList('brand', { pagination: { page: 1, pageSize: 100 } });
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data } = await getList('category', { pagination: { page: 1, pageSize: 100 } });
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const { data } = await getList('product', { pagination: { page: 1, pageSize: 10 } });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands(); // Gọi hàm fetchBrands khi component được mount
  fetchCategories(); // Gọi hàm fetchCategories khi component được mount
    handleMainImageChange(); // Gọi hàm fetchProducts khi component được mount
  }, []);



const handleAddProduct = async (values) => {
  try {
    // Chuẩn bị dữ liệu để gọi API
    const productData = {
      ...values,
      images: fileList.map((file) => ({
        ...file,
        isMain: file.uid === mainImage,
        uid: file.uid                         
      })),
    };


    await create('product', productData);

    // Sau khi thêm sản phẩm thành công
    message.success('Sản phẩm đã được thêm thành công!');
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]); // Reset danh sách hình ảnh
    fetchProducts()
  } catch (error) {
    console.error('Failed to add product:', error);
    message.error('Lỗi khi thêm sản phẩm');
  }
};


const handleUpdateProduct = async (values) => {
  try {
    const oldImages = editingProduct.images;
    const processedImages = oldImages.map((file) => ({
      uid: file.uid,
      url: file.url, // Nếu ảnh mới, dùng thumbUrl
      isMain: file.uid === mainImage, // Kiểm tra ảnh chính
    }));
    const oldImagesJSON = JSON.stringify(processedImages);
    const newImages = fileList.filter((file) => {
      return !oldImages.some(oldImage => oldImage.uid === file.uid);
    });
    const deletedImages = oldImages.filter(oldImage => 
      !fileList.some(newImage => newImage.uid === oldImage.uid)
    );

    
    const deletedImagesJSON = JSON.stringify(deletedImages);

  
    const productData = {
      ...values,
      imagess:oldImagesJSON,
      images: newImages.map((file) => ({
        ...file,
        isMain: file.uid === mainImage,
        uid: file.uid                         
      })),
      deletedImages: deletedImagesJSON

    };

    console.log(productData);

    // Gọi API để cập nhật sản phẩm
    await update('product',editingProduct.id,productData);

    message.success('Sản phẩm đã được cập nhật thành công!');
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]); // Reset danh sách hình ảnh
    fetchProducts(); // Lấy danh sách sản phẩm mới
    console.log(productData);
  } catch (error) {
    console.error('Failed to update product:', error);
    message.error('Lỗi khi cập nhật sản phẩm');
  }
};

// Hàm xử lý khi tải lên hình ảnh
const handleUploadChange = ({ fileList: newFileList }) => {
  // Đảm bảo rằng bạn lưu trữ đúng đối tượng File
  setFileList(newFileList.map(file => ({
    ...file,
    rawFile: file.originFileObj, // Thêm thuộc tính rawFile
  })));
};

const handleMainImageChange = (fileUid) => {
  
  setMainImage(fileUid);
};
const handleEditProduct = (record) => {
  setEditingProduct(record);
  form.setFieldsValue(record);

  if (record.images) {
    const mappedImages = record.images.map((image, index) => ({
      uid: image.uid, // Bạn có thể sử dụng index hoặc một giá trị unique khác
      name: `image-${index}`, // Tên hình ảnh
      status: 'done', // Đánh dấu hình ảnh đã được tải lên
      url: `http://localhost:5011/api/admin${image.url}`, // Đường dẫn hình ảnh
      isMain: image.isMain, // Xác định hình ảnh chính
    }));

    setFileList(mappedImages);

    const mainImg = record.images.find(img => img.isMain);
    if (mainImg) {
      console.log(mainImg)
      setMainImage(mainImg.uid);
    }
  }
  
  setIsModalVisible(true);
};



  const handleDeleteProduct = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await remove('product', id); // Gọi API để xóa sản phẩm
          message.success('Sản phẩm đã được cập nhật thành công!');
          const updatedProducts = products.filter(product => product.id !== id);
          setProducts(updatedProducts);
        } catch (error) {
          console.error('Failed to delete product:', error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (images) => {
        // Tìm hình ảnh chính (isMain: true)
        const mainImage = images.find((image) => image.isMain);
        // Hiển thị hình ảnh chính
        return mainImage ? (
          <img src={`http://localhost:5011/api/admin${mainImage.url}`} alt="Product" style={{ width: 100, height: 100, objectFit: 'cover' }} />
        ) : (
          'Không có hình'
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandId',
      key: 'brandId',
      render: (brandId) => {
        const brand = brands.find(brand => brand.id === brandId);
        return brand ? brand.name : 'Chưa xác định';
      },
    },
    {
      title: 'Danh Mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId) => {
        const category = categories.find(category => category.id === categoryId);
        return category ? category.name : 'Chưa xác định';
      },
    },
    
    {
      title: 'Mô tả sản phẩm',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => {
        // Định dạng giá trị tiền tệ bằng tiếng Việt
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(price);
      },
    }
,    
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'priceSale',
      key: 'priceSale',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Đang bán' : 'Ngừng bán'}
        </Tag>
      ),
    },
    {
      title: 'Chức năng ',
      key: 'action',
      render: (_, record) => (
        <>
        <Button onClick={() => handleEditProduct(record)}>Edit</Button>
        <Button 
          danger 
          style={{ marginLeft: 8 }} 
          onClick={() => handleDeleteProduct(record.id)}
        >
          Delete
        </Button>
      </>
      ),
    },
  ];
  

  const renderImageItem = (originNode, file,index) => {
  
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10, width: 100, height: 100 }}>
        {originNode}
        <Checkbox
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
        
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Nền trắng với độ mờ để dễ nhìn hơn
            textAlign: 'center',
          
           
            zIndex: 10, // Đảm bảo checkbox nằm trên cùng
          }}
          checked={file.uid === mainImage}
          onChange={() => handleMainImageChange(file.uid)}
        >
          Chọn làm ảnh chính
        </Checkbox>
      </div>
    );
  };
  

  return (
    <div>
      <h1>Quản lý sản phẩm</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingProduct(null);
          form.resetFields();
          setFileList([]);   
          setIsModalVisible(true);
        }}
      >
        Thêm sản phẩm
      </Button>
      <Table columns={columns} dataSource={products} />

      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);  // Reset danh sách hình ảnh về trống khi đóng modal
        }}
        footer={null}
      >
        <Form
          form={form}
         
          onFinish={ editingProduct ? handleUpdateProduct : handleAddProduct}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
    name="brandId"
    label="Thương hiệu"
    rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
  >
    <Select>
      {brands.map(brand => (
        <Select.Option key={brand.id} value={brand.id}>
          {brand.name}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
  <Form.Item
    name="categoryId"
    label="Danh mục"
    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
  >
    <Select>
      {categories.map(category => (
        <Select.Option key={category.id} value={category.id}>
          {category.name}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="priceSale"
            label="Giá khuyến mãi"
            rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value={true}>Đang bán</Select.Option>
              <Select.Option value={false}>Ngừng bán</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
          name="images"
          label="Hình ảnh"
          rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
        >
        <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Ngăn tự động tải lên
            itemRender={renderImageItem} 
            // Tuỳ chỉnh cách render hình ảnh với checkbox
          >
            {fileList.length < 6 && <div><PlusOutlined /> Tải lên</div>}
          </Upload>
       
        </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    
    </div>
  );
};

export default ProductList;
