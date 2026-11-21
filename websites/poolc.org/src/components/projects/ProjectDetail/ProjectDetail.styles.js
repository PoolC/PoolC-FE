import styled from '@emotion/styled';
import { Modal } from 'antd';
import colors from '../../../lib/styles/colors';
import { media } from '../../../styles/responsive';

export const Hero = styled.div`
  display: flex;
  width: min(90%, 1200px);
  flex-direction: column;
  align-items: center;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 560px;
  overflow: hidden;
  border-radius: 16px;
  background-color: ${colors.mint[0]};
`;

export const StyledImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const TextContainer = styled.div`
  display: flex;
  width: min(100%, 860px);
  flex-direction: column;
  align-items: center;
  padding: 34px 0 24px;
  text-align: center;

  ${media.mobile} {
    padding: 26px 0 20px;
  }
`;

export const NameContainer = styled.div`
  display: flex;
  max-width: 100%;
`;

export const Name = styled.h1`
  margin: 0;
  color: ${colors.brown[1]};
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.25;
  word-break: keep-all;

  ${media.mobile} {
    font-size: 1.55rem;
  }
`;

export const Meta = styled.div`
  display: flex;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  color: ${colors.brown[0]};
  font-size: 0.96rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;

  ${media.mobile} {
    flex-wrap: wrap;
    margin-top: 10px;
    font-size: 0.88rem;
  }
`;

export const MetaGenre = styled.span`
  color: ${colors.brown[1]};
  font-weight: 600;
`;

export const Duration = styled.span`
  color: ${colors.brown[0]};
`;

export const IntroductionContainer = styled.div`
  display: flex;
  width: min(90%, 860px);
  justify-content: center;
`;

export const Introduction = styled.div`
  width: 100%;
  color: ${colors.brown[1]};
`;

export const BodyContainer = styled.div`
  width: 100%;
  color: ${colors.brown[1]};
  font-size: 0.96rem;
  font-weight: 300;
  line-height: 1.75;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: anywhere;

  p,
  ul,
  ol {
    margin: 0.7rem 0;
    color: ${colors.brown[1]};
    font-size: 0.96rem;
    font-weight: 300;
    line-height: 1.75;
  }

  ul,
  ol {
    padding-left: 1.35rem;
  }

  li + li {
    margin-top: 0.35rem;
  }

  strong {
    font-weight: 700;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1.4rem 0 0.7rem;
    color: ${colors.brown[1]};
    font-weight: 700;
    line-height: 1.4;
  }

  hr {
    margin: 1.25rem 0;
    border: 0;
    border-top: 1px solid ${colors.gray[2]};
  }

  img {
    display: block;
    max-width: 100%;
    margin: 1rem auto;
    border-radius: 12px;
  }

  a {
    color: ${colors.mint[3]};
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    overflow-wrap: anywhere;
  }

  a:hover {
    color: ${colors.brown[1]};
  }
`;

export const MemberContainer = styled.section`
  display: flex;
  width: min(90%, 960px);
  flex-direction: column;
  margin-top: 46px;

  h2 {
    margin: 0 0 18px;
    color: ${colors.brown[1]};
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.4;
    text-align: center;
  }

  h2 span {
    margin-left: 6px;
    color: ${colors.brown[0]};
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export const Members = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, 250px);
  justify-content: center;
  gap: 10px;
`;

export const GameFrame = styled.iframe`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  background: #111;
`;

export const GameModal = styled(Modal)`
  .ant-modal-content {
    overflow: hidden;
    padding: 0;
  }

  .ant-modal-header {
    margin: 0;
    padding: 16px 24px;
  }

  .ant-modal-body {
    padding: 0;
    line-height: 0;
  }
`;

export const GameModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GameModalIcon = styled.img`
  display: block;
  width: 22px;
  height: 24px;
  object-fit: contain;
`;

export const GameActions = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  pointer-events: none;

  ${media.mobile} {
    gap: 8px;
    row-gap: 8px;
  }
`;

export const GamePlayButton = styled.button`
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 10px;
  background: ${colors.mint[2]};
  color: #fff;
  font: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  transition: opacity 0.18s ease;
  pointer-events: auto;

  &:hover { color: #fff; opacity: 0.84; }

  ${media.mobile} {
    min-height: 44px;
    padding: 0 16px;
    font-size: 0.88rem;
  }
`;

export const GameNewTabLink = styled.a`
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border: 1px solid rgba(255, 255, 255, 0.84);
  border-radius: 10px;
  background: rgba(28, 52, 46, 0.86);
  color: #fff;
  font-size: 0.98rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(4px);
  pointer-events: auto;

  &:hover { color: #fff; background: rgba(28, 52, 46, 0.96); }

  ${media.mobile} {
    min-height: 44px;
    padding: 0 16px;
    font-size: 0.88rem;
  }
`;
