import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  GET_MY_ACHIEVEMENTS,
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

interface AchievementLevel {
  level: number;
}

interface AchievementDetails {
  perseverant?: AchievementLevel;
  smart?: AchievementLevel;
  wise?: AchievementLevel;
  influencer?: AchievementLevel;
}

const ViewUser = () => {
  const { t } = useTranslation();
  const UserId = useParams();
  const [interestedCategories, setInterestedCategories] = useState([]);
  const [interestedGoals, setInterestedGoals] = useState([]);
  const [myStatistics, setMyStatistics] = useState<MyStatistics>();
  const [myAchievements, setMyAchievements] = useState<AchievementDetails>();
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
        const [categoryResult, goalResult, myStatistics, achievements] =
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
            mobileClient.query({
              query: GET_MY_ACHIEVEMENTS,
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

        if (achievements.status === 'fulfilled') {
          setMyAchievements(
            achievements.value.data.getMyAchievements?.data || []
          );
        } else {
          toast.error('Failed to fetch achievements');
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
        <div className='mb-6'>
          <a
            href={`mailto:${user?.email}`}
            className='text-xl font-bold text-black hover:underline break-all'
          >
            {user?.email}
          </a>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='flex pb-2 flex-col bg-gray-100 rounded-lg p-4 gap-4 text-center'>
            <p className='mr-3 font-bold flex-1'>{t('Books Completed')}</p>
            <p className='px-0 sm:px-3 flex-1 text-xl'>
              {user?.books_completed || 0}
            </p>
          </div>
          <div className='flex pb-2 flex-col bg-gray-100 rounded-lg p-4 gap-4 text-center'>
            <p className='mr-3 font-bold flex-1'>{t('Daily Goal')}</p>
            <p className='px-0 sm:px-3 flex-1 text-xl'>
              {user?.daily_goal_minutes || 0}
              {' Min'}
            </p>
          </div>
          <div className='flex pb-2 flex-col bg-gray-100 rounded-lg p-4 gap-4 text-center'>
            <p className='mr-3 font-bold flex-1'>{t('Streak')}</p>
            <p className='px-0 sm:px-3 flex-1 text-xl'>
              {user?.current_streak_count || 0}
            </p>
          </div>
          <div className='flex pb-2 flex-col bg-gray-100 rounded-lg p-4 gap-4 text-center'>
            <p className='mr-3 font-bold flex-1'>{t('Registration Date')}</p>
            <p className='px-0 sm:px-3 flex-1 text-xl'>
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
        </div>
        <div className='mt-8 w-full border border-gray-200 rounded-lg divide-y'>
          <div className='flex gap-6 px-4 py-3 bg-gray-50 font-semibold text-gray-700'>
            <span className='w-60'>{t('Interested Goals')}</span>
            <span className='text-left'>
              {interestedGoals.length > 0
                ? interestedGoals.map((goal: any) => goal.title).join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-6 px-4 py-3'>
            <span className='w-60 font-semibold text-gray-700'>
              {t('Interested Categories')}
            </span>
            <span className='text-left'>
              {interestedCategories.length > 0
                ? interestedCategories.map((cat: any) => cat.name).join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-6 px-4 py-3 bg-gray-50'>
            <span className='w-60 font-semibold text-gray-700'>
              {t('Reading Statistics')}
            </span>
            <span className='text-left'>
              {myStatistics
                ? `Completed Summaries - ${myStatistics.summaries}, Key Points - ${myStatistics.key_points}`
                : 'N/A'}
            </span>
          </div>
          <div className='flex gap-6 px-4 py-3 bg-gray-50'>
            <span className='w-60 font-semibold text-gray-700'>
              {t('Subscription details')}
            </span>
            <span className='text-left'>
              {user?.userSubscriptionDetails?.is_active ? (
                <>
                  Start Date:{' '}
                  {getDateFromat(
                    user.userSubscriptionDetails.starts_at,
                    DATE_FORMAT.momentDateTime24Format
                  )}{' '}
                  , End Date:{' '}
                  {getDateFromat(
                    user.userSubscriptionDetails.expires_at,
                    DATE_FORMAT.momentDateTime24Format
                  )}{' '}
                  , Subscription Type:{' '}
                  {user.userSubscriptionDetails.is_trial
                    ? 'Trial'
                    : user.userSubscriptionDetails.product_name
                        ?.toLowerCase()
                        .includes('week')
                    ? 'Weekly'
                    : user.userSubscriptionDetails.product_name
                        ?.toLowerCase()
                        .includes('month')
                    ? 'Monthly'
                    : user.userSubscriptionDetails.product_name || 'N/A'}
                </>
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className='flex gap-6 px-4 py-3'>
            <span className='w-60 font-semibold text-gray-700'>
              {t('Achievements')}
            </span>
            <span className='text-left'>
              {[
                myAchievements?.perseverant?.level !== undefined
                  ? `Perseverant Level: ${myAchievements.perseverant.level}`
                  : null,
                myAchievements?.smart?.level !== undefined
                  ? `Smart Level: ${myAchievements.smart.level}`
                  : null,
                myAchievements?.wise?.level !== undefined
                  ? `Wise Level: ${myAchievements.wise.level}`
                  : null,
                myAchievements?.influencer?.level !== undefined
                  ? `Influencer Level: ${myAchievements.influencer.level}`
                  : null,
              ]
                .filter((item) => item !== null)
                .join(', ') || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
