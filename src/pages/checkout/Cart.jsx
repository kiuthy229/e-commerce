import React, { useEffect } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { Product } from './ProductInfo';
import { Fee } from './Fee';
import './Cart.css';
import { Formik, Form, Field, FieldArray } from 'formik';

const GET_CART = gql`
query Query($customerId: ID!) {
  customer(customerId: $customerId) {
    items {
      productId
      color
      size
      quantity
    }
    name
    location
  }
}
`;

const UPDATE_CUSTOMER = gql`
mutation($customer: CustomerInput!){
  updateCustomer(customer: $customer) {
    id
  }
}
`;

export function Cart() {
  const getCart = useQuery(GET_CART, {
    variables: {
      customerId: 1
    }
  });


  const [updateCustomer, { loading }] = useMutation(UPDATE_CUSTOMER);
  if (getCart.loading) return <div>Loading...</div>
  return (
    <Formik
      initialValues={{
        customerName: getCart.data.customer.name,
        location: getCart.data.customer.location,
        item: {
          itemProductId: '',
          itemColor: '',
          itemSize: '',
          itemQuantity: 0
        },
        productId: getCart.data.customer.items.map(item => item.productId),
        quantity: getCart.data.customer.items.map(item => item.quantity),
        color: getCart.data.customer.items.map(item => item.color),
        size: getCart.data.customer.items.map(item => item.size)
      }}
      validate={values => {
        const errors = {};
        if (!values.customerName) {
          errors.customerName = 'Required';
        }
        if (!values.location) {
          errors.location = 'Required';
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log('submitted');
        updateCustomer({
          variables: {
            customer: {
              name: values.customerName,
              location: values.location
            },
            items: {

            }
          }
        })
      }}
    >
      {
        ({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className='container'>

              <div>
                {getCart.data.customer.items.map((item, index) => (
                  <div className='product'>
                    <div>{item.color}</div>
                    <div>{item.size}</div>
                    <div>
                      <Field
                        type='number'
                        name={`quantity.${index}`}
                        placeholder='Customer Name'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.quantity[index]}
                        validate={() => {
                          let error;
                          if (!values.quantity[index]) {
                            error = 'Required';
                            console.log('invalid quan')
                          }
                          return error;
                        }}
                      />
                      {
                        errors.quantity && touched.quantity && errors.quantity
                      }
                    </div>
                    <Field
                      type='text'
                      name={`item[${index}].itemQuantity`}
                      onChange={handleChange}
                      value={values.quantity[index]}
                    />
                    <Field
                      type='text'
                      name={`item[${index}].itemProductId`}
                      onChange={handleChange}
                      value={values.productId[index]}
                    />
                    <Field
                      type='text'
                      name={`item[${index}].itemColor`}
                      onChange={handleChange}
                      value={values.color[index]}
                    />
                    <Field
                      type='text'
                      name={`item[${index}].itemSize`}
                      onChange={handleChange}
                      value={values.size[index]}
                    />
                    <div><Product productId={item.productId} /></div>
                  </div>
                ))}
                <div><Fee location={values.location} /></div>
              </div>


              <div>
                <Field
                  type='text'
                  name='customerName'
                  placeholder='Customer Name'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.customerName}
                />
                {errors.customerName && touched.customerName && errors.customerName}
                <Field
                  type='text'
                  name='location'
                  placeholder='Location'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                />
                {errors.location && touched.location && errors.location}

              </div>
            </div>
            <button
              type='button'
              onClick={() => {
                console.log(values)
              }}
            >
              Test
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )
      }

    </Formik>
  );
}