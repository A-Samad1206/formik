import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  fname: 'Abdus',
  obj: {
    one: 'first',
    two: 'second',
  },
  phNoY: [{ num: '40' }, { num: '60' }],
};

const onSubmit = (values) => {
  console.log('Submits', values);
};

const validationSchema = Yup.object({
  fname: Yup.string()
    .required('Fname Required')
    .trim()
    .min(3, 'Minimum 3 Char')
    .max(50, 'Max 6 is enough!')
    .test((value) => {
      const len = value?.trim().split(' ').join('').length;
      return len >= 3
        ? true
        : new Yup.ValidationError('Dont be smart', undefined, 'fname');
    }),
  obj: Yup.object({
    one: Yup.string().required('One Required'),
    two: Yup.string().required('Two Required'),
  }),
  phNoY: Yup.array(Yup.object({ num: Yup.string().required('Required') }))
    .min(2, 'You need to provide at least 1 institution')
    .max(3, 'You can only provide 3 institution')

    .test((phNnu) => {
      phNnu = phNnu.map((v) => ({ ...v, num: Number(v.num) }));
      const sum = phNnu?.reduce((acc, curr) => acc + (curr.num || 0), 0);
      if (sum !== 100) {
        return new Yup.ValidationError(
          `Percentage should be 100%, but you have ${sum}%`,
          undefined,
          'phNoY'
        );
      }

      return true;
    }),
});

const index = () => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <label htmlFor="fname">First Name</label>
        <Field type="text" name="fname" id="fname" />
        <Error name="fname" />

        <label htmlFor="one">One</label>
        <Field type="text" name="obj.one" id="one" />
        <Error name="obj.one" />

        <label htmlFor="two">Two</label>
        <Field type="text" name="obj.two" id="two" />
        <Error name="obj.two" />

        <FieldArray name="phNoY">
          {(props) => {
            const {
              push,
              remove,
              insert,
              form: {
                values: { phNoY },
              },
            } = props;
            return (
              <div>
                {phNoY.length > 0 ? (
                  phNoY.map((_val, index) => (
                    <div key={index}>
                      <label htmlFor={index}>Phone {index + 1}</label>
                      <Field
                        type="text"
                        name={`phNoY[${index}].num`}
                        id={index}
                      />
                      {
                        <button type="button" onClick={() => remove(index)}>
                          -
                        </button>
                      }
                      <button
                        type="button"
                        onClick={() => insert(index + 1, { num: '' })}
                      >
                        +
                      </button>
                      <Error name={`phNoY[${index}].num`} />
                    </div>
                  ))
                ) : (
                  <button type="button" onClick={() => push({ num: '' })}>
                    Add
                  </button>
                )}
                {typeof props.form.errors.phNoY === 'string' && (
                  <Error name={`phNoY`} />
                )}
              </div>
            );
          }}
        </FieldArray>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default index;
const Error = ({ name }) => {
  return (
    <div className="error">
      <ErrorMessage name={name} />
    </div>
  );
};
