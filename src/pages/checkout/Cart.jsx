import React, { useEffect, useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { Product } from './ProductInfo';
import { Fee } from './Fee';
import './Cart.css';
import { Formik, Form, Field, FieldArray } from 'formik';

const GET_CART = gql`
query Query($customerId: ID!) {
  customer(customerId: $customerId) {
    customerId: id
    name
    location
    items {
      productId
      color
      size
      quantity
    }
  }
}
`;

const UPDATE_CUSTOMER = gql`
mutation UpdateCustomer($customer: CustomerInput!){
  updateCustomer(customer: $customer) {
    id
  }
}
`;


export function Cart() {
  const [priceList, setPriceList] = useState([]);
  const getCart = useQuery(GET_CART, {
    variables: {
      customerId: 1
    }
  });
  const [updateCustomer, updateCustomerResult] = useMutation(UPDATE_CUSTOMER);



  if (getCart.loading) return <div>Loading...</div>
  if (updateCustomerResult.loading) return <div>Submitting...</div>

  return (
    <Formik
      initialValues={{
        customer: getCart.data.customer
      }}
      validate={values => {
        const errors = {};
        if (!values.customer.name) {
          errors.customerName = 'Required';
          console.log('invalid name')
        }
        if (!values.customer.location) {
          console.log('invalid loc')
          errors.location = 'Required';
        }
        return errors;
      }}
      onSubmit={(values) => {
        console.log(values.customer);
        updateCustomer({
          variables: {
            customer: values.customer
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
                <Field
                  type='text'
                  name='customer.name'
                  placeholder='Customer Name'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.customer.name}
                />
                {errors.customerName && touched.customerName && errors.customerName}
                <Field
                  type='text'
                  name='customer.location'
                  placeholder='Location'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.customer.location}
                />
                {errors.location && touched.location && errors.location}

              </div>
              <div>
                {<FieldArray name='item'>
                  {(helper) => (<div>
                    {values.customer.items.map((item, index) => (
                      <div className='product'>
                        <div>{item.color}</div>
                        <div>{item.size}</div>
                        <div>
                          <Field
                            type='number'
                            name={`customer.items.${index}.quantity`}
                            placeholder='Customer Name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={item.quantity}
                            validate={() => {
                              let error;
                              if (!item.quantity) {
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


                        <div><Product productId={item.productId} /></div>
                      </div>
                    ))}
                  </div>)}
                </FieldArray>}
                <div>
                  {

                    values.customer.items.map(item => item.quantity)
                  }
                </div>
                <div>
                  <Fee location={values.customer.location} />
                </div >
              </div>


            </div >
            <button
              type='button'
              onClick={() => {
                console.log(values)
                alert(JSON.stringify(values, null, 2));
              }}
            >
              Test
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form >
        )
      }

    </Formik >
  );
}
{/* <CartField name={`item[${index}]`} /> */ }