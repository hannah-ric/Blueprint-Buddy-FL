import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/workshop/workshopSlice';
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

const WorkshopView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { workshop } = useAppSelector((state) => state.workshop);

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
        <title>{getPageTitle('View workshop')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View workshop')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/workshop/workshop-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{workshop?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Workshop</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshop.users_workshop &&
                      Array.isArray(workshop.users_workshop) &&
                      workshop.users_workshop.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!workshop?.users_workshop?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Build_plans workshop</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>CreatedDate</th>

                      <th>ModifiedDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshop.build_plans_workshop &&
                      Array.isArray(workshop.build_plans_workshop) &&
                      workshop.build_plans_workshop.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/build_plans/build_plans-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='created_date'>
                            {dataFormatter.dateTimeFormatter(item.created_date)}
                          </td>

                          <td data-label='modified_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.modified_date,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!workshop?.build_plans_workshop?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Components workshop</p>
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
                    {workshop.components_workshop &&
                      Array.isArray(workshop.components_workshop) &&
                      workshop.components_workshop.map((item: any) => (
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
              {!workshop?.components_workshop?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Hardware_fasteners workshop
            </p>
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
                    {workshop.hardware_fasteners_workshop &&
                      Array.isArray(workshop.hardware_fasteners_workshop) &&
                      workshop.hardware_fasteners_workshop.map((item: any) => (
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
              {!workshop?.hardware_fasteners_workshop?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Joinery_methods workshop</p>
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
                    {workshop.joinery_methods_workshop &&
                      Array.isArray(workshop.joinery_methods_workshop) &&
                      workshop.joinery_methods_workshop.map((item: any) => (
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
              {!workshop?.joinery_methods_workshop?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Materials workshop</p>
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
                    {workshop.materials_workshop &&
                      Array.isArray(workshop.materials_workshop) &&
                      workshop.materials_workshop.map((item: any) => (
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
              {!workshop?.materials_workshop?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/workshop/workshop-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

WorkshopView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_WORKSHOP'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default WorkshopView;
