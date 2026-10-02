import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import AdminMember from '../../../components/admin/AdminMember/AdminMember';
import * as memberAPI from '../../../lib/api/member';
import { MEMBER_ROLE } from '../../../constants/memberRoles';
import { SUCCESS } from '../../../constants/statusCode';
import { useMessage } from '../../../hooks/useMessage';

const AdminMemberContainer = () => {
  const message = useMessage();
  const [memberLoading, setMemberLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [members, setMembers] = useState(null);
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await memberAPI.getMembers();
      setMembers(response.data.data);
      setMemberLoading(false);
    })();
  }, []);

  useEffect(() => {
    memberAPI
      .getMemberRole()
      .then((res) => {
        if (res.status === SUCCESS.OK) {
          setRoles(res.data.data);
          setRolesLoading(false);
        }
      })
      .catch(() => {});
  }, []);

  const onAcceptMember = (loginID) => {
    memberAPI.acceptMember(loginID).then((res) => {
      if (res.status === SUCCESS.OK) {
        message.success('회원 승인이 완료되었습니다.');
        setMembers((currentMembers) => currentMembers.map((member) => (
          member.loginID === loginID ? { ...member, isActivated: true, role: MEMBER_ROLE.MEMBER } : member
        )));
      }
    });
  };

  const onWithdrawMember = (loginID) => {
    memberAPI.withdrawMember(loginID).then((res) => {
      if (res.status === SUCCESS.OK) {
        message.success('승인 대기 회원을 삭제했습니다.');
        setMembers((currentMembers) => currentMembers.filter((member) => member.loginID !== loginID));
      }
    });
  };

  const onUpdateMemberRole = ({ loginID, role }) => {
    memberAPI.updateMemberRole({ loginID, role }).then((res) => {
      if (res.status === SUCCESS.OK) {
        message.success('역할이 변경되었습니다.');
        setMembers((currentMembers) => currentMembers.map((member) => {
          if (member.loginID !== loginID) return member;
          const additionalRoles = ['UNACCEPTED', 'EXPELLED', 'QUIT', 'PUBLIC'].includes(role) ? [] : (member.additionalRoles || []);
          return { ...member, baseRole: role, additionalRoles, role: getEffectiveRole(role, additionalRoles) };
        }));
      }
    });
  };

  const onUpdateAdditionalRole = async ({ loginID, role, enabled }) => {
    try {
      const response = await memberAPI.updateAdditionalMemberRole({ loginID, role, enabled });
      if (response.status === SUCCESS.OK) {
        setMembers((currentMembers) => currentMembers.map((member) => {
          if (member.loginID !== loginID) return member;
          const additionalRoles = enabled
            ? [...new Set([...(member.additionalRoles || []), role])]
            : (member.additionalRoles || []).filter((existingRole) => existingRole !== role);
          return { ...member, additionalRoles, role: getEffectiveRole(member.baseRole || member.role, additionalRoles) };
        }));
        message.success('추가 역할이 변경되었습니다.');
        return true;
      }
    } catch (error) {
      message.error(error.response?.data?.message || '추가 역할 변경에 실패했습니다.');
    }
    return false;
  };

  const onUpdateAdminRemarks = async ({ loginID, remarks }) => {
    try {
      const response = await memberAPI.updateMemberAdminRemarks({ loginID, remarks });
      if (response.status === SUCCESS.OK) {
        setMembers((currentMembers) => currentMembers.map((member) => (
          member.loginID === loginID ? { ...member, adminRemarks: remarks.trim() || null } : member
        )));
        message.success('비고를 저장했습니다.');
        return true;
      }
    } catch (error) {
      message.error(error.response?.data?.message || '비고 저장에 실패했습니다.');
    }
    return false;
  };

  if (members === null || roles === null) {
    return null;
  }

  return (
    <>
      {(memberLoading || rolesLoading) && <Spin />}
      {!(memberLoading || rolesLoading) && (
        <AdminMember
          members={members}
          onAcceptMember={onAcceptMember}
          onWithdrawMember={onWithdrawMember}
          onUpdateMemberRole={onUpdateMemberRole}
          onUpdateAdditionalRole={onUpdateAdditionalRole}
          onUpdateAdminRemarks={onUpdateAdminRemarks}
          roles={roles}
        />
      )}
    </>
  );
};

const getEffectiveRole = (baseRole, additionalRoles) => {
  if (baseRole === 'SUPER_ADMIN' || baseRole === 'ADMIN') return baseRole;
  if (additionalRoles.includes('TECHNICIAN')) return 'TECHNICIAN';
  if (additionalRoles.includes('GRADUATED')) return 'GRADUATED';
  return baseRole;
};

export default AdminMemberContainer;
