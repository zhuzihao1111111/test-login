// frontend/src/pages/RefererCheckForm.js
// 来源头校验示例
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

export default function RefererCheckForm() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await axios.post('/api/referer-submit', values, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      message.success('来源校验表单提交成功！');
      form.resetFields();
    } catch (err) {
      message.error('来源校验失败：' + (err.response?.data?.message || '请求被拒绝'));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2 style={{ textAlign: 'center' }}>Referer/Origin 校验防护页</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="data" label="数据" rules={[{ required: true }]}>
          <Input placeholder="输入数据" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>提交</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
