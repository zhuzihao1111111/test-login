// frontend/src/pages/SynchronizerTokenForm.js
// 同步令牌模式示例
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';

export default function SynchronizerTokenForm() {
  const [form] = Form.useForm();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/get-csrf-token', { withCredentials: true })
      .then(res => {
        setToken(res.data.csrf_token);
        form.setFieldsValue({ csrf_token: res.data.csrf_token });
      })
      .catch(() => {
        message.error('获取 CSRF 令牌失败');
      })
      .finally(() => setLoading(false));
  }, [form]);

  const onFinish = async (values) => {
    try {
      await axios.post('/api/sync-submit', values, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      message.success('同步令牌表单提交成功！');
      form.resetFields();
    } catch {
      message.error('同步令牌表单提交失败');
    }
  };

  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2 style={{ textAlign: 'center' }}>同步令牌 CSRF 防护页</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="csrf_token" hidden>
          <Input />
        </Form.Item>
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
