import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import AuthForm from '../../../components/auth/AuthForm';
import * as authAPI from '../../../lib/api/auth';
import * as memberAPI from '../../../lib/api/member';
import { removeHeaderAccessToken, setHeaderAccessToken } from '../../../lib/utils/axiosUtil';
import { MENU } from '../../../constants/menus';
import { logout } from '../../../modules/auth';
import { SUCCESS } from '../../../constants/statusCode';

const MyInfoFormContainer = ({ history }) => {
  const dispatch = useDispatch();

  const [userLoading, setUserLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [message, setMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [roles, setRoles] = useState(null);

  const handleModalOpen = () => {
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    (async () => {
      removeHeaderAccessToken();
      setHeaderAccessToken();
      authAPI
        .loadUser()
        .then((res) => {
          if (res.status === SUCCESS.OK) {
            setUserInfo(res.data);
            setUserLoading(false);
          }
        })
        .catch(() => {
          history.push(`/${MENU.FORBIDDEN}`);
        });
    })();
  }, [history]);

  useEffect(() => {
    (async () => {
      memberAPI
        .getMemberRole()
        .then((res) => {
          if (res.status === SUCCESS.OK) {
            setRoles(res.data.data);
            setRolesLoading(false);
          }
        })
        .catch(() => {
          history.push(`/${MENU.FORBIDDEN}`);
        });
    })();
  }, [history]);

  function onChangeMessage(msg) {
    setMessage(msg);
  }

  const onSubmit = ({ name, password, passwordCheck, email, phoneNumber, introduction }) => {
    const response = authAPI.updateUser({
      name,
      password,
      passwordCheck,
      email,
      phoneNumber,
      introduction,
    });
    response
      .then((res) => {
        if (res.status === SUCCESS.OK) {
          setMessage('성공적으로 회원정보를 수정했습니다.');
          handleModalOpen();
          // history.push('/');
        }
      })
      .catch(() => {
        if (e.response.status === 409) {
          setMessage('이미 가입된 정보입니다.');
          handleModalOpen();
          return;
        }

        if (e.response.status === 400) {
          setMessage('모든 값을 올바르게 입력해주세요.');
          handleModalOpen();
          return;
        }

        setMessage('정보 수정 실패');
        handleModalOpen();
      });
  };

  const onUpdateMemberRoleBySelf = ({ role }) => {
    memberAPI
      .updateMemberRoleBySelf({ role })
      .then((res) => {
        if (res.status === SUCCESS.OK) {
          setMessage('성공적으로 회원 상태를 수정했습니다.');
          handleModalOpen();
        }
      })
      .catch(() => {
        setMessage('회원 상태 수정 실패');
        handleModalOpen();
      });
  };

  const onUpdateAdditionalRoleBySelf = async ({ role, enabled }) => {
    try {
      const response = await memberAPI.updateMyAdditionalRole({ role, enabled });
      if (response.status === SUCCESS.OK) {
        setUserInfo((currentUser) => {
          const additionalRoles = enabled
            ? [...new Set([...(currentUser.additionalRoles || []), role])]
            : (currentUser.additionalRoles || []).filter((existingRole) => existingRole !== role);
          return { ...currentUser, additionalRoles };
        });
        setMessage('추가 역할을 수정했습니다.');
        handleModalOpen();
        return true;
      }
    } catch {
      setMessage('추가 역할 수정 실패');
      handleModalOpen();
    }
    return false;
  };

  const onWithdraw = () => {
    memberAPI
      .updateMemberRoleBySelf({ role: 'QUIT' })
      .then((res) => {
        if (res.status === SUCCESS.OK) {
          alert('성공적으로 풀씨에서 탈퇴했습니다.');
          setTimeout(() => {
            dispatch(logout());
            history.push('/');
          }, 1500);
        }
      })
      .catch(() => {
        setMessage('회원 탈퇴 실패');
        handleModalOpen();
      });
  };

  return (
    <>
      {(userLoading || rolesLoading) && <Spin />}
      {!(userLoading || rolesLoading) && (
        <AuthForm
          type="update"
          onSubmit={onSubmit}
          message={message}
          onChangeMessage={onChangeMessage}
          modalVisible={modalVisible}
          handleModalOpen={handleModalOpen}
          handleModalClose={handleModalClose}
          userInfo={userInfo}
          roles={roles}
          onUpdateMemberRoleBySelf={onUpdateMemberRoleBySelf}
          onUpdateAdditionalRoleBySelf={onUpdateAdditionalRoleBySelf}
          onWithdraw={onWithdraw}
        />
      )}
    </>
  );
};

export default withRouter(MyInfoFormContainer);
