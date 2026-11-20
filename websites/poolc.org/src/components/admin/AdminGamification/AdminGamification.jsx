import { InputNumber, Pagination, Select, Spin, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { useEffect, useState } from 'react';
import { useMessage } from '~/hooks/useMessage';
import * as gameAPI from '~/lib/api/gamification';
import * as memberAPI from '~/lib/api/member';
import { WhiteNarrowBlock } from '~/styles/common/Block.styles';
import ActionButton from '../../common/Buttons/ActionButton';

export default function AdminGamification() {
  const { styles } = useStyles();
  const message = useMessage();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [members, setMembers] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [history, setHistory] = useState([]);
  const [ballHistory, setBallHistory] = useState([]);
  const [ballHistoryPage, setBallHistoryPage] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [collectibleId, setCollectibleId] = useState('');
  const [shiny, setShiny] = useState(false);
  const [ballRecipient, setBallRecipient] = useState('');
  const [ballType, setBallType] = useState('NORMAL');
  const [ballAmount, setBallAmount] = useState(1);
  const [granting, setGranting] = useState(false);
  const [grantingBalls, setGrantingBalls] = useState(false);

  const loadLatest = async () => {
    try {
      const response = await gameAPI.getLatestCatalogSync();
      setRun(response.status === 204 ? null : response.data);
    } catch (error) {
      if (error.response?.status !== 404) message.error('동기화 상태를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatest();
    Promise.all([memberAPI.getMembers(), gameAPI.getAdminCatalog(), gameAPI.getPokemonGrantHistory(), gameAPI.getBallGrantHistory()])
      .then(([memberResponse, catalogResponse, historyResponse, ballHistoryResponse]) => {
        setMembers(memberResponse.data.data || []);
        setCatalog(catalogResponse.data || []);
        setHistory(historyResponse.data || []);
        setBallHistory(ballHistoryResponse.data || []);
      })
      .catch((error) => message.error(error.response?.data?.message ?? '포켓몬 지급 정보를 불러오지 못했습니다.'));
  }, []);

  useEffect(() => {
    if (run?.status !== 'RUNNING') return undefined;
    const timer = window.setInterval(loadLatest, 3000);
    return () => window.clearInterval(timer);
  }, [run?.status]);

  const startSync = async () => {
    setStarting(true);
    try {
      const response = await gameAPI.startCatalogSync();
      setRun(response.data);
      message.success('도감 동기화를 시작했습니다.');
    } catch (error) {
      message.error(error.response?.data?.message ?? '도감 동기화를 시작하지 못했습니다.');
    } finally {
      setStarting(false);
    }
  };

  const grantPokemon = async () => {
    if (!recipient || !collectibleId) return;
    setGranting(true);
    try {
      await gameAPI.grantPokemon({ loginID: recipient, collectibleId: Number(collectibleId), shiny });
      message.success('포켓몬을 지급했습니다.');
      setHistory((await gameAPI.getPokemonGrantHistory()).data || []);
    } catch (error) {
      message.error(error.response?.data?.message ?? '포켓몬 지급에 실패했습니다.');
    } finally {
      setGranting(false);
    }
  };

  const grantBalls = async () => {
    if (!ballRecipient || !ballType || !ballAmount || ballAmount < 1) return;
    setGrantingBalls(true);
    try {
      await gameAPI.grantBalls({ loginID: ballRecipient, ballType, amount: ballAmount });
      message.success(`${ballType === 'MASTER' ? '마스터볼' : '포켓볼'} ${ballAmount}개를 지급했습니다.`);
      setBallHistory((await gameAPI.getBallGrantHistory()).data || []);
      setBallHistoryPage(1);
    } catch (error) {
      message.error(error.response?.data?.message ?? '포켓볼 지급에 실패했습니다.');
    } finally {
      setGrantingBalls(false);
    }
  };

  return (
    <WhiteNarrowBlock>
      <section className={styles.grantSection}>
        <h2 className={styles.title}>포켓몬 지급</h2>
        <div className={styles.grantForm}>
          <label>회원
            <Select
              showSearch
              allowClear
              placeholder="회원 선택"
              optionFilterProp="label"
              value={recipient || undefined}
              onChange={(value) => setRecipient(value || '')}
              options={members.map((member) => ({
                value: member.loginID,
                label: `${member.name || member.loginID} (${member.loginID})`,
              }))}
              style={{ width: '100%' }}
            />
          </label>
          <label>포켓몬
            <Select
              showSearch
              allowClear
              placeholder="포켓몬 선택"
              optionFilterProp="label"
              value={collectibleId || undefined}
              onChange={(value) => setCollectibleId(value || '')}
              options={catalog.map((pokemon) => ({
                value: String(pokemon.collectibleId),
                label: `#${pokemon.externalId} ${pokemon.name} · ${pokemon.rarity}`,
              }))}
              style={{ width: '100%' }}
            />
          </label>
          <label className={styles.shinyToggle}><input type="checkbox" checked={shiny} onChange={(event) => setShiny(event.target.checked)} /> 이로치로 지급</label>
          <ActionButton disabled={!recipient || !collectibleId || granting} onClick={grantPokemon}>{granting ? '지급 중…' : '지급하기'}</ActionButton>
        </div>
      </section>
      <section className={styles.grantSection}>
        <h2 className={styles.title}>포켓볼 지급</h2>
        <div className={styles.grantForm}>
          <label>회원
            <Select
              showSearch
              allowClear
              placeholder="회원 선택"
              optionFilterProp="label"
              value={ballRecipient || undefined}
              onChange={(value) => setBallRecipient(value || '')}
              options={members.map((member) => ({
                value: member.loginID,
                label: `${member.name || member.loginID} (${member.loginID})`,
              }))}
              style={{ width: '100%' }}
            />
          </label>
          <label>종류
            <Select
              value={ballType}
              onChange={setBallType}
              options={[{ value: 'NORMAL', label: '포켓볼' }, { value: 'MASTER', label: '마스터볼' }]}
              style={{ width: '100%' }}
            />
          </label>
          <label>수량
            <InputNumber min={1} precision={0} value={ballAmount} onChange={(value) => setBallAmount(value || 1)} style={{ width: '100%' }} />
          </label>
          <ActionButton disabled={!ballRecipient || grantingBalls} onClick={grantBalls}>{grantingBalls ? '지급 중…' : '지급하기'}</ActionButton>
        </div>
      </section>
      <section className={styles.historySection}>
        <h2 className={styles.title}>포켓볼 지급 기록</h2>
        {ballHistory.length === 0 ? <div className={styles.emptyState}>포켓볼 지급 기록이 없습니다.</div> : (
          <div className={styles.historyList}>
            {ballHistory.slice((ballHistoryPage - 1) * 20, ballHistoryPage * 20).map((entry) => (
              <article className={`${styles.historyItem} ${styles.ballHistoryItem}`} key={entry.transactionId}>
                <div><strong>{entry.memberName || entry.memberLoginID}</strong><span>{entry.ballType === 'MASTER' ? '마스터볼' : '포켓볼'} {entry.amount}개</span></div>
                <div><span>{entry.grantorName || '관리자'}</span><small>{entry.grantSource === 'LEGACY_SQL' ? '기존 SQL 지급' : '관리자 지급'}</small></div>
                <time>{new Date(entry.grantedAt).toLocaleString()}</time>
              </article>
            ))}
          </div>
        )}
        {ballHistory.length > 20 && <Pagination current={ballHistoryPage} pageSize={20} total={ballHistory.length} showSizeChanger={false} onChange={setBallHistoryPage} className={styles.historyPagination} />}
      </section>
      <section className={styles.historySection}>
        <h2 className={styles.title}>지급 기록</h2>
        {history.length === 0 ? <div className={styles.emptyState}>지급 기록이 없습니다.</div> : (
          <div className={styles.historyList}>
            {history.map((entry) => (
              <article className={styles.historyItem} key={entry.drawId}>
                {entry.spriteUrl && <img src={entry.spriteUrl} alt="" />}
                <div><strong>{entry.memberName || entry.memberLoginID}</strong><span>{entry.pokemonName}{entry.shiny ? ' (이로치)' : ''}</span></div>
                <div><span>{entry.grantorName}</span><small>{entry.grantSource === 'LEGACY_SQL' ? '기존 SQL 지급' : entry.grantSource === 'ADMIN' ? '관리자 지급' : '일반 뽑기'}</small></div>
                <time>{new Date(entry.grantedAt).toLocaleString()}</time>
              </article>
            ))}
          </div>
        )}
      </section>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>도감 관리</h2>
          <p className={styles.description}>전 세대 수집 대상을 PokeAPI에서 동기화합니다.</p>
        </div>
        <ActionButton className={styles.syncButton} disabled={starting || run?.status === 'RUNNING'} onClick={startSync}>동기화 실행</ActionButton>
      </header>
      {loading ? <Spin /> : !run ? <div className={styles.emptyState}>아직 동기화한 도감이 없습니다.</div> : (
        <div className={styles.status}>
          <div><span>상태</span><Tag color={run.status === 'COMPLETED' ? 'green' : run.status === 'FAILED' ? 'red' : 'blue'}>{run.status}</Tag></div>
          <div><span>처리한 종</span><strong>{run.processedCount}종</strong></div>
          <div><span>시작</span><strong>{new Date(run.startedAt).toLocaleString()}</strong></div>
          {run.completedAt && <div><span>완료</span><strong>{new Date(run.completedAt).toLocaleString()}</strong></div>}
          {run.message && <Typography.Text type="danger">{run.message}</Typography.Text>}
        </div>
      )}
    </WhiteNarrowBlock>
  );
}

const useStyles = createStyles(({ css }) => ({
  grantSection: css`width:100%; margin-bottom:32px;`,
  grantForm: css`display:grid; grid-template-columns:1fr 1fr auto auto; align-items:end; gap:12px; margin-top:16px; label{display:flex; flex-direction:column; gap:7px; color:#6d6258; font-size:.82rem; font-weight:600;} @media(max-width:767px){grid-template-columns:1fr;}`,
  shinyToggle: css`flex-direction:row!important; align-items:center; min-height:42px; white-space:nowrap; input{accent-color:#db6c58;}`,
  historySection: css`width:100%; margin-bottom:32px;`,
  historyList: css`display:flex; flex-direction:column; margin-top:14px; border-top:1px solid #e9e3de;`,
  historyItem: css`display:grid; grid-template-columns:48px 1fr 1fr auto; align-items:center; gap:12px; min-height:64px; border-bottom:1px solid #eee9e5; color:#4c3722; img{width:44px;height:44px;object-fit:contain;} div{display:flex;flex-direction:column;gap:3px;} span{font-size:.86rem;} small,time{color:#857b72;font-size:.75rem;} @media(max-width:767px){grid-template-columns:40px 1fr 1fr; time{grid-column:2/-1;}}`,
  ballHistoryItem: css`grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto; @media(max-width:767px){grid-template-columns:1fr 1fr; time{grid-column:1/-1;}}`,
  historyPagination: css`display:flex; justify-content:flex-end; margin-top:16px;`,
  header: css`display:flex; width:100%; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:18px; @media (max-width: 767px){align-items:stretch; flex-direction:column;}`,
  title: css`margin:0; color:#4c3722; font-size:1.75rem; font-weight:800; line-height:1.25;`,
  description: css`margin:8px 0 0; color:#827971; font-size:.85rem; line-height:1.45;`,
  syncButton: css`margin:0;`,
  emptyState: css`width:100%; padding:42px 20px; border:1px solid rgba(76,55,34,.12); border-radius:8px; color:#827971; font-size:.9rem; text-align:center; box-sizing:border-box;`,
  status: css`display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:1px; overflow:hidden; border:1px solid #e5f0ed; border-radius:8px; background:#e5f0ed; > div{display:flex; flex-direction:column; gap:8px; min-height:96px; padding:16px; background:#fff;} span{font-size:.8rem; color:#7b736a;} strong{color:#4c3722;} @media (max-width: 767px){grid-template-columns:1fr;}`,
}));
