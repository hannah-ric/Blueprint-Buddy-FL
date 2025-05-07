import React from 'react';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import dataFormatter from '../../helpers/dataFormatter';
import { saveFile } from '../../helpers/fileSaver';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import { Pagination } from '../Pagination';
import LoadingSpinner from '../LoadingSpinner';
import Link from 'next/link';

import { hasPermission } from '../../helpers/userPermissions';

type Props = {
  build_plans: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const ListBuild_plans = ({
  build_plans,
  loading,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_BUILD_PLANS');

  const corners = useAppSelector((state) => state.style.corners);
  const bgColor = useAppSelector((state) => state.style.cardsColor);

  return (
    <>
      <div className='relative overflow-x-auto p-4 space-y-4'>
        {loading && <LoadingSpinner />}
        {!loading &&
          build_plans.map((item) => (
            <CardBox
              hasTable
              isList
              key={item.id}
              className={'rounded shadow-none'}
            >
              <div
                className={`flex ${bgColor} ${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                }  dark:bg-dark-900  border  border-stone-300  items-center overflow-hidden`}
              >
                <Link
                  href={`/build_plans/build_plans-view/?id=${item.id}`}
                  className={
                    'flex-1 px-4 py-6 h-24 flex divide-x-2  divide-stone-300   items-center overflow-hidden`}> dark:divide-dark-700 overflow-x-auto'
                  }
                >
                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>Title</p>
                    <p className={'line-clamp-2'}>{item.title}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>Components</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter
                        .componentsManyListFormatter(item.components)
                        .join(', ')}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>Materials</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter
                        .materialsManyListFormatter(item.materials)
                        .join(', ')}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>JoineryMethods</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter
                        .joinery_methodsManyListFormatter(item.joinery_methods)
                        .join(', ')}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>
                      Hardware&Fasteners
                    </p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter
                        .hardware_fastenersManyListFormatter(
                          item.hardware_fasteners,
                        )
                        .join(', ')}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>CreatedDate</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.dateTimeFormatter(item.created_date)}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs   text-gray-500 '}>ModifiedDate</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.dateTimeFormatter(item.modified_date)}
                    </p>
                  </div>
                </Link>
                <ListActionsPopover
                  onDelete={onDelete}
                  itemId={item.id}
                  pathEdit={`/build_plans/build_plans-edit/?id=${item.id}`}
                  pathView={`/build_plans/build_plans-view/?id=${item.id}`}
                  hasUpdatePermission={hasUpdatePermission}
                />
              </div>
            </CardBox>
          ))}
        {!loading && build_plans.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No data to display</p>
          </div>
        )}
      </div>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </>
  );
};

export default ListBuild_plans;
