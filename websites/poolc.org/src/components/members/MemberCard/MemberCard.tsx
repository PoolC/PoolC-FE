import { getProfileImageUrl } from '~/lib/utils/getProfileImageUrl';

import { MemberCardBlock, MemberCardMajor, MemberCardName, MemberCardNameRow, MemberCardStatus, MemberCardText, MemberCardThumbnail, MemberItem, StyledLink } from './MemberCard.styles';
import { MENU } from '~/constants/menus';
import { MEMBER_ROLE } from '~/constants/memberRoles';

const MemberCard = ({
  member: { loginID, name, department, isAdmin, profileImageURL, role, baseRole, additionalRoles },
}: {
  member: {
    loginID: string;
    name: string;
    department: string;
    isAdmin: boolean;
    profileImageURL: string;
    role: string;
    baseRole?: string;
    additionalRoles?: string[];
  };
}) => {
  const memberStatuses = [
    ...(isAdmin && ['ADMIN', 'SUPER_ADMIN'].includes(baseRole || role) ? ['임원진'] : []),
    ...(additionalRoles?.includes(MEMBER_ROLE.TECHNICIAN) || role === MEMBER_ROLE.TECHNICIAN ? ['기여자'] : []),
    ...(baseRole === MEMBER_ROLE.GRADUATED_INACTIVE || role === MEMBER_ROLE.GRADUATED_INACTIVE ? ['졸업 비활동'] : []),
    ...(additionalRoles?.includes(MEMBER_ROLE.GRADUATED) || role === MEMBER_ROLE.GRADUATED ? ['졸업회원'] : []),
  ];

  return (
    <StyledLink to={`/${MENU.MEMBER}/${loginID}`}>
      <MemberCardBlock>
        <MemberItem data-admin={isAdmin}>
          <MemberCardThumbnail src={getProfileImageUrl(profileImageURL)} alt="member_thumbnail" />
          <MemberCardText>
            <MemberCardNameRow>
              <MemberCardName>{name}</MemberCardName>
              {memberStatuses.map((memberStatus) => <MemberCardStatus key={memberStatus}>{memberStatus}</MemberCardStatus>)}
            </MemberCardNameRow>
            <MemberCardMajor>{department}</MemberCardMajor>
          </MemberCardText>
        </MemberItem>
      </MemberCardBlock>
    </StyledLink>
  );
};

export default MemberCard;
