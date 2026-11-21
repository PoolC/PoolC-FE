import poolcIcon from '~/assets/images/poolc-icon.png';
import {
  GameFrame,
  GameModal,
  GameModalIcon,
  GameModalTitle,
} from './ProjectGameModal.styles';

const ProjectGameModal = ({ name, gameURL, open, onClose }) => (
  <GameModal
    title={(
      <GameModalTitle>
        <GameModalIcon src={poolcIcon} alt="PoolC" />
        <span>{name}</span>
      </GameModalTitle>
    )}
    open={open}
    onCancel={onClose}
    footer={null}
    centered
    destroyOnClose
    width="min(1200px, calc(100vw - 32px), 160vh)"
  >
    <GameFrame
      title={`${name} 게임`}
      src={gameURL}
      sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-fullscreen"
      allow="fullscreen; autoplay; gamepad"
      allowFullScreen
      referrerPolicy="no-referrer"
    />
  </GameModal>
);

export default ProjectGameModal;
