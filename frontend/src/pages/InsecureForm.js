// frontend/src/pages/InsecureForm.js
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

export default function InsecureForm() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // 直接提交，不带 CSRF token
      await axios.post(
        '/api/insecure-submit',
        values,
        { withCredentials: true }
      );

      message.success('不防御 CSRF 的表单提交成功！');
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('不防御 CSRF 的表单提交失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2 style={{ textAlign: 'center' }}>不防御 CSRF 表单页</h2>
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
