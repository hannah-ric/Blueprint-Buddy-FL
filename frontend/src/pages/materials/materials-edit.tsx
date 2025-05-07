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

import { update, fetch } from '../../stores/materials/materialsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditMaterialsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    name: '',

    description: '',

    nominal_size: '',

    actual_size: '',

    mechanical_properties: '',

    workshop: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { materials } = useAppSelector((state) => state.materials);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof materials === 'object') {
      setInitialValues(materials);
    }
  }, [materials]);

  useEffect(() => {
    if (typeof materials === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = materials[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [materials]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/materials/materials-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit materials')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit materials'}
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
                  as='textarea'
                  placeholder='Description'
                />
              </FormField>

              <FormField label='NominalSize'>
                <Field
                  type='number'
                  name='nominal_size'
                  placeholder='NominalSize'
                />
              </FormField>

              <FormField label='ActualSize'>
                <Field
                  type='number'
                  name='actual_size'
                  placeholder='ActualSize'
                />
              </FormField>

              <FormField label='MechanicalProperties' hasTextareaHeight>
                <Field
                  name='mechanical_properties'
                  as='textarea'
                  placeholder='MechanicalProperties'
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
                  onClick={() => router.push('/materials/materials-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditMaterialsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_MATERIALS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditMaterialsPage;
