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

import { update, fetch } from '../../stores/components/componentsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditComponents = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    name: '',

    description: '',

    standard_dimensions: '',

    recommended_materials: '',

    workshop: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { components } = useAppSelector((state) => state.components);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { componentsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: componentsId }));
  }, [componentsId]);

  useEffect(() => {
    if (typeof components === 'object') {
      setInitialValues(components);
    }
  }, [components]);

  useEffect(() => {
    if (typeof components === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = components[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [components]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: componentsId, data }));
    await router.push('/components/components-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit components')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit components'}
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
              <FormField label='Name'>
                <Field name='name' placeholder='Name' />
              </FormField>

              <FormField label='Description' hasTextareaHeight>
                <Field
                  name='description'
                  id='description'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='StandardDimensions'>
                <Field
                  type='number'
                  name='standard_dimensions'
                  placeholder='StandardDimensions'
                />
              </FormField>

              <FormField
                label='RecommendedMaterials'
                labelFor='recommended_materials'
              >
                <Field
                  name='recommended_materials'
                  id='recommended_materials'
                  component='select'
                >
                  <option value='wood'>wood</option>

                  <option value='metal'>metal</option>

                  <option value='glass'>glass</option>

                  <option value='acrylic'>acrylic</option>
                </Field>
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
                  onClick={() => router.push('/components/components-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditComponents.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_COMPONENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditComponents;
