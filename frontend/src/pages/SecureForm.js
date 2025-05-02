// frontend/src/pages/SecureForm.js
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

export default function SecureForm() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // 从 cookie 中读取 CSRF token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf_token='))
        ?.split('=')[1] || '';

      // 带上凭证和 CSRF 头提交
      await axios.post(
        '/api/secure-submit',
        values,
        {
          withCredentials: true,
          headers: { 'X-CSRFToken': token }
        }
      );

      message.success('防御 CSRF 的表单提交成功！');
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('防御 CSRF 的表单提交失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2 style={{ textAlign: 'center' }}>防御 CSRF 表单页</h2>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="data"
          label="数据"
          rules={[{ required: true, message: '请输入数据！' }]}
        >
          <Input placeholder="输入一些内容" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
