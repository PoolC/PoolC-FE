import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
// FIXME: eslint issue 수정 필요. 터미널에서는 에러가 나지 않으나, 에디터에서만 에러가 나고 있음
// eslint-disable-next-line import/no-extraneous-dependencies
import { Viewer } from '@dialga/react-editor';
import MemberCard from '../../members/MemberCard/MemberCard';
import {
  BodyContainer,
  Duration,
  GameActions,
  GamePlayButton,
  GameNewTabLink,
  DownloadButton,
  Hero,
  ImageContainer,
  Introduction,
  IntroductionContainer,
  Meta,
  MetaGenre,
  MemberContainer,
  Members,
  Name,
  NameContainer,
  StyledImage,
  TextContainer,
} from './ProjectDetail.styles';
import ProjectGameModal from '../ProjectGameModal/ProjectGameModal';
import { PagePanel, PageShell } from '../../common/PageLayout/PageLayout';
import getImageVariantUrl from '../../../lib/utils/getImageVariantUrl';
import { isAuthorizedRole } from '../../../lib/utils/checkRole';

const getProjectPlaceholder = (id) => `https://picsum.photos/seed/poolc-project-detail-${id}/1200/675`;

const getProjectThumbnail = ({ id, thumbnailURL }) => {
  if (!thumbnailURL) {
    return getProjectPlaceholder(id);
  }

  return getImageVariantUrl(thumbnailURL, 'DETAIL');
};

const normalizeProjectBody = (body) =>
  (body ?? '')
    .replace(/(드라이브 링크\s*:\s*)(https?:\/\/\S+)/g, '[$1]($2)')
    .replace(/(^|\s)(https?:\/\/\S+)/g, (match, prefix, url) => {
      if (match.includes('](')) {
        return match;
      }

      return `${prefix}[결과물 보기](${url})`;
    });

const ProjectDetail = ({ project, member }) => {
  const { id, thumbnailURL, name, genre, duration, body, members, gameURL, downloadURL } = project;
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const projectMembers = members ?? [];

  const {
    status: { isLogin },
    user: { role },
  } = member;
  const canViewProjectMembers = isLogin && isAuthorizedRole(role);

  return (
    <PageShell>
      <PagePanel>
        <Hero>
          <ImageContainer>
            <StyledImage
              src={getProjectThumbnail({ id, thumbnailURL })}
              alt={name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getProjectPlaceholder(id);
              }}
            />
            {gameURL && (
              <GameActions>
                <GamePlayButton type="button" onClick={() => setIsGameModalOpen(true)}>
                  플레이하기
                </GamePlayButton>
                <GameNewTabLink href={gameURL} target="_blank" rel="noopener noreferrer">
                  새 탭에서 플레이하기
                </GameNewTabLink>
              </GameActions>
            )}
          </ImageContainer>
          <TextContainer>
            <NameContainer>
              <Name>{name}</Name>
              {downloadURL && (
                <DownloadButton
                  href={downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="다운로드"
                  title="다운로드"
                >
                  <DownloadOutlined aria-hidden="true" />
                </DownloadButton>
              )}
            </NameContainer>
            <Meta>
              <MetaGenre>{genre}</MetaGenre>
              <span aria-hidden="true">·</span>
              <Duration>{duration}</Duration>
            </Meta>
          </TextContainer>
        </Hero>
        {gameURL && <ProjectGameModal name={name} gameURL={gameURL} open={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} />}
        <IntroductionContainer>
          <Introduction>
            <BodyContainer className="here">
              <Viewer initialValue={normalizeProjectBody(body)} key={body} />
            </BodyContainer>
          </Introduction>
        </IntroductionContainer>
        {canViewProjectMembers && projectMembers.length > 0 && (
          <MemberContainer>
            <h2>
              참여 멤버 <span>{projectMembers.length}</span>
            </h2>
            <Members>
              {projectMembers.map((member) => (
                <MemberCard key={member.loginID} member={member} />
              ))}
            </Members>
          </MemberContainer>
        )}
      </PagePanel>
    </PageShell>
  );
};

export default ProjectDetail;
