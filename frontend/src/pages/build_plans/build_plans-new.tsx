import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/build_plans/build_plansSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  title: '',

  components: [],

  materials: [],

  joinery_methods: [],

  hardware_fasteners: [],

  created_date: '',

  modified_date: '',

  workshop: '',
};

const Build_plansNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // get from url params
  const { dateRangeStart, dateRangeEnd } = router.query;

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/build_plans/build_plans-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={
              dateRangeStart && dateRangeEnd
                ? {
                    ...initialValues,
                    created_date:
                      moment(dateRangeStart).format('YYYY-MM-DDTHH:mm'),
                    modified_date:
                      moment(dateRangeEnd).format('YYYY-MM-DDTHH:mm'),
                  }
                : initialValues
            }
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Title'>
                <Field name='title' placeholder='Title' />
              </FormField>

              <FormField label='Components' labelFor='components'>
                <Field
                  name='components'
                  id='components'
                  itemRef={'components'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label='Materials' labelFor='materials'>
                <Field
                  name='materials'
                  id='materials'
                  itemRef={'materials'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label='JoineryMethods' labelFor='joinery_methods'>
                <Field
                  name='joinery_methods'
                  id='joinery_methods'
                  itemRef={'joinery_methods'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField
                label='Hardware&Fasteners'
                labelFor='hardware_fasteners'
              >
                <Field
                  name='hardware_fasteners'
                  id='hardware_fasteners'
                  itemRef={'hardware_fasteners'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label='CreatedDate'>
                <Field
                  type='datetime-local'
                  name='created_date'
                  placeholder='CreatedDate'
                />
              </FormField>

              <FormField label='ModifiedDate'>
                <Field
                  type='datetime-local'
                  name='modified_date'
                  placeholder='ModifiedDate'
                />
              </FormField>

              <FormField label='workshop' labelFor='workshop'>
                <Field
                  name='workshop'
                  id='workshop'
                  component={SelectField}
                  options={[]}
                  itemRef={'workshop'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/build_plans/build_plans-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

Build_plansNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_BUILD_PLANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Build_plansNew;
