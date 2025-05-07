import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

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
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/build_plans/build_plansSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditBuild_plans = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    components: [],

    materials: [],

    joinery_methods: [],

    hardware_fasteners: [],

    created_date: new Date(),

    modified_date: new Date(),

    workshop: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { build_plans } = useAppSelector((state) => state.build_plans);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { build_plansId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: build_plansId }));
  }, [build_plansId]);

  useEffect(() => {
    if (typeof build_plans === 'object') {
      setInitialValues(build_plans);
    }
  }, [build_plans]);

  useEffect(() => {
    if (typeof build_plans === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = build_plans[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [build_plans]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: build_plansId, data }));
    await router.push('/build_plans/build_plans-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit build_plans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit build_plans'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
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
                  component={SelectFieldMany}
                  options={initialValues.components}
                  itemRef={'components'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='Materials' labelFor='materials'>
                <Field
                  name='materials'
                  id='materials'
                  component={SelectFieldMany}
                  options={initialValues.materials}
                  itemRef={'materials'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='JoineryMethods' labelFor='joinery_methods'>
                <Field
                  name='joinery_methods'
                  id='joinery_methods'
                  component={SelectFieldMany}
                  options={initialValues.joinery_methods}
                  itemRef={'joinery_methods'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField
                label='Hardware&Fasteners'
                labelFor='hardware_fasteners'
              >
                <Field
                  name='hardware_fasteners'
                  id='hardware_fasteners'
                  component={SelectFieldMany}
                  options={initialValues.hardware_fasteners}
                  itemRef={'hardware_fasteners'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='CreatedDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.created_date
                      ? new Date(
                          dayjs(initialValues.created_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, created_date: date })
                  }
                />
              </FormField>

              <FormField label='ModifiedDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.modified_date
                      ? new Date(
                          dayjs(initialValues.modified_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, modified_date: date })
                  }
                />
              </FormField>

              <FormField label='workshop' labelFor='workshop'>
                <Field
                  name='workshop'
                  id='workshop'
                  component={SelectField}
                  options={initialValues.workshop}
                  itemRef={'workshop'}
                  showField={'name'}
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

EditBuild_plans.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_BUILD_PLANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditBuild_plans;
