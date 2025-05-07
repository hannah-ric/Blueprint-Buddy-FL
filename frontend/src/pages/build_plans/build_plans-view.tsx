import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/build_plans/build_plansSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const Build_plansView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { build_plans } = useAppSelector((state) => state.build_plans);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View build_plans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View build_plans')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/build_plans/build_plans-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Title</p>
            <p>{build_plans?.title}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Components</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>StandardDimensions</th>

                      <th>RecommendedMaterials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {build_plans.components &&
                      Array.isArray(build_plans.components) &&
                      build_plans.components.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/components/components-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='standard_dimensions'>
                            {item.standard_dimensions}
                          </td>

                          <td data-label='recommended_materials'>
                            {item.recommended_materials}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!build_plans?.components?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Materials</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Description</th>

                      <th>NominalSize</th>

                      <th>ActualSize</th>

                      <th>MechanicalProperties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {build_plans.materials &&
                      Array.isArray(build_plans.materials) &&
                      build_plans.materials.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/materials/materials-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='description'>{item.description}</td>

                          <td data-label='nominal_size'>{item.nominal_size}</td>

                          <td data-label='actual_size'>{item.actual_size}</td>

                          <td data-label='mechanical_properties'>
                            {item.mechanical_properties}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!build_plans?.materials?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>JoineryMethods</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Description</th>

                      <th>StrengthRating</th>

                      <th>CompatibleMaterials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {build_plans.joinery_methods &&
                      Array.isArray(build_plans.joinery_methods) &&
                      build_plans.joinery_methods.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/joinery_methods/joinery_methods-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='description'>{item.description}</td>

                          <td data-label='strength_rating'>
                            {item.strength_rating}
                          </td>

                          <td data-label='compatible_materials'>
                            {item.compatible_materials}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!build_plans?.joinery_methods?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Hardware&Fasteners</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Description</th>

                      <th>Diameter</th>

                      <th>Length</th>

                      <th>Head/DriveType</th>
                    </tr>
                  </thead>
                  <tbody>
                    {build_plans.hardware_fasteners &&
                      Array.isArray(build_plans.hardware_fasteners) &&
                      build_plans.hardware_fasteners.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/hardware_fasteners/hardware_fasteners-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='description'>{item.description}</td>

                          <td data-label='diameter'>{item.diameter}</td>

                          <td data-label='length'>{item.length}</td>

                          <td data-label='head_drive_type'>
                            {item.head_drive_type}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!build_plans?.hardware_fasteners?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <FormField label='CreatedDate'>
            {build_plans.created_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  build_plans.created_date
                    ? new Date(
                        dayjs(build_plans.created_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No CreatedDate</p>
            )}
          </FormField>

          <FormField label='ModifiedDate'>
            {build_plans.modified_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  build_plans.modified_date
                    ? new Date(
                        dayjs(build_plans.modified_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No ModifiedDate</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>workshop</p>

            <p>{build_plans?.workshop?.name ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/build_plans/build_plans-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Build_plansView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_BUILD_PLANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Build_plansView;
