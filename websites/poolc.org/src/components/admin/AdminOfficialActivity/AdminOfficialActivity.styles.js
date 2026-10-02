import styled from '@emotion/styled';
import { Select } from 'antd';
import colors from '../../../lib/styles/colors';
import { media } from '../../../styles/responsive';

export const MemberSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    min-height: 38px !important;
    border-color: ${colors.brown[0]} !important;
    border-radius: 6px !important;
  }
`;

export const QrAttendanceBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 2px 6px;
  border-radius: 999px;
  background: #e8f6f1;
  color: ${colors.mint[3]};
  font-size: 0.7rem;
  font-weight: 800;
`;

export const AttendanceSourceBadge = styled.span`
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
  border-radius: 999px;
  background: ${({ $source }) => ($source === 'QR' ? '#e8f6f1' : '#f1f2f2')};
  color: ${({ $source }) => ($source === 'QR' ? colors.mint[3] : '#777d7a')};
  font-size: 0.76rem;
  font-weight: 800;
`;

export const ActivityTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid rgba(76, 55, 34, 0.12);
  border-radius: 8px;
`;

export const ActivityTable = styled.table`
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  color: ${colors.brown[1]};
  font-size: 0.84rem;

  th, td {
    padding: 13px 14px;
    border-bottom: 1px solid rgba(76, 55, 34, 0.08);
    text-align: center;
    vertical-align: middle;
  }

  th:nth-of-type(1) { width: 30%; }
  th:nth-of-type(2) { width: 14%; }
  th:nth-of-type(3) { width: 12%; }
  th:nth-of-type(4) { width: 12%; }
  th:nth-of-type(5) { width: 32%; }

  tbody tr:last-of-type td { border-bottom: 0; }
`;

export const TableHead = styled.tr`
  background: ${colors.mint[0]};

  th { font-size: 0.8rem; font-weight: 800; }
`;

export const ActivityTableRow = styled.tr`
  cursor: pointer;

  &:hover { background: rgba(229, 240, 237, 0.45); }

  td:first-of-type {
    strong, span { display: block; }
    strong { font-weight: 800; }
    span { color: ${colors.brown[0]}; font-size: 0.76rem; }
  }

  &:hover td:first-of-type strong { text-decoration: underline; }
`;

export const PageHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${colors.brown[1]};
  font-size: 1.75rem;
  font-weight: 800;
`;

export const DetailSummary = styled.p`
  width: 100%;
  margin: 0 0 24px;
  color: ${colors.brown[0]};
  font-size: 0.9rem;
`;

export const DetailSection = styled.section`
  width: 100%;
  margin-top: 20px;

  h3 {
    margin: 0 0 12px;
    color: ${colors.brown[1]};
    font-size: 1rem;
  }
`;

export const DetailActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ParticipantToolbar = styled.div`
  width: 100%;
  max-width: 480px;
  margin-bottom: 14px;
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;

  > a { margin: 0; }
`;

export const DeleteButton = styled.button`
  min-width: 56px;
  padding: 7px 10px;
  border: 1px solid ${colors.red[2]};
  border-radius: 5px;
  background: ${colors.red[2]};
  color: #fff;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;

  &:hover {
    opacity: 0.86;
  }
`;

export const QrControl = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const QrToggleButton = styled.button`
  min-width: 76px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #b7ded1;
  border-radius: 5px;
  background: ${({ $enabled }) => ($enabled ? '#fff' : colors.mint[2])};
  color: ${({ $enabled }) => ($enabled ? colors.mint[3] : colors.gray[0])};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 800;
`;

export const OverviewGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const SummaryOverviewCard = styled.section`
  display: flex;
  height: 300px;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  border-radius: 8px;
  background: ${colors.mint[0]};
  box-shadow: 0 0 10px ${colors.gray[1]};
  box-sizing: border-box;

  > a {
    align-self: flex-end;
  }

  ${media.mobile} {
    height: 260px;
  }
`;

export const QrCard = styled.section`
  display: flex;
  height: 300px;
  flex-direction: column;
  align-items: center;
  padding: 22px;
  border: 1px solid #eee7de;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;

  ${media.mobile} {
    height: 260px;
  }
`;

export const QrCardHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const QrImage = styled.img`
  width: 152px;
  height: 152px;
  object-fit: contain;
`;

export const QrPreviewFrame = styled.div`
  display: flex;
  width: 176px;
  height: 176px;
  align-items: center;
  justify-content: center;
  margin: 10px 0 6px;
  border: 1px solid #e5e0d7;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(76, 55, 34, 0.08);
  box-sizing: border-box;
`;

export const QrPlaceholder = styled.div`
  display: flex;
  width: 152px;
  height: 152px;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d8d0c6;
  border-radius: 8px;
  background: #fbfaf8;
  color: ${colors.brown[0]};
  font-size: 0.82rem;
  text-align: center;

  svg {
    color: ${colors.brown[0]};
    font-size: 1.35rem;
  }
`;

export const QrHint = styled.p`
  margin: 0;
  color: ${colors.brown[0]};
  font-size: 0.75rem;
  line-height: 1.4;
  text-align: center;
`;

export const QrCardActions = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: auto;
`;

export const OfficialDetailContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  align-self: flex-start;
  flex-direction: column;
  gap: 20px;
  margin-top: 0;
`;

export const OfficialActivityHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 6px 2px 20px;

  .activity-heading {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 12px;
  }

  > a { flex: 0 0 auto; }

  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;

    > a { align-self: stretch; }

    .activity-heading { flex-wrap: wrap; }
  }
`;

export const OfficialMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  color: ${colors.brown[0]};
  font-size: 0.86rem;

  span + span::before {
    content: '·';
    margin-right: 8px;
  }
`;

export const HeaderQrControl = styled.div`
  display: none;
  align-items: center;
  gap: 10px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  > div > span:first-child {
    color: ${colors.brown[0]};
    font-size: 0.72rem;
    font-weight: 800;
  }
`;

export const HeaderQrImage = styled.img`
  width: 76px;
  height: 76px;
  padding: 5px;
  border: 1px solid #e5e0d7;
  border-radius: 7px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(76, 55, 34, 0.06);
  box-sizing: border-box;
  object-fit: contain;
`;

export const HeaderQrDownload = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  gap: 4px;

  button {
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border: 1px solid #d8d0c6;
    border-radius: 5px;
    background: #ffffff;
    color: ${colors.brown[0]};
    font-size: 0.78rem;
    cursor: pointer;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    z-index: 3;

    svg { font-size: 1.1rem; pointer-events: none; }

    &:hover { border-color: ${colors.mint[2]}; color: ${colors.mint[3]}; }
  }
`;

export const HeaderQrPlaceholder = styled.div`
  display: flex;
  width: 76px;
  height: 76px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d8d0c6;
  border-radius: 7px;
  background: #fbfaf8;
  color: ${colors.brown[0]};
  font-size: 1.25rem;
  box-sizing: border-box;
`;

export const OfficialDetailLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 292px;
  grid-template-areas: 'participants qr';
  align-items: start;
  gap: 20px;

  ${media.mobile} {
    grid-template-columns: 1fr;
    grid-template-areas: 'qr' 'participants';
  }
`;

export const ParticipantPanel = styled.section`
  grid-area: participants;
  min-width: 0;
  padding: 0;
`;

export const ParticipantHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  > div { display: flex; align-items: baseline; gap: 8px; }
  h2 { margin: 0; color: ${colors.brown[1]}; font-size: 1rem; font-weight: 800; }
  > div:last-child { width: min(100%, 300px); }

  ${media.mobile} {
    align-items: stretch;
    flex-direction: column;

    > div:last-child { width: 100%; }
  }
`;

export const ParticipantCount = styled.span`
  color: ${colors.brown[0]};
  font-size: 0.8rem;
  font-weight: 700;
`;

export const OfficialQrPanel = styled.aside`
  display: flex;
  grid-area: qr;
  min-height: 324px;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #eee7de;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;

  .qr-header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  h2 { margin: 0; color: ${colors.brown[1]}; font-size: 1rem; font-weight: 800; }
`;

export const ParticipantTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid rgba(76, 55, 34, 0.12);
  border-radius: 8px;
`;

export const ActivityTitleRow = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;

  > p { margin: 0; white-space: nowrap; }

  ${media.mobile} {
    flex-wrap: wrap;
    gap: 4px 10px;

    > p { white-space: normal; }
  }
`;

export const ParticipantTable = styled.table`
  width: 100%;
  min-width: 720px;
  height: auto;
  border-collapse: collapse;
  table-layout: fixed;
  color: ${colors.brown[1]};
  font-size: 0.82rem;

  th,
  td {
    height: 56px;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(76, 55, 34, 0.08);
    line-height: 1.25;
    text-align: center;
    vertical-align: middle;
    box-sizing: border-box;
  }

  th:nth-of-type(1) { width: 24%; }
  th:nth-of-type(2) { width: 16%; }
  th:nth-of-type(3) { width: 22%; }
  th:nth-of-type(4) { width: 14%; }
  th:nth-of-type(5) { width: 16%; }
  th:nth-of-type(6) { width: 8%; }

  tbody tr:last-of-type td { border-bottom: 0; }
`;

export const ParticipantTableHead = styled.tr`
  height: 52px;
  background: ${colors.mint[0]};

  th {
    height: 52px;
    font-size: 0.78rem;
    font-weight: 800;
  }
`;

export const ParticipantTableRow = styled.tr`
  height: 64px;

  &:hover { background: rgba(229, 240, 237, 0.45); }

  td:last-of-type > button {
    min-width: 52px;
    min-height: 32px;
    padding: 5px 8px;
  }
`;

export const ActivityActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  > a,
  > button {
    min-width: 52px;
    margin: 0;
    padding: 7px 8px;
    white-space: nowrap;
  }

  ${media.mobile} {
    display: none;
  }
`;

export const ActionMenuButton = styled.button`
  display: none;
  width: 36px;
  height: 36px;
  border: 1px solid #d8d0c6;
  border-radius: 5px;
  background: #fff;
  color: ${colors.brown[1]};
  cursor: pointer;

  ${media.mobile} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const EmptyResult = styled.p`
  margin: 0;
  padding: 32px 20px;
  color: ${colors.brown[0]};
  font-size: 0.84rem;
  text-align: center;
`;
