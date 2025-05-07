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

import {
  update,
  fetch,
} from '../../stores/joinery_methods/joinery_methodsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditJoinery_methods = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    name: '',

    description: '',

    strength_rating: '',

    compatible_materials: '',

    workshop: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { joinery_methods } = useAppSelector((state) => state.joinery_methods);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { joinery_methodsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: joinery_methodsId }));
  }, [joinery_methodsId]);

  useEffect(() => {
    if (typeof joinery_methods === 'object') {
      setInitialValues(joinery_methods);
    }
  }, [joinery_methods]);

  useEffect(() => {
    if (typeof joinery_methods === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = joinery_methods[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [joinery_methods]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: joinery_methodsId, data }));
    await router.push('/joinery_methods/joinery_methods-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit joinery_methods')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit joinery_methods'}
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

              <FormField label='StrengthRating'>
                <Field
                  type='number'
                  name='strength_rating'
                  placeholder='StrengthRating'
                />
              </FormField>

              <FormField
                label='CompatibleMaterials'
                labelFor='compatible_materials'
              >
                <Field
                  name='compatible_materials'
                  id='compatible_materials'
                  component='select'
                >
                  <option value='wood'>wood</option>

                  <option value='metal'>metal</option>
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
                  onClick={() =>
                    router.push('/joinery_methods/joinery_methods-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditJoinery_methods.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_JOINERY_METHODS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditJoinery_methods;
