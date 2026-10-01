import { ArrowRightOutlined, FilterOutlined, StarFilled } from '@ant-design/icons';
import { Button, Drawer, Empty, Popover, Select, Spin, Tooltip, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CollectibleDetailModal, { type CollectibleDetail } from '~/components/my-page/CollectibleDetailModal/CollectibleDetailModal';
import { SectionTabs } from '~/components/common/SectionTabs/SectionTabs';
import { Block, WhiteBlock } from '~/styles/common/Block.styles';
import { PageHeader } from '~/components/common/PageHeader/PageHeader';
import { PageContent } from '~/components/common/PageLayout/PageLayout';
import { useMessage } from '~/hooks/useMessage';
import * as gameAPI from '~/lib/api/gamification';
import pokeballImage from '~/assets/images/pokeball.png';
import masterBallImage from '~/assets/images/masterball.png';
import { breakpoints, media } from '~/styles/responsive';

type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

type Summary = {
  ballBalances: BallBalances;
  totalCatalogCount: number;
  shinyCatalogCount: number;
  normalCatalogCount: number;
  shinyDrawStatus: 'AVAILABLE' | 'NEEDS_NORMAL' | 'COMPLETE';
};

type BallBalances = { normal: number; master?: number };

type CollectionItem = {
  collectibleId: number;
  externalId: number;
  name: string;
  generation: number;
  types: string;
  rarity: Rarity;
  spriteUrl?: string;
  shinySpriteUrl?: string;
  cardSpriteUrl?: string;
  shinyCardSpriteUrl?: string;
  category?: string;
  description?: string;
  heightDecimeters?: number;
  weightHectograms?: number;
  abilities?: string;
  hp?: number;
  attack?: number;
  defense?: number;
  specialAttack?: number;
  specialDefense?: number;
  speed?: number;
  normalOwned: boolean;
  shinyOwned: boolean;
  /** Transitional fields returned by a running server before the boolean ownership API is deployed. */
  normalOwnedCount?: number;
  shinyCount?: number;
};

type DrawResult = {
  drawId: number;
  collectibleId: number;
  name: string;
  spriteUrl?: string;
  shinySpriteUrl?: string;
  rarity: Rarity;
  shiny: boolean;
  drawnAt: string;
  ballBalances?: BallBalances;
  externalId?: number;
  isNewCollectible?: boolean;
  category?: string;
  description?: string;
  heightDecimeters?: number;
  weightHectograms?: number;
  abilities?: string;
  hp?: number;
  attack?: number;
  defense?: number;
  specialAttack?: number;
  specialDefense?: number;
  speed?: number;
};

type DetailModalState = {
  collectible: CollectibleDetail;
  title?: string;
  description?: string;
};

type CollectionView = 'ALL' | 'OWNED';

type CollectionCardProps = {
  item: CollectionItem;
  onOpen: (item: CollectionItem) => void;
  cardClassName: string;
  unownedClassName: string;
  shinyCardClassName: string;
  clickableCardClassName: string;
  shinyBadgeClassName: string;
  shinyPreviewClassName: string;
  spriteClassName: string;
  spriteFallbackClassName: string;
  cardMetaClassName: string;
  numberClassName: string;
  cardNameClassName: string;
};

const rarityLabel: Record<Rarity, string> = {
  COMMON: '일반',
  RARE: '레어',
  EPIC: '에픽',
  LEGENDARY: '전설',
};

const rarityColor: Record<Rarity, string> = {
  COMMON: '#6c757d',
  RARE: '#3b82c4',
  EPIC: '#9c5cc6',
  LEGENDARY: '#d59a12',
};

const hasNormalOwned = (item: Pick<CollectionItem, 'normalOwned' | 'normalOwnedCount'>) => item.normalOwned ?? (item.normalOwnedCount ?? 0) > 0;
const hasShinyOwned = (item: Pick<CollectionItem, 'shinyOwned' | 'shinyCount'>) => item.shinyOwned ?? (item.shinyCount ?? 0) > 0;

const CollectionCard = memo(({
  item,
  onOpen,
  cardClassName,
  unownedClassName,
  shinyCardClassName,
  clickableCardClassName,
  shinyBadgeClassName,
  shinyPreviewClassName,
  spriteClassName,
  spriteFallbackClassName,
  cardMetaClassName,
  numberClassName,
  cardNameClassName,
}: CollectionCardProps) => {
  const openCollectible = () => onOpen(item);
  const canOpen = hasNormalOwned(item);
  const shinyOwned = hasShinyOwned(item);

  return (
    <article
      className={[cardClassName, !canOpen && unownedClassName, shinyOwned && shinyCardClassName, canOpen && clickableCardClassName].filter(Boolean).join(' ')}
      onClick={canOpen ? openCollectible : undefined}
      onKeyDown={canOpen ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCollectible();
        }
      } : undefined}
      role={canOpen ? 'button' : undefined}
      tabIndex={canOpen ? 0 : undefined}
    >
      {shinyOwned && <span className={shinyBadgeClassName}><StarFilled /> 이로치</span>}
      {shinyOwned && (item.shinyCardSpriteUrl ?? item.shinySpriteUrl) && <img src={item.shinyCardSpriteUrl ?? item.shinySpriteUrl} alt="" aria-hidden="true" className={shinyPreviewClassName} loading="lazy" decoding="async" />}
      {item.cardSpriteUrl ?? item.spriteUrl ? <img src={item.cardSpriteUrl ?? item.spriteUrl} alt={canOpen ? item.name : '미획득'} className={spriteClassName} loading="lazy" decoding="async" /> : <div className={spriteFallbackClassName} />}
      <div className={cardMetaClassName}>
        <Typography.Text className={numberClassName} style={{ color: canOpen ? rarityColor[item.rarity] : undefined }}>No.{String(item.externalId).padStart(3, '0')}</Typography.Text>
        <Typography.Text className={cardNameClassName}>{canOpen ? item.name : '????'}</Typography.Text>
      </div>
    </article>
  );
});

export default function MyPageCollectionPage() {
  const { styles, cx } = useStyles();
  const message = useMessage();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [draws, setDraws] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState<'NORMAL' | 'SHINY' | null>(null);
  const [exchanging, setExchanging] = useState(false);
  const [drawMenuOpen, setDrawMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoints.compact - 1}px)`).matches);
  const [generation, setGeneration] = useState<number | 'ALL'>('ALL');
  const [rarity, setRarity] = useState<Rarity | 'ALL'>('ALL');
  const [ownership, setOwnership] = useState<CollectionView>('ALL');
  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [summaryResponse, collectionResponse, drawsResponse] = await Promise.all([gameAPI.getGameSummary(), gameAPI.getCollection(), gameAPI.getDrawHistory()]);
      setSummary(summaryResponse.data);
      setCollection(collectionResponse.data);
      setDraws(drawsResponse.data);
    } catch {
      message.error('도감 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoints.compact - 1}px)`);
    const updateViewport = () => setIsMobileViewport(query.matches);
    updateViewport();
    query.addEventListener('change', updateViewport);
    return () => query.removeEventListener('change', updateViewport);
  }, []);

  const generations = useMemo(() => [...new Set(collection.map((item) => item.generation))].sort((a, b) => a - b), [collection]);
  const visibleCollection = useMemo(
    () => collection.filter((item) => (
      (generation === 'ALL' || item.generation === generation)
      && (rarity === 'ALL' || item.rarity === rarity)
      && (ownership === 'ALL' || hasNormalOwned(item))
    )),
    [collection, generation, ownership, rarity],
  );

  const collectedCount = summary?.normalCatalogCount ?? 0;
  const totalCatalogCount = summary?.totalCatalogCount ?? 0;
  const hasSummary = summary !== null;
  const ballCount = summary?.ballBalances?.normal ?? 0;
  const masterBallCount = summary?.ballBalances?.master ?? 0;
  const normalDrawUnavailable = totalCatalogCount > 0 && collectedCount >= totalCatalogCount;
  const shinyDrawStatus = summary?.shinyDrawStatus ?? 'NEEDS_NORMAL';
  const shinyDrawUnavailable = shinyDrawStatus !== 'AVAILABLE';
  const shinyComplete = shinyDrawStatus === 'COMPLETE';
  const shinyDrawDisabled = !summary || drawing !== null || shinyDrawUnavailable || masterBallCount < 1;
  const masterBallExchangeDisabled = !summary || drawing !== null || exchanging || ballCount < 20;
  const drawAgainShiny = Boolean(detailModal?.collectible.shiny);
  const openCollectionItem = useCallback((item: CollectionItem) => {
    setDetailModal({
      collectible: {
        ...item,
        shiny: false,
        shinyOwned: hasShinyOwned(item),
      },
    });
  }, []);
  const handleDraw = async (shiny: boolean) => {
    setDrawing(shiny ? 'SHINY' : 'NORMAL');
    try {
      const response = await gameAPI.drawCollectible({ shiny });
      const draw = response.data as DrawResult;
      const previousCollection = collection.find((item) => item.collectibleId === draw.collectibleId);
      const isNewVariant = draw.shiny
        ? !previousCollection || !hasShinyOwned(previousCollection)
        : !previousCollection || !hasNormalOwned(previousCollection);
      const preparedDraw = {
        ...draw,
        externalId: draw.externalId ?? previousCollection?.externalId,
        shinyOwned: draw.shiny || Boolean(previousCollection && hasShinyOwned(previousCollection)),
      };

      setDetailModal({
        collectible: preparedDraw,
        title: isNewVariant ? draw.shiny ? '이로치 포켓몬 획득!' : '새 포켓몬 획득!' : '이미 수집한 포켓몬이에요',
      });
      setSummary((current) => current && {
        ...current,
        ballBalances: draw.ballBalances ?? current.ballBalances,
        shinyCatalogCount: current.shinyCatalogCount + (draw.shiny && isNewVariant ? 1 : 0),
        normalCatalogCount: current.normalCatalogCount + (!draw.shiny && isNewVariant ? 1 : 0),
        shinyDrawStatus: draw.shiny
          ? (isNewVariant && current.normalCatalogCount === current.shinyCatalogCount + 1 ? 'COMPLETE' : current.shinyDrawStatus)
          : 'AVAILABLE',
      });
      setCollection((current) => current.map((item) => item.collectibleId === draw.collectibleId
        ? draw.shiny
          ? { ...item, shinyOwned: true }
          : { ...item, normalOwned: true }
        : item));
      setDraws((current) => [draw, ...current]);
    } catch (error: any) {
      message.error(error.response?.data?.message ?? '뽑기에 실패했습니다.');
    } finally {
      setDrawing(null);
    }
  };

  const handleExchangeMasterBall = async () => {
    setExchanging(true);
    try {
      const response = await gameAPI.exchangeMasterBall();
      setSummary((current) => current && { ...current, ballBalances: response.data });
      message.success('포켓볼 20개를 마스터볼 1개로 교환했습니다.');
    } catch (error: any) {
      message.error(error.response?.data?.message ?? '마스터볼 교환에 실패했습니다.');
    } finally {
      setExchanging(false);
    }
  };

  const drawMenu = <div className={styles.drawMenu}>
    <Tooltip title={normalDrawUnavailable ? '일반 도감을 모두 완성했습니다.' : '포켓볼 1개로 일반 포켓몬 뽑기'}>
      <Button className={styles.drawMenuButton} type="primary" loading={drawing === 'NORMAL'} disabled={!summary || drawing !== null || normalDrawUnavailable || ballCount < 1} onClick={() => { handleDraw(false); setDrawMenuOpen(false); }}><img src={pokeballImage} alt="" aria-hidden="true" />일반 뽑기 <span>×1 / {ballCount}</span></Button>
    </Tooltip>
    <Tooltip title={shinyDrawUnavailable ? '이로치 뽑기 조건을 충족하지 않았습니다.' : masterBallCount < 1 ? '마스터볼이 부족합니다.' : '마스터볼 1개로 이로치 포켓몬 뽑기'}>
      <Button className={[styles.drawMenuShinyButton, shinyDrawDisabled && styles.drawMenuDisabled].filter(Boolean).join(' ')} loading={drawing === 'SHINY'} disabled={shinyDrawDisabled} onClick={() => { handleDraw(true); setDrawMenuOpen(false); }}><img src={masterBallImage} alt="" aria-hidden="true" />이로치 뽑기 <span>×1 / {masterBallCount}</span></Button>
    </Tooltip>
    <div className={styles.drawMenuExchange}>
      <Button className={[styles.drawMenuExchangeButton, masterBallExchangeDisabled && styles.drawMenuDisabled].filter(Boolean).join(' ')} loading={exchanging} disabled={masterBallExchangeDisabled} onClick={() => { handleExchangeMasterBall(); setDrawMenuOpen(false); }}><img src={pokeballImage} alt="" aria-hidden="true" /><strong>마스터볼 교환</strong><span>20 <ArrowRightOutlined aria-hidden="true" /> 1</span><img src={masterBallImage} alt="" aria-hidden="true" /></Button>
    </div>
  </div>;

  return (
    <Block>
      <WhiteBlock className={styles.whiteBlock}>
        <PageContent className={styles.content}>
          <PageHeader
            className={styles.collectionHeader}
            title={
              <span className={styles.catalogTitle}>
                <span>도감</span>
                <span className={styles.catalogMetrics}>
                  <span>{hasSummary ? <strong>{collectedCount} / {totalCatalogCount}종</strong> : <span className={styles.catalogMetricSkeleton} aria-label="도감 진행도 불러오는 중" />}</span>
                </span>
              </span>
            }
            actions={!isMobileViewport ? <Popover trigger="click" placement="bottomRight" open={drawMenuOpen} onOpenChange={setDrawMenuOpen} content={drawMenu}><Button className={styles.drawTrigger} type="primary">뽑기</Button></Popover> : undefined}
          />

          <Drawer closable={false} destroyOnClose placement="bottom" open={isMobileViewport && drawMenuOpen} onClose={() => setDrawMenuOpen(false)} height="auto" styles={{ header: { display: 'none' }, body: { paddingTop: 16, paddingRight: 20, paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))', paddingLeft: 20 }, mask: { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, width: '100vw', height: '100vh', minHeight: '100dvh', transform: 'translateZ(0)', background: 'rgba(34, 35, 35, 0.42)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' } }}>
            {drawMenu}
          </Drawer>
          {!drawMenuOpen && <Button className={styles.mobileDrawTrigger} type="primary" onClick={() => setDrawMenuOpen(true)}>+ 포켓몬 뽑기</Button>}

          {!loading && collectedCount === 0 && <section className={styles.emptyGuide}>
            <strong>첫 포켓몬을 만나 보세요.</strong>
            <Typography.Text>이번 학기 인정 활동시간이 1시간 쌓이면 포켓볼 1개를 받고 도감을 시작할 수 있어요.</Typography.Text>
          </section>}

          <div className={styles.filters}>
            <SectionTabs
              className={styles.collectionTabs}
              activeKey={ownership}
              onChange={(value) => setOwnership(value as CollectionView)}
              items={[{ key: 'ALL', label: '전체 도감' }, { key: 'OWNED', label: '획득 목록' }]}
            />
            <Popover
              trigger="click"
              placement="bottomLeft"
              content={<div className={styles.filterPanel}>
                <label>세대
                  <Select aria-label="세대 필터" value={generation} onChange={setGeneration} options={[{ value: 'ALL', label: '모든 세대' }, ...generations.map((value) => ({ value, label: `${value}세대` }))]} />
                </label>
                <label>등급
                  <Select aria-label="등급 필터" value={rarity} onChange={setRarity} options={[{ value: 'ALL', label: '모든 등급' }, ...Object.entries(rarityLabel).map(([value, label]) => ({ value, label }))]} />
                </label>
                {(generation !== 'ALL' || rarity !== 'ALL') && <Button type="link" onClick={() => { setGeneration('ALL'); setRarity('ALL'); }}>초기화</Button>}
              </div>}
            >
              <Tooltip title="상세 필터">
                <Button aria-label="상세 필터" icon={<FilterOutlined />} className={cx(styles.filterButton, { [styles.activeFilter]: generation !== 'ALL' || rarity !== 'ALL' })} />
              </Tooltip>
            </Popover>
          </div>

          {loading ? <Spin /> : visibleCollection.length === 0 ? <Empty description="표시할 도감이 없습니다." /> : (
            <div className={styles.grid}>
            {visibleCollection.map((item) => (
              <CollectionCard
                key={item.collectibleId}
                item={item}
                onOpen={openCollectionItem}
                cardClassName={styles.card}
                unownedClassName={styles.unowned}
                shinyCardClassName={styles.shinyCard}
                clickableCardClassName={styles.clickableCard}
                shinyBadgeClassName={styles.shinyBadge}
                shinyPreviewClassName={styles.shinyPreview}
                spriteClassName={styles.sprite}
                spriteFallbackClassName={styles.spriteFallback}
                cardMetaClassName={styles.cardMeta}
                numberClassName={styles.number}
                cardNameClassName={styles.cardName}
              />
            ))}
            </div>
          )}

          <section className={styles.history}>
          <Typography.Title level={4}>최근 뽑기</Typography.Title>
          {draws.length === 0 ? <Typography.Text className={styles.historyEmpty}>아직 뽑기 기록이 없습니다.</Typography.Text> : (
            <div className={styles.historyList}>
              {draws.slice(0, 5).map((draw) => (
                <div className={styles.historyItem} key={draw.drawId}>
                  <span>{draw.shiny ? '이로치' : rarityLabel[draw.rarity]}</span>
                  <strong>{draw.name}</strong>
                  <time>{new Date(draw.drawnAt).toLocaleDateString()}</time>
                </div>
              ))}
            </div>
          )}
          </section>
        </PageContent>
      </WhiteBlock>

      <CollectibleDetailModal
        collectible={detailModal?.collectible ?? null}
        title={detailModal?.title}
        description={detailModal?.description}
        onClose={() => setDetailModal(null)}
        onDrawAgain={detailModal?.title ? () => handleDraw(drawAgainShiny) : undefined}
        drawAgainShiny={drawAgainShiny}
        drawAgainLoading={drawing === (drawAgainShiny ? 'SHINY' : 'NORMAL')}
        drawAgainDisabled={drawAgainShiny ? shinyDrawDisabled : !summary || drawing !== null || normalDrawUnavailable || ballCount < 1}
        remainingBallCount={drawAgainShiny ? masterBallCount : ballCount}
      />
    </Block>
  );
}

const useStyles = createStyles(({ css }) => ({
  whiteBlock: css`box-sizing:border-box; padding:30px 20px; align-items:center;`,
  content: css`max-width:1180px; ${media.mobile}{padding-bottom:calc(76px + env(safe-area-inset-bottom, 0px));}`,
  collectionHeader: css`margin-bottom:18px; ${media.mobile}{gap:12px; margin-bottom:14px; > div:first-of-type{gap:4px;} h2{font-size:1.75rem;}}`,
  catalogTitle: css`display:inline-flex; align-items:center; gap:18px; ${media.mobile}{flex-direction:column; gap:4px;}`,
  catalogMetrics: css`display:inline-flex; align-items:center; color:#737c77; font-size:.82rem; font-weight:600; font-variant-numeric:tabular-nums; white-space:nowrap; > span{display:inline-flex; align-items:center;} strong{min-width:108px; color:#249b78; font-size:.9rem; text-align:center;} ${media.mobile}{strong{font-size:1rem;}}`,
  catalogMetricSkeleton: css`display:inline-flex; width:108px; height:18px; border-radius:4px; background:#e7efed;`,
  drawTrigger: css`min-height:36px; padding:0 14px; font-size:.8rem; font-weight:700; ${media.mobile}{min-height:40px;}`,
  mobileDrawTrigger: css`display:none; ${media.mobile}{position:fixed; right:0; bottom:0; left:0; z-index:20; display:inline-flex; width:100%; min-height:calc(64px + env(safe-area-inset-bottom, 0px)); align-items:center; justify-content:center; padding:0 20px env(safe-area-inset-bottom, 0px); border-radius:0; background:#49bf9e; color:#fff; font-size:1rem; font-weight:800; &:hover,&:focus{background:#49bf9e !important; color:#fff !important;}}`,
  drawMenu: css`display:flex; width:248px; flex-direction:column; gap:8px; ${media.mobile}{width:100%;}`,
  drawMenuButton: css`display:flex; align-items:center; justify-content:flex-start; gap:7px; height:44px; padding:0 12px; font-weight:700; img{width:22px; height:22px; object-fit:contain;} span{margin-left:auto;}`,
  drawMenuShinyButton: css`display:flex; align-items:center; justify-content:flex-start; gap:7px; height:44px; padding:0 12px; border-color:#d9c7a0 !important; color:#8d6810 !important; font-weight:700; img{width:22px; height:22px; object-fit:contain;} span{margin-left:auto;}`,
  drawMenuExchange: css`margin-top:2px; padding-top:9px; border-top:1px solid #edf0ef;`,
  drawMenuExchangeButton: css`display:flex; width:100%; align-items:center; gap:5px; height:42px; padding:0 10px; border-color:#d9c7a0 !important; color:#765419 !important; strong{font-size:.76rem;} span{display:inline-flex; align-items:center; gap:2px; margin-left:auto; font-size:.74rem; font-weight:700;} img{width:18px; height:18px; object-fit:contain;}`,
  drawMenuDisabled: css`&&, &&:hover, &&:focus{border-color:#d9dddb !important; background:#eef0ef !important; color:#a0a6a3 !important; box-shadow:none !important; cursor:not-allowed;} && span, && strong{color:inherit !important;} && img{filter:grayscale(1); opacity:.45;}`,
  emptyGuide: css`display:flex; flex-direction:column; gap:4px; padding:14px 16px; margin:0 0 18px; border-left:3px solid #49bf9e; background:#f8fcfb; strong{color:#276f59;} .ant-typography{font-size:.82rem; color:#6e7772;}`,
  filters: css`display:flex; align-items:center; gap:8px; margin-bottom:18px; border-bottom:1px solid rgba(76, 55, 34, .08); ${media.mobile}{min-height:44px; gap:12px;}`,
  collectionTabs: css`width:auto; flex:none; min-width:0; .ant-tabs-nav{margin:0; border-bottom:0;} .ant-tabs-tab{padding:12px 0 14px;} ${media.mobile}{flex:1; .ant-tabs-nav-wrap{overflow:visible;} .ant-tabs-tab{display:flex; min-height:44px; align-items:center; padding:0 0 2px;}}`,
  filterPanel: css`display:flex; width:180px; flex-direction:column; gap:12px; label{display:flex; flex-direction:column; gap:5px; color:#69716d; font-size:.78rem; font-weight:700;} .ant-btn{align-self:flex-start; padding:0;}`,
  filterButton: css`width:44px; height:44px; padding:0; flex:none;`,
  activeFilter: css`border-color:#49bf9e !important; color:#249b78 !important;`,
  grid: css`display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:12px;`,
  card: css`position:relative; display:flex; min-height:172px; flex-direction:column; justify-content:space-between; padding:10px; border:1px solid #e2e5e4; border-radius:4px; background:#fff; transition:border-color .15s ease, box-shadow .15s ease; &:hover{border-color:#9edbc9; box-shadow:0 4px 12px rgba(39, 112, 88, .08);}`,
  unowned: css`background:#f6f7f7; img{filter:brightness(0) opacity(.22);}`,
  shinyCard: css`border-color:#e6c76a;`,
  shinyBadge: css`position:absolute; top:8px; right:8px; z-index:1; display:inline-flex; align-items:center; gap:3px; padding:3px 5px; border:1px solid #e6c76a; border-radius:3px; background:#fffaf0; color:#9b720e; font-size:.62rem; font-weight:800; line-height:1;`,
  shinyPreview: css`position:absolute; right:8px; bottom:34px; z-index:1; width:40px; height:40px; padding:3px; border:1px solid #e6c76a; border-radius:4px; background:#fffaf0; object-fit:contain;`,
  clickableCard: css`cursor:pointer; &:focus-visible{outline:2px solid #49bf9e; outline-offset:2px;}`,
  sprite: css`width:112px; height:112px; object-fit:contain; align-self:center; flex:1 0 auto; min-height:0;`,
  spriteFallback: css`width:112px; height:112px; background:#edf0ef; border-radius:50%; align-self:center; flex:1 0 auto;`,
  cardMeta: css`display:flex; min-width:0; align-items:baseline; justify-content:center; gap:5px; padding-top:8px; border-top:1px solid #f1f3f5; white-space:nowrap;`,
  number: css`flex:none; font-size:.7rem; font-weight:700; color:#8b918e;`,
  cardName: css`overflow:hidden; color:#495057; font-size:.76rem; font-weight:700; text-overflow:ellipsis;`,
  history: css`margin-top:34px; h4{margin-bottom:12px !important; color:#4c3722 !important;}`,
  historyEmpty: css`color:#7b736a;`,
  historyList: css`border-top:1px solid #e5f0ed;`,
  historyItem: css`display:grid; grid-template-columns:72px 1fr auto; gap:12px; align-items:center; padding:11px 0; border-bottom:1px solid #e5f0ed; span{font-size:.78rem; color:#249b78; font-weight:700;} strong{color:#4c3722;} time{font-size:.78rem; color:#7b736a;}`,
}));
