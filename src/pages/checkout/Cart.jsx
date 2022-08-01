import React, { useEffect, useState, useRef, createRef } from 'react'
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
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

const GET_PRODUCT = gql`
  query Query($productId: ID!) {
  product(id: $productId) {
    id
    name
    price
    stock
    colors {
      name
      hexValue
    }
    pictures
  }
}
`;

export function Cart() {
  const [priceList, setPriceList] = useState([]);
  const price = useRef(null);
  const getCart = useQuery(GET_CART, {
    variables: {
      customerId: 1
    }
  });

  let listProduct = [];
  const [getProduct, productResult] = useLazyQuery(GET_PRODUCT, {
    onCompleted: data => {
      console.log(data)
      listProduct.push(data)
    }
  });

  const [updateCustomer, updateCustomerResult] = useMutation(UPDATE_CUSTOMER);

  if (getCart.loading) return <div>Loading...</div>
  if (updateCustomerResult.loading) return <div>Submitting...</div>

  if (getCart.data) {
    const productIds = getCart.data.customer.items.map(item => item.productId)

    // for (var productId in productIds) {
    //   getProduct({
    //     variables: {
    //       productId: productId
    //     }
    //   })
    // }
  }


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


                        <div><Product productId={item.productId} price={price} /></div>
                        <button type="button" onClick={() => {

                          getProduct({
                            variables: {
                              productId: item.productId
                            }
                          })


                        }}>Get Product</button>
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
                console.log(price.current)
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