import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Upload, message, Form, Input, List } from 'antd';
import { UploadOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import {
  getConsultantProfile,
  // getDeveloperProfile,
  // updateDeveloperProfile,
  // uploadDeveloperLogo,
} from '../../../services/api';

interface DeveloperProfileType {
  name: string;
  developerPhone: string;
  instagram?: string;
  projects?: {
    name: string;
    address: string;
    image?: string;
  }[];
  logo?: string;
}

const DeveloperProfile: React.FC = () => {
  const [profile, setProfile] = useState<DeveloperProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getConsultantProfile();
      setProfile(data.user);
      form.setFieldsValue(data.user);
    } catch (err) {
      message.error('خطا در بارگذاری پروفایل');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateDeveloperProfile(values);
      message.success('پروفایل با موفقیت به‌روزرسانی شد');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      message.error('خطا در ذخیره اطلاعات');
    }
  };

  const handleUpload = async (file: any) => {
    try {
      const res = await uploadDeveloperLogo(file);
      message.success('لوگو با موفقیت آپلود شد');
      fetchProfile();
    } catch (err) {
      message.error('خطا در آپلود لوگو');
    }
    return false;
  };
  console.log(profile);

  if (loading || !profile)
    return <Spin style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ padding: 16 }}>
      <Card
        title="پروفایل سازنده"
        extra={
          editing ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              ذخیره
            </Button>
          ) : (
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              ویرایش
            </Button>
          )
        }
        style={{ fontFamily: 'Iran-sans-reg' }}
      >
        <Form form={form} layout="vertical" disabled={!editing}>
          <Form.Item label="نام سازنده" name="name">
            <Input placeholder="نام و نام خانوادگی" />
          </Form.Item>

          <Form.Item label="شماره تماس" name="developerPhone">
            <Input placeholder="شماره موبایل" />
          </Form.Item>

          <Form.Item label="اینستاگرام" name="instagram">
            <Input placeholder="@username" />
          </Form.Item>

          <Form.Item label="لوگو شرکت">
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>آپلود لوگو</Button>
            </Upload>
            {profile.logo && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={profile.logo}
                  alt="لوگو"
                  style={{ width: 100, borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Item>
        </Form>

        <Card title="پروژه‌ها" size="small" style={{ marginTop: 20 }}>
          {profile.projects && profile.projects.length > 0 ? (
            <List
              dataSource={profile.projects}
              renderItem={(proj) => (
                <List.Item>
                  <List.Item.Meta
                    title={proj.name}
                    description={proj.address}
                    avatar={
                      proj.image && (
                        <img
                          src={proj.image}
                          alt={proj.name}
                          style={{ width: 60, height: 60, borderRadius: 8 }}
                        />
                      )
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <p>هیچ پروژه‌ای ثبت نشده است.</p>
          )}
        </Card>
      </Card>
    </div>
  );
};

export default DeveloperProfile;
