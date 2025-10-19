import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Upload, message, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  getConsultantProfile,
  updateConsultantProfile,
} from '../../../services/api';

interface ConsultantProfileType {
  name: string;
  mobile: string;
  agencyName: string;
  agencyPhone: string;
  address: string;
  instagram?: string;
  vip?: boolean;
  documents?: string[]; // URLs مدارک آپلود شده
}

const ConsultantProfile: React.FC = () => {
  const [profile, setProfile] = useState<ConsultantProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getConsultantProfile();

      setProfile(data.user);
    } catch (err) {
      message.error('خطا در بارگذاری پروفایل');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: any) => {
    setUploading(true);
    try {
      // فرض می‌کنیم این تابع فایل رو آپلود و URL میده
      const res = await updateConsultantProfile({ file });
      message.success('مدرک با موفقیت آپلود شد');
      fetchProfile();
    } catch (err) {
      message.error('خطا در آپلود مدرک');
    } finally {
      setUploading(false);
    }
    return false; // جلوگیری از آپلود خودکار آنت دی
  };

  if (loading || !profile)
    return <Spin style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ padding: 16 }}>
      <Card title="پروفایل مشاور" style={{ fontFamily: 'Iran-sans-reg' }}>
        <p>
          <strong>نام و نام خانوادگی:</strong> {profile.name}
        </p>
        <p>
          <strong>شماره موبایل:</strong> {profile.mobile}
        </p>
        <p>
          <strong>نام آژانس:</strong> {profile.agencyName}
        </p>
        <p>
          <strong>تلفن آژانس:</strong> {profile.agencyPhone}
        </p>
        <p>
          <strong>آدرس آژانس:</strong> {profile.address}
        </p>
        <p>
          <strong>اینستاگرام:</strong> {profile.instagram || 'ندارد'}
        </p>
        <p>
          <strong>وضعیت VIP:</strong> {profile.vip ? 'VIP' : 'معمولی'}
        </p>

        <Form layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item label="آپلود مدارک (کارت ویزیت یا معرفی‌نامه)">
            <Upload
              beforeUpload={handleUpload}
              multiple={true}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                آپلود مدرک
              </Button>
            </Upload>
          </Form.Item>
          {profile.documents && profile.documents.length > 0 && (
            <ul>
              {profile.documents.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc} target="_blank" rel="noreferrer">
                    مدرک {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ConsultantProfile;
