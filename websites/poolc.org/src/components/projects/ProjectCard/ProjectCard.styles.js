import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import colors from '../../../lib/styles/colors';

export const ProjectCardBlock = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 0;
  aspect-ratio: 29 / 30;
  margin: 0;

  &[data-variant='home'] {
    width: 260px;
    height: 260px;
    min-height: 260px;
    margin: 10px;
  }

  &[data-variant='home']:first-of-type {
    margin-left: 0;
  }

  &[data-variant='member-detail'] {
    height: 262px;
    aspect-ratio: auto;
  }
`;

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${colors.mint[0]};
  border-radius: 12px;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 10px ${colors.gray[1]};
  padding: 10px;
  cursor: pointer;
  box-sizing: border-box;
  transition: 0.3s;

  &:hover {
    box-shadow: 0 8px 18px ${colors.gray[2]};
    transform: translateY(-2px);
    transition: 0.3s;
  }

  &[data-variant='home'] {
    align-items: center;
    width: 260px;
    height: 250px;
    padding: 10px 0;
    border-radius: 12px;
  }

  &[data-variant='home']:hover {
    opacity: 80%;
    box-shadow: 0px 0px 10px ${colors.gray[1]};
    transform: none;
  }

  &[data-variant='member-detail'] {
    height: 262px;
    padding: 10px;
  }
`;

export const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;

  [data-variant='home'] & {
    width: 240px;
    height: 120px;
    aspect-ratio: auto;
    border-radius: 8px;
  }

  [data-variant='member-detail'] & {
    flex: 1;
    height: auto;
    aspect-ratio: auto;
  }
`;

export const ProjectThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  [data-variant='home'] & {
    width: 240px;
    height: 120px;
  }

  [data-variant='member-detail'] & {
    height: auto;
  }
`;

export const TextContent = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  padding-top: 10px;

  [data-variant='home'] & {
    width: 230px;
    height: 110px;
    flex: 0 0 auto;
    padding-top: 8px;
  }

  [data-variant='member-detail'] & {
    flex: 0 0 auto;
    padding-top: 8px;
  }
`;

export const ProjectTitle = styled.p`
  display: -webkit-box;
  min-height: 44px;
  margin: 0 0 6px;
  overflow: hidden;
  color: ${colors.brown[1]};
  font-size: 1.03rem;
  font-weight: 600;
  line-height: 1.35;
  word-break: keep-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  [data-variant='home'] & {
    display: block;
    min-height: 24px;
    margin: 0 0 4px;
    font-size: 1.2rem;
    line-height: 1.25;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }

  [data-variant='member-detail'] & {
    display: block;
    min-height: 20px;
    margin: 0;
    overflow: hidden;
    font-size: 0.95rem;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1;
  }
`;

export const ProjectGenre = styled.p`
  display: flex;
  min-height: 18px;
  align-items: center;
  gap: 6px;
  margin: 0 0 7px;
  overflow: hidden;
  color: ${colors.brown[0]};
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
  white-space: nowrap;

  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [data-variant='home'] & {
    width: 230px;
    min-height: 18px;
    margin: 0 0 4px;
    font-size: 0.8rem;
  }
`;

export const ProjectTrack = styled.span`
  flex: 0 0 auto;
  max-width: 112px;
  overflow: hidden;
  border-radius: 6px;
  background-color: #ffffff;
  color: ${colors.mint[3]};
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.35;
  padding: 2px 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProjectDescription = styled.p`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: ${colors.brown[1]};
  font-size: 0.75rem;
  font-weight: 300;
  word-break: keep-all;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  [data-variant='home'] & {
    width: 230px;
    margin: 0;
    font-size: 0.7rem;
    line-height: 1rem;
    -webkit-line-clamp: 2;
  }
`;

export const StyledLink = styled(Link)`
  display: flex;
  width: 100%;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  color: ${colors.brown[1]};
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

export const GamePlayLink = styled.a`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  background: rgba(28, 52, 46, 0.86);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(4px);
  transition: background 0.18s ease, transform 0.18s ease;

  svg { font-size: 0.95rem; }

  &:hover {
    color: #fff;
    background: ${colors.mint[3]};
    transform: translateY(-1px);
    text-decoration: none;
  }

  [data-variant='home'] &,
  [data-variant='member-detail'] & {
    display: none;
  }
`;
