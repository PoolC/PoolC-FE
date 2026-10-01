import { useMemo, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import { MENU } from '../../../constants/menus';
import { WhiteNarrowBlock } from '../../../styles/common/Block.styles';
import { ListSearchToolbar } from '../../common/ListSearchToolbar/ListSearchToolbar';
import { SectionTabs } from '../../common/SectionTabs/SectionTabs';
import {
  EmptyResult,
  AdditionalRoleOptions,
  FilterControl,
  MemberIdentity,
  MemberListRow,
  MemberTable,
  MemberTableContainer,
  PageHeader,
  PendingActionButton,
  PendingActions,
  PendingDeleteButton,
  RoleCell,
  RoleSelect,
  RemarksTrigger,
  TableHead,
  TabFilterRow,
  Title,
  ToolbarActions,
} from './AdminMember.styles';

const MEMBER_TAB = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  TERMINATED: 'TERMINATED',
};

const TERMINATED_ROLES = ['EXPELLED', 'QUIT'];
const INACTIVE_ROLES = ['INACTIVE', 'COMPLETE', 'GRADUATED_INACTIVE'];
const ADDITIONAL_ROLE_NAMES = ['TECHNICIAN', 'GRADUATED'];

const getMemberTab = (member) => {
  const baseRole = member.baseRole || member.role;
  if (baseRole === 'UNACCEPTED') return MEMBER_TAB.PENDING;
  if (TERMINATED_ROLES.includes(baseRole)) return MEMBER_TAB.TERMINATED;
  if (INACTIVE_ROLES.includes(baseRole)) return MEMBER_TAB.INACTIVE;
  return MEMBER_TAB.ACTIVE;
};

const MemberTableHead = ({ showPendingActions }) => (
  <thead>
    <TableHead>
      <th>회원</th>
      <th>학과</th>
      <th>학번</th>
      <th>연락처</th>
      <th>비고</th>
      <th>{showPendingActions ? '조치' : '역할'}</th>
    </TableHead>
  </thead>
);

const MemberRow = ({ member, roles, showPendingActions, onAcceptMember, onWithdrawMember, onUpdateMemberRole, onUpdateAdditionalRole, onUpdateAdminRemarks, history }) => {
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [remarksDraft, setRemarksDraft] = useState(member.adminRemarks || '');
  const [savingRemarks, setSavingRemarks] = useState(false);
  const additionalRoles = member.additionalRoles || [];
  const canHaveAdditionalRoles = !['UNACCEPTED', 'EXPELLED', 'QUIT', 'PUBLIC'].includes(member.baseRole || member.role);
  const stopRowNavigation = (event) => event.stopPropagation();
  const moveToMemberDetail = () => history.push(`/${MENU.MEMBER}/${member.loginID}`);
  const openRemarks = (event) => {
    event.stopPropagation();
    setRemarksDraft(member.adminRemarks || '');
    setRemarksModalOpen(true);
  };
  const saveRemarks = async () => {
    setSavingRemarks(true);
    try {
      const saved = await onUpdateAdminRemarks({ loginID: member.loginID, remarks: remarksDraft });
      if (saved) setRemarksModalOpen(false);
    } finally {
      setSavingRemarks(false);
    }
  };
  const handleAdditionalRoleChange = async (event, role) => {
    event.stopPropagation();
    const enabled = event.target.type === 'checkbox' ? event.target.checked : event.target.value === role;
    await onUpdateAdditionalRole({ loginID: member.loginID, role, enabled });
  };
  const confirmDelete = () => Modal.confirm({
    title: '승인 대기 회원 삭제',
    content: `${member.name} 회원의 가입 신청을 정말 삭제하시겠습니까?`,
    okText: '삭제',
    cancelText: '취소',
    okButtonProps: { danger: true },
    onOk: () => onWithdrawMember(member.loginID),
  });

  return (
    <>
    <Modal
      title={`${member.name} 회원 비고`}
      open={remarksModalOpen}
      onCancel={() => !savingRemarks && setRemarksModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setRemarksModalOpen(false)} disabled={savingRemarks}>취소</Button>,
        <Button key="save" type="primary" onClick={saveRemarks} loading={savingRemarks}>저장</Button>,
      ]}
    >
      <Input.TextArea
        value={remarksDraft}
        onChange={(event) => setRemarksDraft(event.target.value)}
        maxLength={1000}
        autoSize={{ minRows: 6, maxRows: 14 }}
        placeholder="회원 관련 비고를 입력하세요."
        aria-label={`${member.name} 회원 비고 내용`}
      />
    </Modal>
    <MemberListRow onClick={moveToMemberDetail}>
      <td>
        <MemberIdentity>
          <strong>{member.name}</strong>
          <span>{member.loginID}</span>
        </MemberIdentity>
      </td>
      <td>{member.department || '-'}</td>
      <td>{member.studentID || '-'}</td>
      <td>{member.phoneNumber || '-'}</td>
      <td onClick={stopRowNavigation}>
        <RemarksTrigger type="button" onClick={openRemarks} title={member.adminRemarks || '비고 입력'} aria-label={`${member.name} 비고 열기`}>
          <span data-empty={!member.adminRemarks}>{member.adminRemarks || '비고 입력'}</span>
        </RemarksTrigger>
      </td>
      {showPendingActions && <td onClick={stopRowNavigation}>
        <PendingActions>
          <PendingActionButton onClick={() => onAcceptMember(member.loginID)}>승인</PendingActionButton>
          <PendingDeleteButton onClick={confirmDelete}>삭제</PendingDeleteButton>
        </PendingActions>
      </td>}
      {!showPendingActions && (
        <td onClick={stopRowNavigation}>
          <RoleCell>
            <RoleSelect value={member.baseRole || member.role || 'MEMBER'} onChange={(event) => onUpdateMemberRole({ loginID: member.loginID, role: event.target.value })} aria-label={`${member.name} 기본 역할`}>
              {roles?.filter((role) => !ADDITIONAL_ROLE_NAMES.includes(role.name)).map((role) => (
                <option key={role.name} value={role.name}>
                  {role.description}
                </option>
              ))}
            </RoleSelect>
            <AdditionalRoleOptions>
              {ADDITIONAL_ROLE_NAMES.map((role) => {
                const checked = additionalRoles.includes(role);
                return (
                  <label key={role} data-active={checked} data-disabled={!canHaveAdditionalRoles} title={role === 'TECHNICIAN' ? '관리자 권한이 함께 부여됩니다.' : undefined}>
                    <input type="checkbox" checked={checked} disabled={!canHaveAdditionalRoles} onChange={(event) => handleAdditionalRoleChange(event, role)} />
                    {role === 'TECHNICIAN' ? '기여자' : '졸업회원'}
                  </label>
                );
              })}
            </AdditionalRoleOptions>
          </RoleCell>
        </td>
      )}
    </MemberListRow>
    </>
  );
};

const AdminMember = ({ members, onAcceptMember, onWithdrawMember, onUpdateMemberRole, onUpdateAdditionalRole, onUpdateAdminRemarks, roles, history }) => {
  const [activeTab, setActiveTab] = useState(MEMBER_TAB.PENDING);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const tabCounts = useMemo(
    () =>
      members.reduce(
        (counts, member) => {
          counts[getMemberTab(member)] += 1;
          return counts;
        },
        { [MEMBER_TAB.PENDING]: 0, [MEMBER_TAB.ACTIVE]: 0, [MEMBER_TAB.INACTIVE]: 0, [MEMBER_TAB.TERMINATED]: 0 },
      ),
    [members],
  );

  const visibleMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredMembers = members.filter((member) => {
      const isInTab = getMemberTab(member) === activeTab;
      const matchesRole = roleFilter === 'ALL' || member.role === roleFilter || member.baseRole === roleFilter || member.additionalRoles?.includes(roleFilter);
      const searchableValues = [member.name, member.loginID, member.email, member.studentID, member.department].filter(Boolean).join(' ').toLowerCase();
      const matchesQuery = !normalizedQuery || searchableValues.includes(normalizedQuery);

      return isInTab && matchesRole && matchesQuery;
    });

    if (activeTab === MEMBER_TAB.INACTIVE) {
      filteredMembers.sort((left, right) => Number((right.baseRole || right.role) === 'INACTIVE') - Number((left.baseRole || left.role) === 'INACTIVE'));
    }

    return filteredMembers;
  }, [activeTab, members, roleFilter, searchQuery]);
  const showPendingActions = activeTab === MEMBER_TAB.PENDING;

  const tabs = [
    { key: MEMBER_TAB.PENDING, label: `승인 대기 ${tabCounts[MEMBER_TAB.PENDING]}` },
    { key: MEMBER_TAB.ACTIVE, label: `활동 ${tabCounts[MEMBER_TAB.ACTIVE]}` },
    { key: MEMBER_TAB.INACTIVE, label: `비활동 ${tabCounts[MEMBER_TAB.INACTIVE]}` },
    { key: MEMBER_TAB.TERMINATED, label: `탈퇴/상실 ${tabCounts[MEMBER_TAB.TERMINATED]}` },
  ];

  return (
    <WhiteNarrowBlock>
      <PageHeader>
        <div>
          <Title>회원 목록</Title>
        </div>
        <ToolbarActions>
          <ListSearchToolbar value={keyword} placeholder="이름, 아이디, 학과 검색" onChange={setKeyword} onSubmit={() => setSearchQuery(keyword)} />
        </ToolbarActions>
      </PageHeader>
      <TabFilterRow>
        <SectionTabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
        <FilterControl value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="회원 상태 필터">
          <option value="ALL">모든 상태</option>
          {roles?.map((role) => (
            <option key={role.name} value={role.name}>
              {role.description}
            </option>
          ))}
        </FilterControl>
      </TabFilterRow>
      <MemberTableContainer>
        <MemberTable>
          <MemberTableHead showPendingActions={showPendingActions} />
          <tbody>
            {visibleMembers.map((member) => (
              <MemberRow
                key={member.loginID}
                member={member}
                roles={roles}
                showPendingActions={showPendingActions}
                onAcceptMember={onAcceptMember}
                onWithdrawMember={onWithdrawMember}
                onUpdateMemberRole={onUpdateMemberRole}
                onUpdateAdditionalRole={onUpdateAdditionalRole}
                onUpdateAdminRemarks={onUpdateAdminRemarks}
                history={history}
              />
            ))}
          </tbody>
        </MemberTable>
        {visibleMembers.length === 0 && <EmptyResult>조건에 맞는 회원이 없습니다.</EmptyResult>}
      </MemberTableContainer>
    </WhiteNarrowBlock>
  );
};

export default withRouter(AdminMember);
