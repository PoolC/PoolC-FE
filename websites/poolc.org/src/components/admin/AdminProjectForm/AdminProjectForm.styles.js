import styled from '@emotion/styled';
import colors from '../../../lib/styles/colors';
import ActionButton from '../../common/Buttons/ActionButton';
import { DatePicker, Select } from 'antd';

export const StyledSelect = styled.select`
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${colors.brown[0]};
  border-radius: 6px;
  background: #fff;
  color: ${colors.brown[1]};
  font-size: 0.9rem;
`;

export const ProjectDatePicker = styled(DatePicker)`
  width: 100%;
  height: 38px;
  border-color: ${colors.brown[0]};
  border-radius: 6px;

  input { color: ${colors.brown[1]}; }
`;

export const MemberSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    min-height: 38px !important;
    border-color: ${colors.brown[0]} !important;
    border-radius: 6px !important;
  }
`;

export const ThumbnailHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  > button {
    flex: 0 0 auto;
    margin: 0;
    white-space: nowrap;
  }
`;

export const GameDropZone = styled.label`
  position: relative;
  display: flex;
  min-height: 156px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 22px;
  border: 2px dashed ${colors.gray[2]};
  border-radius: 12px;
  background: #fcfbf9;
  color: ${colors.brown[0]};
  cursor: pointer;
  text-align: center;
  transition: border-color 0.18s ease, background-color 0.18s ease;

  &:hover,
  &[data-active='true'] {
    border-color: ${colors.mint[2]};
    background: #f2fbf8;
  }

  &[data-disabled='true'] {
    cursor: progress;
    opacity: 0.65;
  }

  > svg {
    color: ${colors.mint[2]};
    font-size: 34px;
  }

  .drop-title {
    color: ${colors.brown[1]};
    font-size: 0.95rem;
    font-weight: 700;
  }

  .drop-action {
    color: ${colors.mint[3]};
    font-size: 0.84rem;
    font-weight: 700;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }
`;

export const GameUploadFile = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  color: ${colors.brown[1]};
  font-size: 0.88rem;
  overflow-wrap: anywhere;

  a,
  button {
    color: ${colors.mint[3]};
    font: inherit;
    font-weight: 700;
  }

  button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const FieldHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;

  label {
    color: ${colors.brown[1]};
    font-size: 0.9rem;
    font-weight: 800;
  }

  span {
    color: ${colors.brown[0]};
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

export const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4, p { margin: 0; }
  h4 { color: ${colors.brown[1]}; font-size: 0.9rem; font-weight: 800; }
  p { color: ${colors.brown[0]}; font-size: 0.82rem; }
`;

export const MemberBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #e5e0d7;
  border-radius: 6px;
  background: #faf9f7;
`;

export const MemberInfo = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;

  strong { color: ${colors.brown[1]}; font-size: 0.88rem; }
  span { color: ${colors.brown[0]}; font-size: 0.76rem; }
`;

export const ButtonContainer = styled.div`
  flex: 0 0 auto;

  button {
    min-width: 48px;
    min-height: 32px;
    margin: 0;
    padding: 0 10px;
  }
`;
