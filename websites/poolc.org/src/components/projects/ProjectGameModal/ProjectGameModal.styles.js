import styled from '@emotion/styled';
import { Modal } from 'antd';

export const GameModal = styled(Modal)`
  .ant-modal-content {
    overflow: hidden;
    padding: 0;
  }

  .ant-modal-header {
    margin: 0;
    padding: 16px 24px;
  }

  .ant-modal-body {
    padding: 0;
    line-height: 0;
  }
`;

export const GameModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GameModalIcon = styled.img`
  display: block;
  width: 22px;
  height: 24px;
  object-fit: contain;
`;

export const GameFrame = styled.iframe`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  background: #111;
`;
