import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Sử dụng đúng cách

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5011/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.ok) {
       
        const decodedToken = jwtDecode(result.token);
        console.log(decodedToken)
        if (decodedToken.role && decodedToken.role.includes('Admin')) {
          localStorage.setItem('authToken', result.token); // Lưu token vào localStorage
          navigate('/'); // Chuyển hướng về trang chủ
        } else {
          notification.error({ message: 'Access Denied', description: 'You do not have the required permissions to access this application.' });
        }
      } else {
        notification.error({ message: 'Login failed', description: result.message });
      }
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1890ff', // Màu nền xanh
      margin: 0
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2em',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Login</h1>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
