import styled from '@emotion/styled';
import colors from '../../../lib/styles/colors';

export const PageHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;

  @media (max-width: 767px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${colors.brown[1]};
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.25;
`;

export const TitleMeta = styled.p`
  margin: 8px 0 0;
  color: ${colors.brown[0]};
  font-size: 0.9rem;
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 767px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const FilterControl = styled.select`
  height: 38px;
  padding: 0 30px 0 10px;
  border: 1px solid #d8d0c6;
  border-radius: 6px;
  background: #fff;
  color: ${colors.brown[1]};
  font-size: 0.875rem;
`;

export const TabFilterRow = styled.div`
  position: relative;
  width: 100%;

  > div {
    width: 100%;

    .ant-tabs-nav {
      padding-right: 210px;
    }
  }

  > select {
    position: absolute;
    top: 6px;
    right: 0;
  }
`;

export const MemberTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid rgba(76, 55, 34, 0.12);
  border-radius: 8px;
`;

export const MemberTable = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  table-layout: fixed;
  color: ${colors.brown[1]};
  font-size: 0.84rem;

  th,
  td {
    box-sizing: border-box;
    padding: 12px 10px;
    border-bottom: 1px solid rgba(76, 55, 34, 0.08);
    text-align: center;
    vertical-align: middle;
  }

  th:nth-of-type(1) { width: 17%; }
  th:nth-of-type(2) { width: 13%; }
  th:nth-of-type(3) { width: 12%; }
  th:nth-of-type(4) { width: 15%; }
  th:nth-of-type(5) { width: 24%; }
  th:nth-of-type(6) { width: 19%; }

  @media (max-width: 900px) {
    min-width: 820px;

    th,
    td {
      padding: 10px 7px;
      font-size: 0.8rem;
    }
  }

  tbody tr:last-of-type td {
    border-bottom: 0;
  }
`;

export const TableHead = styled.tr`
  background: ${colors.mint[0]};

  th {
    color: ${colors.brown[1]};
    font-size: 0.8rem;
    font-weight: 800;
    text-align: center;
  }
`;

export const MemberListRow = styled.tr`
  cursor: pointer;

  &:hover {
    background: rgba(229, 240, 237, 0.45);
  }

`;

export const MemberIdentity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  strong {
    font-weight: 800;
  }

  span {
    color: ${colors.brown[0]};
    font-size: 0.76rem;
  }
`;

export const PendingActions = styled.div`
  display: inline-flex;
  gap: 6px;

  button {
    width: 60px;
    height: 36px;
    padding: 0;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 800;
    white-space: nowrap;
  }
`;

export const PendingActionButton = styled.button`
  border: 1px solid #b7ded1;
  background: #fff;
  color: ${colors.mint[3]};
`;

export const PendingDeleteButton = styled.button`
  border: 1px solid ${colors.red[2]};
  background: ${colors.red[2]};
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.86;
  }
`;

export const RoleSelect = styled.select`
  width: 100%;
  max-width: 156px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d8d0c6;
  border-radius: 8px;
  background: #fff;
  color: ${colors.brown[1]};
  font-size: 0.78rem;
`;

export const RoleCell = styled.div`
  display: flex;
  width: 100%;
  max-width: 156px;
  margin: 0 auto;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
`;

export const RemarksTrigger = styled.button`
  display: flex;
  width: 100%;
  min-width: 0;
  height: 36px;
  align-items: center;
  padding: 0 10px;
  border: 1px solid #d8d0c6;
  border-radius: 8px;
  background: #fff;
  color: ${colors.brown[1]};
  font-size: 0.8rem;
  cursor: pointer;
  box-sizing: border-box;
  text-align: left;

  span {
    display: block;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span[data-empty='true'] {
    color: ${colors.brown[0]};
  }

  &:hover {
    border-color: ${colors.mint[2]};
  }

  &:focus-visible {
    outline: 2px solid rgba(71, 190, 155, 0.22);
    border-color: ${colors.mint[2]};
  }
`;

export const AdditionalRoleOptions = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
  box-sizing: border-box;

  label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    gap: 4px;
    padding: 4px 7px;
    border: 1px solid #e5ded4;
    border-radius: 8px;
    background: #fff;
    color: ${colors.brown[1]};
    font-size: 0.72rem;
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;

    &[data-active='true'] {
      border-color: #b7ded1;
      background: ${colors.mint[0]};
    }

    &[data-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  input {
    width: 13px;
    height: 13px;
    margin: 0;
    accent-color: ${colors.mint[2]};
  }
`;

export const EmptyResult = styled.p`
  margin: 0;
  padding: 42px 20px;
  color: ${colors.brown[0]};
  font-size: 0.9rem;
  text-align: center;
`;
