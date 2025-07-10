import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  GET_MY_STATISTICS,
  GET_USER_BY_ID,
  GET_USER_INTERESTED_CATEGORIES,
  GET_USER_INTERESTED_GOALS,
} from '@framework/graphql/queries/user';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT, ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { ArrowSmallLeft, ProfileIcon } from '@components/icons/icons';
import { getDateFromat } from '@utils/helpers';
import { Loader } from '@components/index';
import { toast } from 'react-toastify';
import mobileClient from '@framework/graphql/apolloMobileClient';

export interface MyStatistics {
  summaries: number;
  key_points: number;
  percentile: number;
  number_of_people_behind_you: number;
  __typename: 'Statistics';
}

const ViewUser = () => {
  const { t } = useTranslation();
  const UserId = useParams();
  const [interestedCategories, setInterestedCategories] = useState([]);
  const [interestedGoals, setInterestedGoals] = useState([]);
  const [myStatistics, setMyStatistics] = useState<MyStatistics>();
  const { data, refetch, loading } = useQuery(GET_USER_BY_ID, {
    variables: { uuid: UserId.id },
    skip: !UserId.id,
    fetchPolicy: 'network-only',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!UserId.id) {
        return;
      }

      try {
        const [categoryResult, goalResult, myStatistics] =
          await Promise.allSettled([
            mobileClient.query({
              query: GET_USER_INTERESTED_CATEGORIES,
              fetchPolicy: 'network-only',
              context: {
                headers: { 'x-internal-user-uuid': UserId.id },
              },
            }),
            mobileClient.query({
              query: GET_USER_INTERESTED_GOALS,
              fetchPolicy: 'network-only',
              context: {
                headers: { 'x-internal-user-uuid': UserId.id },
              },
            }),
            mobileClient.query({
              query: GET_MY_STATISTICS,
              fetchPolicy: 'network-only',
              context: {
                headers: { 'x-internal-user-uuid': UserId.id },
              },
            }),
          ]);

        if (categoryResult.status === 'fulfilled') {
          setInterestedCategories(
            categoryResult.value.data.getUserInterestedCategories?.categories ||
              []
          );
        } else {
          toast.error('Failed to fetch interested categories');
        }

        if (goalResult.status === 'fulfilled') {
          setInterestedGoals(
            goalResult.value.data.getUserInterestedGoals?.goals || []
          );
        } else {
          toast.error('Failed to fetch interested goals');
        }

        if (myStatistics.status === 'fulfilled') {
          setMyStatistics(myStatistics.value.data.getMyStatistics?.data || []);
        } else {
          toast.error('Failed to fetch interested categories');
        }
      } catch {
        return;
      }
    };

    fetchUserPreferences();
  }, [UserId.id]);

  /**
   * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
   */
  useEffect(() => {
    if (UserId.id) {
      refetch().catch((err) => toast.error(err));
    }
  }, [UserId.id]);

  /**
   * on clicking cancel it will redirect to main events page
   */
  const onCancel = useCallback(() => {
    navigate(`/${ROUTES.app}/${ROUTES.user}/${ROUTES.list}`);
  }, []);

  const user = data?.getUserById?.data;

  return (
    <div className='card'>
      {loading && <Loader />}
      <div className='card-header'>
        <div className='flex items-center'>
          <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
            <ProfileIcon />
          </span>
          {t('User Details')}
        </div>
        <Button
          className='btn-primary  text-bold'
          label={t('Back')}
          onClick={onCancel}
        >
          <span className='mr-1 w-4 h-4 inline-block svg-icon '>
            <ArrowSmallLeft />
          </span>
        </Button>
      </div>
      <div className='card-body'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='flex pb-2 flex-col sm:flex-row'>
            <p className='mr-3 font-bold flex-1'>
              {t('Number of Books Completed')}
            </p>
            <p className='px-0 sm:px-3 flex-1'>{user?.books_completed || 0}</p>
          </div>
          <div className='flex pb-2 flex-col sm:flex-row'>
            <p className='mr-3 font-bold flex-1'>{t('Daily Goal')}</p>
            <p className='px-0 sm:px-3 flex-1'>
              {user?.daily_goal_minutes || 0}
              {' Min'}
            </p>
          </div>
          <div className='flex pb-2 flex-col sm:flex-row'>
            <p className='mr-3 font-bold flex-1'>{t('Interested Goals')}</p>
            <p className='px-0 sm:px-3 flex-1'>
              {interestedGoals.length > 0
                ? interestedGoals.map((goal: any) => goal.title).join(', ')
                : 'N/A'}
            </p>
          </div>
          <div className='flex pb-2 flex-col sm:flex-row'>
            <p className='mr-3 font-bold flex-1'>
              {t('Interested Categories')}
            </p>
            <p className='px-0 sm:px-3 flex-1'>
              {interestedCategories.length > 0
                ? interestedCategories
                    .map((categories: any) => categories.name)
                    .join(', ')
                : 'N/A'}
            </p>
          </div>
          {myStatistics && (
            <div className='flex pb-2 flex-col sm:flex-row'>
              <p className='mr-3 font-bold flex-1'>{t('Reading Statistics')}</p>
              <p className='px-0 sm:px-3 flex-1'>
                {`Completed Summaries - ${myStatistics.summaries}, Key Points - ${myStatistics.key_points}`}
              </p>
            </div>
          )}

          <div className='flex pb-2 flex-col sm:flex-row'>
            <p className='mr-3 font-bold flex-1'>{t('Registration Date')}</p>
            <p className='px-0 sm:px-3 flex-1'>
              {user?.created_at
                ? getDateFromat(
                    typeof user.created_at === 'string' &&
                      /^\d+$/.test(user.created_at)
                      ? Number(user.created_at)
                      : user.created_at,
                    DATE_FORMAT.momentDateTime24Format
                  )
                : ''}
            </p>
          </div>
          <div className='flex pb-2 flex-col sm:flex-row'>
            <p className='mr-3 font-bold flex-1'>{t('Email')}</p>
            <a
              href={`mailto:${user?.email}`}
              className='px-0 sm:px-3 flex-1 font-medium text-primary hover:underline cursor-pointer break-all'
            >
              {user?.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
