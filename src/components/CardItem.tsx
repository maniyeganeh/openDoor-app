import React from 'react';
import { Card } from 'antd';

interface CardItemProps {
  title: string;
  content: string;
}

const CardItem: React.FC<CardItemProps> = ({ title, content }) => (
  <Card style={{ marginBottom: 16 }}>
    <Card.Meta title={title} description={content} />
  </Card>
);

export default CardItem;
