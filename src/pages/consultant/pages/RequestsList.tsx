import React, { useEffect, useState } from 'react';
import { Card, Spin, message, Badge, Row, Col } from 'antd';
import { getRequestsForConsultant } from '../../../services/api';

interface RequestType {
  _id: string;
  customerName: string;
  businessField: string;
  type: string;
  payment: string;
  budget: number;
  area: number;
  status: string; // pending / approved / rejected
}

const statusColors: Record<string, string> = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
};

const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getRequestsForConsultant();
      setRequests(res.data);
    } catch (err: any) {
      message.error('خطا در بارگذاری درخواست‌ها');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Spin style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <Row gutter={[16, 16]}>
      {requests.length === 0 && (
        <p style={{ textAlign: 'center', width: '100%' }}>
          درخواستی موجود نیست
        </p>
      )}

      {requests.map((req) => (
        <Col xs={24} sm={24} md={12} key={req._id}>
          <Badge color={statusColors[req.status] || 'blue'} text={req.status} />
          <Card
            title={req.customerName}
            style={{ marginBottom: 16, borderRadius: 8 }}
            bodyStyle={{ fontFamily: 'Iran-sans-reg' }}
          >
            <p>
              <strong>حوزه فعالیت:</strong> {req.businessField}
            </p>
            <p>
              <strong>نوع درخواست:</strong> {req.type}
            </p>
            <p>
              <strong>روش پرداخت:</strong> {req.payment}
            </p>
            <p>
              <strong>بودجه:</strong> {req.budget.toLocaleString()} تومان
            </p>
            <p>
              <strong>مساحت مورد نیاز:</strong> {req.area} متر مربع
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default RequestsList;
