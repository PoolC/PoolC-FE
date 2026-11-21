import { MENU } from '../../../constants/menus';
import getImageVariantUrl from '../../../lib/utils/getImageVariantUrl';
import {
  Card,
  ProjectCardBlock,
  ProjectDescription,
  ProjectGenre,
  GamePlayLink,
  ProjectThumbnail,
  ProjectTitle,
  ProjectTrack,
  StyledLink,
  TextContent,
  ThumbnailContainer,
} from './ProjectCard.styles';

const splitProjectName = (name) => {
  const match = name?.match(/^\[([^\]]+)\]\s*(.+)$/);

  if (!match) {
    return { title: name, track: null };
  }

  return {
    title: match[2],
    track: match[1],
  };
};

const getProjectPlaceholder = (id) => `https://picsum.photos/seed/poolc-project-${id}/480/270`;

const getProjectThumbnail = ({ id, thumbnailURL }) => {
  if (!thumbnailURL) {
    return getProjectPlaceholder(id);
  }

  return getImageVariantUrl(thumbnailURL, 'CARD');
};

const ProjectCard = ({ project, variant = 'default' }) => {
  const { id, thumbnailURL, name, genre, description, gameURL } = project;
  const { title, track } = splitProjectName(name);

  return (
    <ProjectCardBlock data-variant={variant}>
      <Card data-variant={variant}>
        <StyledLink to={`/${MENU.PROJECT}/${id}`}>
          <ThumbnailContainer>
            <ProjectThumbnail
              src={getProjectThumbnail({ id, thumbnailURL })}
              alt={title}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getProjectPlaceholder(id);
              }}
            />
          </ThumbnailContainer>
          <TextContent>
            <ProjectTitle>{title}</ProjectTitle>
            {variant !== 'member-detail' && <>
              <ProjectGenre>
                {track && <ProjectTrack>{track}</ProjectTrack>}
                <span>{genre}</span>
              </ProjectGenre>
              <ProjectDescription>{description}</ProjectDescription>
            </>}
          </TextContent>
        </StyledLink>
        {variant === 'default' && gameURL && (
          <GamePlayLink href={gameURL} target="_blank" rel="noopener noreferrer">
            게임 플레이
          </GamePlayLink>
        )}
      </Card>
    </ProjectCardBlock>
  );
};

export default ProjectCard;
