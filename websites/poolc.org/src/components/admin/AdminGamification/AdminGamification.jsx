import { Input, InputNumber, Pagination, Select, Spin, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { MEMBER_ROLE } from '~/constants/memberRoles';
import { useMessage } from '~/hooks/useMessage';
import * as gameAPI from '~/lib/api/gamification';
import * as memberAPI from '~/lib/api/member';
import { WhiteNarrowBlock } from '~/styles/common/Block.styles';
import ActionButton from '../../common/Buttons/ActionButton';
import { ProjectListRow, ProjectTable, ProjectTableContainer, TableHead } from '../AdminProject/AdminProject.styles';

export default function AdminGamification() {
  const { styles } = useStyles();
  const message = useMessage();
  const { memberId, role, additionalRoles } = useSelector((state) => state.auth.user);
  const canGrant = role === MEMBER_ROLE.TECHNICIAN || additionalRoles?.includes(MEMBER_ROLE.TECHNICIAN);
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
  const [pokemonReason, setPokemonReason] = useState('');
  const [ballRecipient, setBallRecipient] = useState('');
  const [ballType, setBallType] = useState('NORMAL');
  const [ballAmount, setBallAmount] = useState(1);
  const [ballReason, setBallReason] = useState('');
  const [granting, setGranting] = useState(false);
  const [grantingBalls, setGrantingBalls] = useState(false);
  const recipientOptions = useMemo(() => members
    .filter((member) => member.loginID !== memberId)
    .map((member) => ({
      value: member.loginID,
      label: `${member.name || member.loginID} (${member.loginID})`,
    })), [members, memberId]);

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
  }, []);

  useEffect(() => {
    if (!canGrant) return undefined;
    let active = true;
    Promise.all([memberAPI.getMembers(), gameAPI.getAdminCatalog(), gameAPI.getPokemonGrantHistory(), gameAPI.getBallGrantHistory()])
      .then(([memberResponse, catalogResponse, historyResponse, ballHistoryResponse]) => {
        if (!active) return;
        setMembers(memberResponse.data.data || []);
        setCatalog(catalogResponse.data || []);
        setHistory(historyResponse.data || []);
        setBallHistory(ballHistoryResponse.data || []);
      })
      .catch((error) => {
        if (active) message.error(error.response?.data?.message ?? '포켓몬 지급 정보를 불러오지 못했습니다.');
      });
    return () => { active = false; };
  }, [canGrant]);

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
    if (!canGrant || !recipient || recipient === memberId || !collectibleId || !pokemonReason.trim()) return;
    setGranting(true);
    try {
      await gameAPI.grantPokemon({ loginID: recipient, collectibleId: Number(collectibleId), shiny, reason: pokemonReason.trim() });
      message.success('포켓몬을 지급했습니다.');
      setPokemonReason('');
      setHistory((await gameAPI.getPokemonGrantHistory()).data || []);
    } catch (error) {
      message.error(error.response?.data?.message ?? '포켓몬 지급에 실패했습니다.');
    } finally {
      setGranting(false);
    }
  };

  const grantBalls = async () => {
    if (!canGrant || !ballRecipient || ballRecipient === memberId || !ballType || !ballAmount || ballAmount < 1 || !ballReason.trim()) return;
    setGrantingBalls(true);
    try {
      await gameAPI.grantBalls({ loginID: ballRecipient, ballType, amount: ballAmount, reason: ballReason.trim() });
      message.success(`${ballType === 'MASTER' ? '마스터볼' : '포켓볼'} ${ballAmount}개를 지급했습니다.`);
      setBallReason('');
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
      {canGrant && <>
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
              options={recipientOptions}
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
          <label className={styles.grantReason}>지급 사유 (필수)
            <Input.TextArea required rows={2} maxLength={500} showCount value={pokemonReason} onChange={(event) => setPokemonReason(event.target.value)} placeholder="포켓몬 지급 사유를 입력하세요" />
          </label>
          <label className={styles.shinyToggle}><input type="checkbox" checked={shiny} onChange={(event) => setShiny(event.target.checked)} /> 이로치로 지급</label>
          <div className={styles.grantActions}><ActionButton disabled={!recipient || !collectibleId || !pokemonReason.trim() || granting} onClick={grantPokemon}>{granting ? '지급 중…' : '지급하기'}</ActionButton></div>
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
              options={recipientOptions}
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
          <label className={styles.grantReason}>지급 사유 (필수)
            <Input.TextArea required rows={2} maxLength={500} showCount value={ballReason} onChange={(event) => setBallReason(event.target.value)} placeholder="포켓볼 지급 사유를 입력하세요" />
          </label>
          <div className={styles.grantActions}><ActionButton disabled={!ballRecipient || !ballReason.trim() || grantingBalls} onClick={grantBalls}>{grantingBalls ? '지급 중…' : '지급하기'}</ActionButton></div>
        </div>
      </section>
      <section className={styles.historySection}>
        <h2 className={styles.title}>포켓볼 지급 기록</h2>
        {ballHistory.length === 0 ? <div className={styles.emptyState}>포켓볼 지급 기록이 없습니다.</div> : (
          <ProjectTableContainer className={styles.historyTable}>
            <ProjectTable>
              <thead><TableHead><th>회원</th><th>포켓볼</th><th>지급자</th><th>사유</th><th>지급 일시</th></TableHead></thead>
              <tbody>{ballHistory.slice((ballHistoryPage - 1) * 20, ballHistoryPage * 20).map((entry) => (
                <ProjectListRow key={entry.transactionId}>
                  <td>{entry.memberName || entry.memberLoginID}</td>
                  <td>{entry.ballType === 'MASTER' ? '마스터볼' : '포켓볼'} {entry.amount}개</td>
                  <td>{entry.grantorName || '관리자'}<br /><small>{entry.grantSource === 'LEGACY_SQL' ? '기존 지급' : '기여자 지급'}</small></td>
                  <td style={{ maxWidth: 280, whiteSpace: 'normal', wordBreak: 'break-word' }}>{entry.reason || '-'}</td>
                  <td>{new Date(entry.grantedAt).toLocaleString('ko-KR')}</td>
                </ProjectListRow>
              ))}</tbody>
            </ProjectTable>
          </ProjectTableContainer>
        )}
        {ballHistory.length > 20 && <Pagination current={ballHistoryPage} pageSize={20} total={ballHistory.length} showSizeChanger={false} onChange={setBallHistoryPage} className={styles.historyPagination} />}
      </section>
      <section className={styles.historySection}>
        <h2 className={styles.title}>지급 기록</h2>
        {history.length === 0 ? <div className={styles.emptyState}>지급 기록이 없습니다.</div> : (
          <ProjectTableContainer className={styles.historyTable}>
            <ProjectTable>
              <thead><TableHead><th>회원</th><th>포켓몬</th><th>지급자</th><th>사유</th><th>지급 일시</th></TableHead></thead>
              <tbody>{history.map((entry) => (
                <ProjectListRow key={entry.drawId}>
                  <td>{entry.memberName || entry.memberLoginID}</td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{entry.spriteUrl && <img src={entry.spriteUrl} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />}{entry.pokemonName}{entry.shiny && <Tag color="gold">이로치</Tag>}</span></td>
                  <td>{entry.grantorName}<br /><small>{entry.grantSource === 'LEGACY_SQL' ? '기존 지급' : entry.grantSource === 'ADMIN' ? '기여자 지급' : '일반 뽑기'}</small></td>
                  <td style={{ maxWidth: 280, whiteSpace: 'normal', wordBreak: 'break-word' }}>{entry.reason || '-'}</td>
                  <td>{new Date(entry.grantedAt).toLocaleString('ko-KR')}</td>
                </ProjectListRow>
              ))}</tbody>
            </ProjectTable>
          </ProjectTableContainer>
        )}
      </section>
      </>}
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
  grantForm: css`display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); align-items:end; gap:12px; margin-top:16px; label{display:flex; flex-direction:column; gap:7px; color:#6d6258; font-size:.82rem; font-weight:600;} @media(max-width:767px){grid-template-columns:1fr;}`,
  grantReason: css`grid-column:1/-1; textarea{width:100%;}`,
  grantActions: css`grid-column:1/-1; display:flex; justify-content:flex-end; button{margin:0;}`,
  shinyToggle: css`flex-direction:row!important; align-items:center; min-height:42px; white-space:nowrap; input{accent-color:#db6c58;}`,
  historySection: css`width:100%; margin-bottom:32px;`,
  historyTable: css`margin-top:14px;`,
  historyPagination: css`display:flex; justify-content:flex-end; margin-top:16px;`,
  header: css`display:flex; width:100%; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:18px; @media (max-width: 767px){align-items:stretch; flex-direction:column;}`,
  title: css`margin:0; color:#4c3722; font-size:1.75rem; font-weight:800; line-height:1.25;`,
  description: css`margin:8px 0 0; color:#827971; font-size:.85rem; line-height:1.45;`,
  syncButton: css`margin:0;`,
  emptyState: css`width:100%; padding:42px 20px; border:1px solid rgba(76,55,34,.12); border-radius:8px; color:#827971; font-size:.9rem; text-align:center; box-sizing:border-box;`,
  status: css`display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:1px; overflow:hidden; border:1px solid #e5f0ed; border-radius:8px; background:#e5f0ed; > div{display:flex; flex-direction:column; gap:8px; min-height:96px; padding:16px; background:#fff;} span{font-size:.8rem; color:#7b736a;} strong{color:#4c3722;} @media (max-width: 767px){grid-template-columns:1fr;}`,
}));
