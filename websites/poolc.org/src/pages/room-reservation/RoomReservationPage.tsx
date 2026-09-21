import { createStyles } from 'antd-style';
import { Button, Input, Modal, Radio } from 'antd';
import { Calendar, dayjsLocalizer, Event, SlotInfo, ToolbarProps, View, Views } from 'react-big-calendar';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { LocalTimeReq, queryKey, RoomControllerService, useAppMutation, useAppQuery } from '~/lib/api-v2';
import { dayjs } from '~/lib/utils/dayjs';
import { useMessage } from '~/hooks/useMessage';
import { PageContent, PagePanel, PageShell } from '~/components/common/PageLayout/PageLayout';
import { PageHeader } from '~/components/common/PageHeader/PageHeader';
import colors from '~/lib/styles/colors';
import { breakpoints, media } from '~/styles/responsive';

const localizer = dayjsLocalizer(dayjs);

const useStyles = createStyles(({ css }) => ({
  toolbar: css`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;

    ${media.mobile} {
      grid-template-areas:
        'range range'
        'nav view';
      grid-template-columns: minmax(0, 1fr) auto;
      width: calc(100vw - 40px);
      max-width: calc(100vw - 40px);
      box-sizing: border-box;
      position: sticky;
      left: 0;
      z-index: 2;
      padding: 2px 0;
      background: #ffffff;
      gap: 14px 10px;
    }
  `,
  toolbarNav: css`
    display: inline-flex;
    justify-self: start;
    overflow: hidden;
    border: 1px solid #d8d0c3;
    border-radius: 6px;
    background: #ffffff;

    ${media.mobile} {
      grid-area: nav;
      width: 100%;
      min-width: 0;
    }
  `,
  toolbarView: css`
    display: inline-flex;
    justify-self: end;
    overflow: hidden;
    border: 1px solid #d8d0c3;
    border-radius: 6px;
    background: #ffffff;

    ${media.mobile} {
      grid-area: view;
      min-width: 0;

      button {
        min-width: 56px;
        padding-right: 10px;
        padding-left: 10px;
      }
    }
  `,
  toolbarButton: css`
    height: 38px;
    min-width: 64px;
    padding: 0 14px;
    border: 0;
    border-left: 1px solid #d8d0c3;
    background: #ffffff;
    color: ${colors.brown[1]};
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:first-of-type {
      border-left: 0;
    }

    &:hover,
    &:focus {
      background: ${colors.mint[0]};
      color: ${colors.mint[3]};
    }

    &[data-active='true'] {
      background: ${colors.mint[0]};
      color: ${colors.brown[1]};
    }

    ${media.mobile} {
      flex: 1;
      min-width: 0;
      padding-right: 8px;
      padding-left: 8px;
      font-size: 0.78rem;
    }
  `,
  toolbarRange: css`
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    text-align: center;

    ${media.mobile} {
      grid-area: range;
    }
  `,
  toolbarMonth: css`
    color: ${colors.brown[1]};
    font-size: 1.18rem;
    font-weight: 800;
    line-height: 1.2;

    ${media.mobile} {
      display: none;
    }
  `,
  toolbarDates: css`
    color: ${colors.brown[0]};
    font-size: 0.83rem;
    font-weight: 500;
    line-height: 1.2;
  `,
  calendarWrap: css`
    width: 100%;
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    margin-top: 2px;
    -webkit-overflow-scrolling: touch;

    .rbc-calendar {
      width: 100%;
      color: ${colors.brown[1]};
      font-family: inherit;
    }

    .rbc-time-view,
    .rbc-month-view {
      overflow: hidden;
      border: 1px solid #e6dfd4;
      border-radius: 8px;
      background: #ffffff;
    }

    .rbc-time-header {
      position: sticky;
      top: 0;
      z-index: 3;
      border-bottom: 1px solid #e6dfd4;
      background: #ffffff;
    }

    .rbc-time-header-content {
      border-left: 1px solid #e6dfd4;
    }

    .rbc-header {
      min-height: 36px;
      padding: 9px 4px;
      border-bottom: 0;
      color: ${colors.brown[1]};
      font-size: 0.8rem;
      font-weight: 800;
      background: #fbfaf8;
    }

    .rbc-header.rbc-today {
      background: rgba(71, 190, 155, 0.08);
      color: ${colors.mint[3]};
    }

    .rbc-time-content {
      border-top: 0;
      overflow-y: hidden;
    }

    .rbc-time-content > * + * > * {
      border-left: 1px solid #ebe6de;
    }

    .rbc-timeslot-group {
      min-height: 64px;
      border-bottom: 1px solid #ebe6de;
    }

    .rbc-time-gutter,
    .rbc-time-header-gutter {
      background: #fbfaf8;
    }

    .rbc-time-gutter .rbc-timeslot-group {
      display: flex;
      align-items: center;
    }

    .rbc-time-gutter .rbc-time-slot {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
    }

    .rbc-time-gutter .rbc-time-slot:not(:first-of-type) {
      display: none;
    }

    .rbc-label {
      padding: 0 10px;
      color: ${colors.brown[1]};
      font-size: 0.84rem;
      font-weight: 600;
    }

    .rbc-day-slot .rbc-time-slot {
      border-top: 1px solid #f4f1ed;
    }

    .rbc-today {
      background-color: rgba(71, 190, 155, 0.05);
    }

    .rbc-event {
      overflow: hidden;
      border: 0 !important;
      border-radius: 6px;
      background-color: ${colors.mint[2]};
      box-shadow:
        inset 0 -2px rgba(255, 255, 255, 0.42),
        0 4px 12px rgba(71, 190, 155, 0.14);
      padding: 0;
      cursor: pointer;
      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow:
          inset 0 -2px rgba(255, 255, 255, 0.42),
          0 7px 16px rgba(71, 190, 155, 0.24);
      }
    }

    .rbc-event-label {
      display: none;
    }

    .rbc-event-content {
      height: 100%;
    }

    .rbc-event:focus {
      outline: 2px solid rgba(71, 190, 155, 0.32);
      outline-offset: 2px;
    }

    .rbc-allday-cell {
      display: none;
    }

    ${media.mobile} {
      .rbc-header {
        padding: 6px 2px;
        font-size: 0.68rem;
      }

      .rbc-label {
        padding: 0 6px;
        font-size: 0.7rem;
        white-space: nowrap;
      }

      .rbc-time-gutter,
      .rbc-time-header-gutter {
        width: 66px;
        min-width: 66px;
      }

      .rbc-timeslot-group {
        min-height: 60px;
      }

      &[data-calendar-view='week'] .rbc-calendar {
        width: 680px;
        min-width: 680px;
      }
    }
  `,
  eventTitle: css`
    margin: 0;
    color: ${colors.brown[1]};
    font-weight: 800;
  `,
  eventTime: css`
    color: ${colors.brown[0]};
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 10px;
  `,
  reservationDetail: css`
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 4px 0 2px;
  `,
  reservationDetailTitle: css`
    margin: 0;
    color: ${colors.brown[1]};
    font-size: 1.28rem;
    font-weight: 800;
    line-height: 1.35;
    word-break: keep-all;
  `,
  reservationDetailTime: css`
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 16px;
    border-radius: 8px;
    background: ${colors.mint[0]};
    color: ${colors.brown[1]};

    span {
      color: ${colors.brown[0]};
      font-size: 0.84rem;
      font-weight: 600;
    }

    strong {
      font-size: 1.08rem;
      font-weight: 800;
    }
  `,
  reservationDetailList: css`
    display: grid;
    gap: 14px;
    margin: 0;

    > div {
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr);
      align-items: center;
      gap: 12px;
    }

    dt {
      color: ${colors.brown[0]};
      font-size: 0.86rem;
      font-weight: 700;
    }

    dd {
      min-width: 0;
      margin: 0;
      color: ${colors.brown[1]};
      font-weight: 700;
    }
  `,
  reservationMode: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  `,
  reservationModeBadge: css`
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 0 9px;
    border-radius: 999px;
    background: ${colors.mint[0]};
    color: ${colors.mint[3]};
    font-size: 0.78rem;
    font-weight: 800;

    &[data-shared='false'] {
      background: #f5f2ed;
      color: ${colors.brown[0]};
    }
  `,
  reservationModeDescription: css`
    color: ${colors.brown[0]};
    font-size: 0.8rem;
    font-weight: 500;
  `,
  reservationEvent: css`
    position: relative;
    display: flex;
    height: 100%;
    min-height: 0;
    flex-direction: column;
    gap: 5px;
    padding: 8px 10px;
    color: #ffffff;
    box-sizing: border-box;

    &[data-shared='false'] {
      color: ${colors.brown[1]};
    }

    ${media.mobile} {
      gap: 2px;
      padding: 5px;
    }

    &[data-compact='true'] {
      gap: 2px;
      padding: 5px 8px;
    }

    &[data-tiny='true'] {
      display: block;
      padding: 4px 8px;
      white-space: nowrap;
    }

  `,
  reservationTime: css`
    flex: 0 0 auto;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1.15;
    opacity: 0.9;

    ${media.mobile} {
      font-size: 0.6rem;
    }

    [data-compact='true'] & {
      font-size: 0.66rem;
      line-height: 1.1;
    }

    [data-tiny='true'] & {
      font-size: 0.68rem;
      line-height: 1.15;
    }
  `,
  reservationPurpose: css`
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.86rem;
    font-weight: 800;
    line-height: 1.24;
    word-break: keep-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    ${media.mobile} {
      font-size: 0.68rem;
    }

    [data-compact='true'] & {
      font-size: 0.76rem;
      line-height: 1.15;
      -webkit-line-clamp: 1;
    }

    [data-tiny='true'] & {
      display: inline;
      font-size: 0.68rem;
      line-height: 1.15;
      white-space: nowrap;
      -webkit-line-clamp: unset;
    }
  `,
  reservationHost: css`
    margin-top: auto;
    overflow: hidden;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.2;
    opacity: 0.78;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${media.mobile} {
      font-size: 0.6rem;
    }
  `,
  reservationHeader: css`
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  `,
  reservationSharedLabel: css`
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1;
    opacity: 0.9;

    &::before {
      width: 1px;
      height: 12px;
      margin-right: 6px;
      background: rgba(255, 255, 255, 0.52);
      content: '';
    }

    [data-tiny='true'] & {
      font-size: 0.62rem;
    }

    [data-shared='false'] & {
      color: ${colors.brown[1]};
      opacity: 0.84;

      &::before {
        background: rgba(76, 55, 34, 0.28);
      }
    }

  `,
  reservationFormLabel: css`
    display: block;
    margin: 20px 0 8px;
    color: ${colors.brown[1]};
    font-size: 0.88rem;
    font-weight: 800;
  `,
  reservationHelp: css`
    margin: 8px 0 0;
    color: ${colors.brown[0]};
    font-size: 0.82rem;
    line-height: 1.5;
  `,
}));

type RoomEventResource = {
  id?: number | string;
  purpose?: string;
  host?: string;
  sharedUseAllowed?: boolean;
};

type RoomCalendarEvent = Event & {
  resource?: RoomEventResource;
};

type RoomToolbarProps = ToolbarProps<RoomCalendarEvent>;

type RoomReservationDraft = {
  start: Date;
  end: Date;
};

const getInitialCalendarView = () => {
  if (typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoints.compact - 1}px)`).matches) {
    return Views.DAY;
  }

  return Views.WEEK;
};

export default function RoomReservationPage() {
  // data
  const { styles } = useStyles();
  const message = useMessage();

  const [startDate, setStartDate] = useState(() => dayjs().startOf('week').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<RoomCalendarEvent | undefined>();
  const [reservationDraft, setReservationDraft] = useState<RoomReservationDraft | null>(null);
  const [reservationPurpose, setReservationPurpose] = useState('');
  const [sharedUseAllowed, setSharedUseAllowed] = useState(false);
  const [calendarView, setCalendarView] = useState<View>(getInitialCalendarView);

  const { data: eventResponse, refetch: refetchEvent } = useAppQuery({
    queryKey: [queryKey.room.range(startDate, endDate)],
    queryFn: () =>
      RoomControllerService.findRoomReservationUsingGet({
        start: startDate,
        end: endDate,
      }),
  });

  const { mutate: createReservation } = useAppMutation({
    mutationFn: RoomControllerService.createRoomReservationUsingPost,
  });

  const { mutate: deleteReservation } = useAppMutation({
    mutationFn: RoomControllerService.deleteRoomReservationUsingDelete,
  });

  const eventList: RoomCalendarEvent[] =
    eventResponse?.data?.map((el) => ({
      title: `${el.purpose} - ${el.host}`,
      start: dayjs(`${el.date} ${el.start}`).toDate(),
      end: dayjs(`${el.date} ${el.end}`).toDate(),
      resource: {
        id: el.id,
        purpose: el.purpose,
        host: el.host,
        sharedUseAllowed: el.sharedUseAllowed,
      },
    })) ?? [];

  // methods
  const onSelectSlot = (slotInfo: SlotInfo) => {
    const start = dayjs(slotInfo.start);
    const end = dayjs(slotInfo.end);

    const hasOverlap = eventList.some((event) => start.isBefore(dayjs(event.end)) && end.isAfter(dayjs(event.start)));
    if (hasOverlap) {
      message.error('이미 예약된 시간입니다. 출입 가능 예약이면 예약자에게 문의해 함께 이용할 수 있습니다.');
      return;
    }

    setReservationDraft({ start: slotInfo.start, end: slotInfo.end });
    setReservationPurpose('');
    setSharedUseAllowed(false);
    setIsCreateModalOpen(true);
  };

  const onCreateReservation = () => {
    if (!reservationDraft || !reservationPurpose.trim()) {
      message.error('사용 목적을 입력해주세요.');
      return;
    }

    const start = dayjs(reservationDraft.start);
    const end = dayjs(reservationDraft.end);

    const startTime = `${start.hour().toString().padStart(2, '0')}:${start.minute().toString().padStart(2, '0')}` as unknown as LocalTimeReq;
    const endTime = `${end.hour().toString().padStart(2, '0')}:${end.minute().toString().padStart(2, '0')}` as unknown as LocalTimeReq;

    createReservation(
      {
        roomPostRequest: {
          start: startTime,
          end: endTime,
          purpose: reservationPurpose.trim(),
          sharedUseAllowed,
          // start와 end는 날짜가 동일하므로 어느 것을 사용해도 무관
          date: start.format('YYYY-MM-DD'),
        },
      },
      {
        onSuccess() {
          message.success(sharedUseAllowed ? '출입 가능한 동아리방 예약이 등록되었습니다.' : '단독 사용 동아리방 예약이 등록되었습니다.');
          setIsCreateModalOpen(false);
          setReservationDraft(null);
          refetchEvent();
        },
      },
    );
  };

  const onSelectEvent = (e: RoomCalendarEvent) => {
    setIsModalOpen(true);
    setCurrentEvent(e);
  };

  const onRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    let start: Date;
    let end: Date;

    if (Array.isArray(range)) {
      [start] = range;
      end = range[range.length - 1];
    } else {
      start = range.start;
      end = range.end;
    }

    setStartDate(dayjs(start).format('YYYY-MM-DD'));
    setEndDate(dayjs(end).format('YYYY-MM-DD'));
  };

  const onModalOk = () => setIsModalOpen(false);

  const onDelete = () => {
    const reservationId = currentEvent?.resource?.id;
    if (!reservationId) {
      return;
    }
    Modal.confirm({
      title: '예약 삭제',
      content: '이 동아리방 예약을 정말 삭제할까요?',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteReservation(
          { reservationId },
          {
            onSuccess() {
              message.success('동아리방 예약을 삭제했습니다.');
              setIsModalOpen(false);
              setCurrentEvent(undefined);
              refetchEvent();
            },
          },
        );
      },
    });
  };

  const ReservationEvent = ({ event }: { event: RoomCalendarEvent }) => {
    const durationMinutes = dayjs(event.end).diff(dayjs(event.start), 'minute');
    const isTiny = durationMinutes <= 30;
    const isCompact = durationMinutes < 60;
    const shouldHideHost = durationMinutes <= 60;
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    const timeText = `${start.format('HH:mm')}–${end.format('HH:mm')}`;
    const purpose = event.resource?.purpose || event.title;

    if (isTiny) {
      return (
        <div className={styles.reservationEvent} data-compact data-tiny data-shared={event.resource?.sharedUseAllowed === true}>
          <div className={styles.reservationHeader}>
            <span className={styles.reservationTime}>{timeText}</span>
            <span className={styles.reservationSharedLabel}>{event.resource?.sharedUseAllowed ? '출입 가능' : '출입 불가'}</span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.reservationEvent} data-compact={isCompact} data-shared={event.resource?.sharedUseAllowed === true}>
        <div className={styles.reservationHeader}>
          <span className={styles.reservationTime}>{timeText}</span>
          <span className={styles.reservationSharedLabel}>{event.resource?.sharedUseAllowed ? '출입 가능' : '출입 불가'}</span>
        </div>
        <span className={styles.reservationPurpose}>{purpose}</span>
        {!shouldHideHost && event.resource?.host && <span className={styles.reservationHost}>{event.resource.host}</span>}
      </div>
    );
  };

  const RoomToolbar = ({ date, view, onNavigate, onView }: RoomToolbarProps) => {
    const visibleStart = view === Views.DAY ? dayjs(date) : dayjs(date).startOf('week');
    const visibleEnd = view === Views.DAY ? dayjs(date) : dayjs(date).endOf('week');
    const isSameMonth = visibleStart.isSame(visibleEnd, 'month');
    const monthText = isSameMonth ? visibleStart.format('YYYY년 M월') : `${visibleStart.format('YYYY년 M월')} - ${visibleEnd.format('YYYY년 M월')}`;
    const rangeText =
      view === Views.DAY
        ? visibleStart.format('M월 D일')
        : `${visibleStart.format('M월 D일')} - ${visibleEnd.format('M월 D일')}`;

    return (
      <div className={styles.toolbar}>
        <div className={styles.toolbarNav}>
          <button type="button" className={styles.toolbarButton} onClick={() => onNavigate('TODAY')}>
            이번 주
          </button>
          <button type="button" className={styles.toolbarButton} onClick={() => onNavigate('PREV')}>
            이전
          </button>
          <button type="button" className={styles.toolbarButton} onClick={() => onNavigate('NEXT')}>
            다음
          </button>
        </div>
        <div className={styles.toolbarRange}>
          <span className={styles.toolbarMonth}>{monthText}</span>
          <span className={styles.toolbarDates}>{rangeText}</span>
        </div>
        <div className={styles.toolbarView}>
          <button type="button" className={styles.toolbarButton} data-active={view === Views.WEEK} onClick={() => onView(Views.WEEK)}>
            주간
          </button>
          <button type="button" className={styles.toolbarButton} data-active={view === Views.DAY} onClick={() => onView(Views.DAY)}>
            일간
          </button>
        </div>
      </div>
    );
  };

  // template
  return (
    <>
      <PageShell>
        <PagePanel>
          <PageContent>
            <PageHeader title="동아리방 예약" />
            <div className={styles.calendarWrap} data-calendar-view={calendarView}>
              <Calendar
                localizer={localizer}
                selectable
                style={{
                  width: '100%',
                  height: 1260,
                }}
                culture="ko"
                view={calendarView}
                onView={setCalendarView}
                views={{
                  week: true,
                  day: true,
                }}
                messages={{
                  today: '이번 주',
                  previous: '이전',
                  next: '다음',
                  week: '주간',
                  day: '일간',
                }}
                components={{
                  toolbar: RoomToolbar,
                  event: ReservationEvent,
                }}
                events={eventList}
                eventPropGetter={(event: RoomCalendarEvent) => ({
                  style: {
                    backgroundColor: event.resource?.sharedUseAllowed ? colors.mint[2] : '#D8C7B2',
                  },
                })}
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
                onRangeChange={onRangeChange}
                min={new Date(0, 0, 0, 7, 0, 0)}
                max={new Date(0, 0, 0, 23, 0, 0)}
                scrollToTime={new Date(0, 0, 0, 7, 0, 0)}
              />
            </div>
          </PageContent>
        </PagePanel>
      </PageShell>
      <Modal
        title="동아리방 예약"
        open={isCreateModalOpen}
        okText="예약"
        cancelText="취소"
        onOk={onCreateReservation}
        onCancel={() => {
          setIsCreateModalOpen(false);
          setReservationDraft(null);
        }}
      >
        {reservationDraft && <p className={styles.eventTime}>{dayjs(reservationDraft.start).format('MM월 DD일 HH:mm')} - {dayjs(reservationDraft.end).format('HH:mm')}</p>}
        <label className={styles.reservationFormLabel} htmlFor="reservation-purpose">사용 목적</label>
        <Input id="reservation-purpose" value={reservationPurpose} onChange={(event) => setReservationPurpose(event.target.value)} placeholder="예: 웹세미나" autoFocus />
        <span className={styles.reservationFormLabel}>사용 방식</span>
        <Radio.Group value={sharedUseAllowed} onChange={(event) => setSharedUseAllowed(event.target.value)}>
          <Radio value={false}>단독 사용</Radio>
          <Radio value>출입 가능</Radio>
        </Radio.Group>
        <p className={styles.reservationHelp}>출입 가능으로 설정하면, 다른 회원도 별도 예약 없이 같은 시간에 동아리방을 이용할 수 있습니다.</p>
      </Modal>
      <Modal
        title="동아리방 예약"
        open={isModalOpen}
        onOk={onModalOk}
        onCancel={onModalOk}
        footer={[
          <Button type="primary" onClick={onModalOk} key="confirm">
            닫기
          </Button>,
          <Button danger onClick={onDelete} key="delete">
            삭제
          </Button>,
        ]}
      >
        <article className={styles.reservationDetail}>
          <h2 className={styles.reservationDetailTitle}>{currentEvent?.resource?.purpose || currentEvent?.title}</h2>
          <div className={styles.reservationDetailTime}>
            <span>{dayjs(currentEvent?.start).format('MM월 DD일')}</span>
            <strong>{dayjs(currentEvent?.start).format('HH:mm')}–{dayjs(currentEvent?.end).format('HH:mm')}</strong>
          </div>
          <dl className={styles.reservationDetailList}>
            <div>
              <dt>예약자</dt>
              <dd>{currentEvent?.resource?.host || '-'}</dd>
            </div>
            <div>
              <dt>사용 방식</dt>
              <dd className={styles.reservationMode}>
                <span className={styles.reservationModeBadge} data-shared={currentEvent?.resource?.sharedUseAllowed === true}>
                  {currentEvent?.resource?.sharedUseAllowed ? '출입 가능' : '단독 사용'}
                </span>
                <span className={styles.reservationModeDescription}>
                  {currentEvent?.resource?.sharedUseAllowed ? '다른 회원 출입 가능' : '예약자만 출입 가능'}
                </span>
              </dd>
            </div>
          </dl>
        </article>
      </Modal>
    </>
  );
}
