import { useEffect, useMemo, useState } from 'react';
import { Popconfirm, Skeleton } from 'antd';
import { withRouter } from 'react-router';
import ActionButton from '../../common/Buttons/ActionButton';
import { SectionTabs } from '../../common/SectionTabs/SectionTabs';
import {
  ActionCell,
  CurrentMinimum,
  EmptyResult,
  ExpellActionButton,
  MemberIdentity,
  MemberListRow,
  ResultTable,
  ResultTableContainer,
  SettingsPanel,
  SettingsRow,
  StatusChip,
  TableHead,
  Title,
  TitleGroup,
  TitleRow,
  Toolbar,
} from './AdminPass.styles';
import { WhiteNarrowBlock } from '../../../styles/common/Block.styles';
import { MENU } from '../../../constants/menus';

const TAB = {
  AT_RISK: 'AT_RISK',
  MAINTAINED: 'MAINTAINED',
  ALL: 'ALL',
};

const ACTIVITY_MEMBER_ROLES = new Set(['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN', 'MEMBER']);

const getJudgement = (member, minimumLimit) => {
  if (member.isExcepted) return 'EXEMPTED';
  return member.hour >= minimumLimit ? 'MAINTAINED' : 'AT_RISK';
};

const EXEMPTION_REASONS = {
  SUPER_ADMIN: '최고 관리자',
  ADMIN: '임원진',
  TECHNICIAN: '기여자',
  GRADUATED_INACTIVE: '졸업 비활동',
  GRADUATED: '졸업회원',
  COMPLETE: '수료회원',
  INACTIVE: '한 학기 비활동',
};
const AUTOMATIC_EXEMPTION_ROLES = new Set(Object.keys(EXEMPTION_REASONS));

const getExemptionReason = (member) => {
  if (!member.isExcepted) return '-';
  const reasonRole = member.member.baseRole === 'GRADUATED_INACTIVE' ? member.member.baseRole : member.member.role;
  return EXEMPTION_REASONS[reasonRole] || '관리자 지정';
};

const MemberRow = ({ member, minimumLimit, showExemptionReason, handleChangeExcepted, handleWithdraw, history }) => {
  const judgement = getJudgement(member, minimumLimit);
  const isAutomaticExemption = AUTOMATIC_EXEMPTION_ROLES.has(member.member.role);

  const moveToMemberDetail = () => {
    history.push(`/${MENU.MEMBER}/${member.member.loginID}`);
  };

  const statusLabel = {
    EXEMPTED: '면제',
    MAINTAINED: '유지 예정',
    AT_RISK: '상실 예정',
  }[judgement];

  return (
    <MemberListRow onClick={moveToMemberDetail}>
      <td>
        <MemberIdentity>
          <strong>{member.member.name}</strong>
          <span>{member.member.loginID}</span>
        </MemberIdentity>
      </td>
      <td>{member.member.studentID || '-'}</td>
      <td>{member.member.department || '-'}</td>
      <td>{member.hour}시간</td>
      {showExemptionReason && <td>{getExemptionReason(member)}</td>}
      <td>
        <StatusChip type={judgement}>{statusLabel}</StatusChip>
      </td>
      <td onClick={(event) => event.stopPropagation()}>
        <ActionCell>
          <ActionButton
            disabled={isAutomaticExemption}
            title={isAutomaticExemption ? '직위에 따른 자동 면제입니다.' : undefined}
            onClick={() => handleChangeExcepted(member.member.loginID, member.isExcepted)}
          >
            {member.isExcepted ? '면제 해제' : '면제'}
          </ActionButton>
          {judgement === 'AT_RISK' && (
            <Popconfirm
              title="회원 자격 박탈"
              description={`${member.member.name} 회원의 자격을 정말 박탈하시겠습니까?`}
              okText="박탈"
              cancelText="취소"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleWithdraw(member.member.loginID)}
            >
              <ExpellActionButton>자격 박탈</ExpellActionButton>
            </Popconfirm>
          )}
        </ActionCell>
      </td>
    </MemberListRow>
  );
};

const AdminPass = ({ members, isLoading, minimumActivityHours, onUpdateMinimumActivityHours, onChangeExcepted, onWithdraw, history }) => {
  const [activeTab, setActiveTab] = useState(TAB.AT_RISK);
  const [minimumLimit, setMinimumLimit] = useState(String(minimumActivityHours));

  useEffect(() => {
    setMinimumLimit(String(minimumActivityHours));
  }, [minimumActivityHours]);

  const numericMinimumLimit = minimumActivityHours;
  const activeMembers = useMemo(
    () => members?.filter((member) => ACTIVITY_MEMBER_ROLES.has(member.member.role)) || [],
    [members],
  );
  const atRiskMembers = useMemo(
    () => activeMembers.filter((member) => !member.isExcepted && member.hour < numericMinimumLimit),
    [activeMembers, numericMinimumLimit],
  );
  const maintainedMembers = useMemo(
    () => activeMembers.filter((member) => member.isExcepted || member.hour >= numericMinimumLimit),
    [activeMembers, numericMinimumLimit],
  );

  const tabItems = [
    { key: TAB.AT_RISK, label: `상실 예정 ${atRiskMembers.length}` },
    { key: TAB.MAINTAINED, label: `유지 예정 ${maintainedMembers.length}` },
    { key: TAB.ALL, label: `전체 ${activeMembers.length}` },
  ];

  const visibleMembers = {
    [TAB.AT_RISK]: atRiskMembers,
    [TAB.MAINTAINED]: maintainedMembers,
    [TAB.ALL]: activeMembers,
  }[activeTab];
  const showExemptionReason = activeTab !== TAB.AT_RISK;

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateMinimumActivityHours(Number(minimumLimit));
  };

  return (
    <WhiteNarrowBlock>
      <TitleRow>
        <TitleGroup><Title>최소 활동 기준</Title><CurrentMinimum>{minimumActivityHours}시간</CurrentMinimum></TitleGroup>
        <SettingsPanel onSubmit={handleSubmit}>
          <label htmlFor="minimum-activity-hours">기준 변경</label>
          <SettingsRow>
            <input id="minimum-activity-hours" value={minimumLimit} onChange={(event) => setMinimumLimit(event.target.value)} type="number" min="1" />
            <span>시간</span>
            <ActionButton type="submit">수정</ActionButton>
          </SettingsRow>
        </SettingsPanel>
      </TitleRow>

      <Toolbar>
        <SectionTabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
      </Toolbar>

      <ResultTableContainer>
        <ResultTable $withExemptionReason={showExemptionReason}>
          <thead>
            <TableHead>
              <th>회원</th>
              <th>학번</th>
              <th>학과</th>
              <th>활동 시간</th>
              {showExemptionReason && <th>면제 사유</th>}
              <th>판정</th>
              <th>조치</th>
            </TableHead>
          </thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }, (_, index) => (
              <tr key={`loading-${index}`}><td colSpan={showExemptionReason ? 7 : 6}><Skeleton active title={false} paragraph={{ rows: 1, width: '100%' }} /></td></tr>
            )) : visibleMembers.map((member) => (
              <MemberRow
                key={member.member.loginID}
                member={member}
                minimumLimit={numericMinimumLimit}
                showExemptionReason={showExemptionReason}
                handleChangeExcepted={onChangeExcepted}
                handleWithdraw={onWithdraw}
                history={history}
              />
            ))}
          </tbody>
        </ResultTable>
        {!isLoading && members !== null && visibleMembers.length === 0 && <EmptyResult>해당하는 회원이 없습니다.</EmptyResult>}
        {!isLoading && members === null && <EmptyResult>활동 회원의 최소 활동 기준 판정 결과가 표시됩니다.</EmptyResult>}
      </ResultTableContainer>
    </WhiteNarrowBlock>
  );
};

export default withRouter(AdminPass);
