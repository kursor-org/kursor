'use client';

import React, { FC, useCallback, useMemo } from 'react';
import {
  Integrations,
  useCalendar,
} from '@kursor/frontend/components/launches/calendar.context';
import dayjs from 'dayjs';
import { openModal, useModals } from '@mantine/modals';
import { AddEditModal } from '@kursor/frontend/components/launches/add.edit.model';
import clsx from 'clsx';
import { useFetch } from '@kursor/helpers/utils/custom.fetch';
import { ExistingDataContextProvider } from '@kursor/frontend/components/launches/helpers/use.existing.data';
import { useDrag, useDrop } from 'react-dnd';
import { DNDProvider } from '@kursor/frontend/components/launches/helpers/dnd.provider';
import { Integration, Post, State } from '@prisma/client';
import { useAddProvider } from '@kursor/frontend/components/launches/add.provider.component';
import { CommentComponent } from '@kursor/frontend/components/launches/comments/comment.component';
import { useSWRConfig } from 'swr';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useToaster } from '@kursor/react/toaster/toaster';
import { useUser } from '@kursor/frontend/components/layout/user.context';
import { IntegrationContext } from '@kursor/frontend/components/launches/helpers/use.integration';
import { PreviewPopup } from '@kursor/frontend/components/marketplace/special.message';
import { useTranslations } from 'next-intl';

export const days = [
  '',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
export const hours = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const Calendar = () => {
  const { currentWeek, currentYear, comments } = useCalendar();
  const t = useTranslations('calendar');

  const firstDay = useMemo(() => {
    return dayjs().year(currentYear).isoWeek(currentWeek).isoWeekday(1);
  }, [currentYear, currentWeek]);

  return (
    <DNDProvider>
      <div className="select-none">
        <div className="border-tableBorder grid grid-cols-8 border-r text-center">
          {days.map((day, index) => (
            <div
              className="border-tableBorder bg-input sticky top-0 z-[100] flex h-[36px] items-center justify-center gap-[4px] border-b border-l border-t text-[14px]"
              key={day}
            >
              <div>{t(day)} </div>
              <div className="text-[12px]">
                {day && `(${firstDay.add(index - 1, 'day').format('MM.DD')})`}
              </div>
            </div>
          ))}
          {hours.map((hour) =>
            days.map((day, index) => (
              <>
                {index === 0 ? (
                  <div
                    className="border-tableBorder h-[216px] border-b border-l"
                    key={day + hour}
                  >
                    {['00', '10', '20', '30', '40', '50'].map((num) => (
                      <div
                        key={day + hour + num}
                        className="flex h-[calc(216px/6)] items-center justify-center text-[12px]"
                      >
                        {hour.split(':')[0] + ':' + num}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="border-tableBorder group relative flex h-[216px] flex-col overflow-hidden border-b border-l"
                    key={day + hour}
                  >
                    <CommentBox
                      totalComments={
                        comments.find(
                          (p) =>
                            dayjs
                              .utc(p.date)
                              .local()
                              .format('YYYY-MM-DD HH:mm') ===
                            dayjs()
                              .isoWeek(currentWeek)
                              .isoWeekday(index + 1)
                              .hour(+hour.split(':')[0] - 1)
                              .minute(0)
                              .format('YYYY-MM-DD HH:mm'),
                        )?.total || 0
                      }
                      date={dayjs()
                        .isoWeek(currentWeek)
                        .isoWeekday(index + 1)
                        .hour(+hour.split(':')[0] - 1)
                        .minute(0)}
                    />
                    {['00', '10', '20', '30', '40', '50'].map((num) => (
                      <CalendarColumn
                        key={day + hour + num + currentWeek + currentYear}
                        day={index}
                        hour={hour.split(':')[0] + ':' + num}
                      />
                    ))}
                  </div>
                )}
              </>
            )),
          )}
        </div>
      </div>
    </DNDProvider>
  );
};

const CalendarColumn: FC<{ day: number; hour: string }> = (props) => {
  const { day, hour } = props;
  const { currentWeek, currentYear } = useCalendar();

  const getDate = useMemo(() => {
    const date =
      dayjs()
        .year(currentYear)
        .isoWeek(currentWeek)
        .isoWeekday(day)
        .format('YYYY-MM-DD') +
      'T' +
      hour +
      ':00';
    return dayjs(date);
  }, [currentWeek]);

  const isBeforeNow = useMemo(() => {
    return getDate.isBefore(dayjs());
  }, [getDate]);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
  });

  return (
    <div className="h-full w-full" ref={ref}>
      {!entry?.isIntersecting ? (
        <div
          className={clsx(
            'flex h-full items-center justify-center text-[12px]',
            isBeforeNow && 'bg-secondary',
          )}
        >
          {!isBeforeNow && (
            <div
              className={clsx(
                'bg-forth hover:bg-seventh flex h-[20px] w-[20px] items-center justify-center rounded-full',
              )}
            >
              +
            </div>
          )}
        </div>
      ) : (
        <CalendarColumnRender {...props} />
      )}
    </div>
  );
};
const CalendarColumnRender: FC<{ day: number; hour: string }> = (props) => {
  const { day, hour } = props;
  const user = useUser();
  const {
    currentWeek,
    currentYear,
    integrations,
    posts,
    trendings,
    changeDate,
  } = useCalendar();

  const toaster = useToaster();
  const modal = useModals();
  const fetch = useFetch();

  const getDate = useMemo(() => {
    const date =
      dayjs()
        .year(currentYear)
        .isoWeek(currentWeek)
        .isoWeekday(day)
        .format('YYYY-MM-DD') +
      'T' +
      hour +
      ':00';
    return dayjs(date);
  }, [currentWeek]);

  const postList = useMemo(() => {
    return posts.filter((post) => {
      return dayjs
        .utc(post.publishDate)
        .local()
        .isBetween(getDate, getDate.add(10, 'minute'), 'minute', '[)');
    });
  }, [posts]);

  const canBeTrending = useMemo(() => {
    return !!trendings.find((trend) => {
      return dayjs
        .utc(trend)
        .local()
        .isBetween(getDate, getDate.add(10, 'minute'), 'minute', '[)');
    });
  }, [trendings]);

  const isBeforeNow = useMemo(() => {
    return getDate.isBefore(dayjs());
  }, [getDate]);

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: 'post',
    drop: async (item: any) => {
      if (isBeforeNow) return;
      const { status } = await fetch(`/posts/${item.id}/date`, {
        method: 'PUT',
        body: JSON.stringify({
          date: getDate.utc().format('YYYY-MM-DDTHH:mm:ss'),
        }),
      });

      if (status !== 500) {
        changeDate(item.id, getDate);
        return;
      }

      toaster.show(
        "Can't change date, remove post from publication",
        'warning',
      );
    },
    collect: (monitor) => ({
      canDrop: isBeforeNow ? false : !!monitor.canDrop() && !!monitor.isOver(),
    }),
  }));

  const getIntegration = useCallback(
    async (post: Post & { integration: Integration }) => {
      return (
        await fetch(
          `/integrations/${post.integration.id}?order=${post.submittedForOrderId}`,
          {
            method: 'GET',
          },
        )
      ).json();
    },
    [],
  );

  const previewPublication = useCallback(
    async (postInfo: Post & { integration: Integration }) => {
      const post = await (
        await fetch(`/marketplace/posts/${postInfo.id}`)
      ).json();

      const integration = await getIntegration(postInfo);
      modal.openModal({
        classNames: {
          modal: 'bg-transparent text-white',
        },
        size: 'auto',
        withCloseButton: false,
        children: (
          <IntegrationContext.Provider
            value={{
              date: dayjs(),
              integration,
              value: [],
            }}
          >
            <PreviewPopup
              providerId={post?.providerId!}
              post={post}
              postId={post.id}
            />
          </IntegrationContext.Provider>
        ),
      });
    },
    [],
  );

  const editPost = useCallback(
    (post: Post & { integration: Integration }) => async () => {
      if (user?.orgId === post.submittedForOrganizationId) {
        return previewPublication(post);
      }
      const data = await (await fetch(`/posts/${post.id}`)).json();

      modal.openModal({
        closeOnClickOutside: false,
        closeOnEscape: false,
        withCloseButton: false,
        classNames: {
          modal: 'w-[100%] max-w-[1400px] bg-transparent text-white',
        },
        children: (
          <ExistingDataContextProvider value={data}>
            <AddEditModal
              reopenModal={editPost(post)}
              integrations={integrations
                .slice(0)
                .filter((f) => f.id === data.integration)
                .map((p) => ({ ...p, picture: data.integrationPicture }))}
              date={getDate}
            />
          </ExistingDataContextProvider>
        ),
        size: '80%',
        title: ``,
      });
    },
    [integrations],
  );

  const addModal = useCallback(() => {
    modal.openModal({
      closeOnClickOutside: false,
      closeOnEscape: false,
      withCloseButton: false,
      classNames: {
        modal: 'w-[100%] max-w-[1400px] bg-transparent text-white',
      },
      children: (
        <AddEditModal
          integrations={integrations.slice(0).map((p) => ({ ...p }))}
          date={getDate}
          reopenModal={() => ({})}
        />
      ),
      size: '80%',
      // title: `Adding posts for ${getDate.format('DD/MM/YYYY HH:mm')}`,
    });
  }, [integrations]);

  const addProvider = useAddProvider();

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 h-full w-full">
        <div
          {...(canBeTrending
            ? {
                'data-tooltip-id': 'tooltip',
                'data-tooltip-content': 'Predicted GitHub Trending Change',
              }
            : {})}
          ref={drop}
          className={clsx(
            'pointer scrollbar scrollbar-thumb-tableBorder scrollbar-track-secondary flex h-[calc(216px/6)] w-full justify-center gap-[2.5px] overflow-hidden overflow-x-auto text-[12px]',
            isBeforeNow && 'bg-secondary',
            canDrop && 'bg-white/80',
            canBeTrending && 'bg-[#eaff00]',
          )}
        >
          {postList.map((post) => (
            <div
              key={post.id}
              className={clsx(
                postList.length > 1 && 'w-[33px] basis-[28px]',
                'relative flex h-full flex-shrink-0 flex-grow-0 items-center justify-center text-white',
              )}
            >
              <div className="relative flex items-center gap-[5px]">
                <CalendarItem
                  date={getDate}
                  state={post.state}
                  editPost={editPost(post)}
                  post={post}
                  integrations={integrations}
                />
              </div>
            </div>
          ))}
          {!isBeforeNow && (
            <div
              className={clsx(
                !postList.length ? 'flex-1 justify-center' : 'ml-[2px]',
                'flex cursor-pointer items-center gap-[2.5px]',
              )}
            >
              <div
                data-tooltip-id="tooltip"
                data-tooltip-content={
                  'Schedule for ' + getDate.format('DD/MM/YYYY HH:mm')
                }
                onClick={integrations.length ? addModal : addProvider}
                className={clsx(
                  'bg-forth hover:bg-seventh flex h-[20px] w-[20px] items-center justify-center rounded-full text-white',
                )}
              >
                +
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarItem: FC<{
  date: dayjs.Dayjs;
  editPost: () => void;
  integrations: Integrations[];
  state: State;
  post: Post & { integration: Integration };
}> = (props) => {
  const { editPost, post, date, integrations, state } = props;
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'post',
      item: { id: post.id, date },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0 : 1,
      }),
    }),
    [],
  );
  return (
    <div
      ref={dragRef}
      onClick={editPost}
      className={clsx('relative', state === 'DRAFT' && '!grayscale')}
      data-tooltip-id="tooltip"
      style={{ opacity }}
      data-tooltip-content={`${state === 'DRAFT' ? 'Draft: ' : ''}${
        integrations.find(
          (p) => p.identifier === post.integration?.providerIdentifier,
        )?.name
      }: ${post.content.slice(0, 100)}`}
    >
      <img
        className="h-[20px] w-[20px] rounded-full"
        src={post.integration.picture!}
      />
      <img
        className="border-fifth absolute bottom-[0] right-0 z-10 h-[12px] w-[12px] rounded-full border"
        src={`/icons/platforms/${post.integration?.providerIdentifier}.png`}
      />
    </div>
  );
};

export const CommentBox: FC<{ totalComments: number; date: dayjs.Dayjs }> = (
  props,
) => {
  const { totalComments, date } = props;
  const { mutate } = useSWRConfig();

  const openCommentsModal = useCallback(() => {
    openModal({
      children: <CommentComponent date={date} />,
      withCloseButton: false,
      onClose() {
        mutate(`/posts`);
      },
      classNames: {
        modal: 'bg-transparent text-white',
      },
      size: '80%',
    });
  }, [date]);

  return (
    <div
      className={
        totalComments === 0
          ? 'opacity-0 transition-opacity group-hover:opacity-100'
          : ''
      }
    >
      <div
        onClick={openCommentsModal}
        data-tooltip-id="tooltip"
        data-tooltip-content="Add / View comments"
        className={clsx(
          'group absolute bottom-0 right-0 z-[10] h-[20px] w-[20px] cursor-pointer transition-all duration-300 ease-in-out hover:bottom-[3px] hover:right-[3px] hover:opacity-95',
          totalComments === 0 ? 'opacity-50' : 'opacity-95',
        )}
      >
        <div
          className={clsx(
            'relative h-full w-full group-hover:opacity-100',
            totalComments === 0 && 'opacity-0',
          )}
        >
          {totalComments > 0 && (
            <div className="absolute bottom-[10px] right-0 z-[20] flex h-[10px] w-[10px] items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
              {totalComments}
            </div>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            id="comment"
          >
            <path
              fill="#fff"
              d="M25.784 21.017A10.992 10.992 0 0 0 27 16c0-6.065-4.935-11-11-11S5 9.935 5 16s4.935 11 11 11c1.742 0 3.468-.419 5.018-1.215l4.74 1.185a.996.996 0 0 0 .949-.263 1 1 0 0 0 .263-.95l-1.186-4.74zm-2.033.11.874 3.498-3.498-.875a1.006 1.006 0 0 0-.731.098A8.99 8.99 0 0 1 16 25c-4.963 0-9-4.038-9-9s4.037-9 9-9 9 4.038 9 9a8.997 8.997 0 0 1-1.151 4.395.995.995 0 0 0-.098.732z"
            ></path>
          </svg>
        </div>
        <div className="shadow-yellow absolute bottom-0 right-0 h-[0] w-[0] bg-[rgba(0,0,0,0)]"></div>
      </div>
    </div>
  );
};
