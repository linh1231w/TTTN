import React from 'react';
import { Create, SimpleForm, TextInput, NumberInput, BooleanInput, FileInput, FileField, NumberField, BooleanField, ImageField, TextField, Datagrid, List, FunctionField } from 'react-admin';

export const ProductCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      {/* Tên sản phẩm */}
      <TextInput source="name" label="Tên Sản Phẩm" />
      
      {/* Mô tả sản phẩm */}
      <TextInput source="description" label="Mô Tả Sản Phẩm" multiline />
      
      {/* Giá sản phẩm */}
      <NumberInput source="price" label="Giá" />
      
      {/* Số lượng */}
      <NumberInput source="quantity" label="Số lượng" />
      
      {/* Số lượng trong kho */}
      <NumberInput source="stock" label="Số Lượng Tồn Kho" />
      
      {/* Trạng thái */}
      <BooleanInput source="status" label="Trạng Thái" />
      
      {/* Upload hình ảnh chính và hình ảnh phụ */}
      <FileInput source="images" label="Hình Ảnh" accept="image/*" multiple>
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);








const renderMainImage = (record) => {
  if (!record || !record.images) {
    console.error('Record or images are undefined:', record);
    return null;
  }

  const mainImage = record.images.find(image => image.isMain);
  console.log(mainImage)
  if (!mainImage) {
    console.log('No main image found in record:', record);
    return null;
  }

  return (
    <img
      src={`http://localhost:5011/api/admin${mainImage.url}`}
      alt={mainImage.url}
      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
    />
  );
};
export const ProductList = (props) => (
  <List {...props}>
    <Datagrid>
      {/* Tên sản phẩm */}
      <TextField source="name" label="Tên Sản Phẩm" />
      
      {/* Mô tả sản phẩm */}
      <TextField source="description" label="Mô Tả Sản Phẩm" />
      
      {/* Giá sản phẩm */}
      <NumberField source="price" label="Giá" />
      
      {/* Số lượng */}
      <NumberField source="quantity" label="Số lượng" />
      
      {/* Số lượng trong kho */}
      <NumberField source="stock" label="Số Lượng Tồn Kho" />
      
      {/* Trạng thái */}
      <BooleanField source="status" label="Trạng Thái" />
      
      {/* Hình ảnh chính */}
      <FunctionField label="Hình Ảnh Chính" render={renderMainImage} />
    </Datagrid>
  </List>
);
