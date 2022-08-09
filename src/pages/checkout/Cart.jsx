import React, { useContext, useEffect, useCallback, useState, useRef } from 'react'
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { useNavigate, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { Product } from './ProductInfo';
import { Fee } from './Fee';
import './Cart.css';
import { Formik, Form, Field, FieldArray } from 'formik';
import NavBar from "../../common/navbar/NavBar";
import { Overlay, Tooltip, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


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

const UPDATE_QUANTITY_DB = gql`
  mutation UpdateQuantityDB($product: UpdateProductInput!) {
    updateProduct(product: $product) {
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

const GET_FEE = gql`
  query Query($location: String!) {
    fee(location: $location) {
      shipping
      tax
    }
  }
`;

const EMPTY_CART = gql`
mutation EmptyCart($customerId: ID!) {
  emptyCart(customerId: $customerId) {
    id
  }
}
`
export function Cart() {

  // reduce function
  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };


  const navigate = useNavigate();
  const getCart = useQuery(GET_CART, {
    variables: {
      customerId: 1
    }
  });
  const [showPopupName, setShowPopupName] = useState(false);
  const targetName = useRef(null);
  const containerName = useRef(null);
  const [showPopupLocation, setShowPopupLocation] = useState(false);
  const targetLocation = useRef(null);
  const containerLocation = useRef(null);
  const [showModelQuantity, setShowModelQuantity] = useState(false);
  let [markedDelete, setMarkedDelete] = useState(-1);

  const [getLazyCart, lazyCartResult] = useLazyQuery(GET_CART);
  const [getLazyFee, lazyFeeResult] = useLazyQuery(GET_FEE);
  let [listQuantity, setListQuantity] = useState([]);
  let [listPrice, setListPrice] = useState([]);
  let [listStock, setListStock] = useState([]);
  let [subTotal, setSubTotal] = useState(0);
  let [shipping, setShipping] = useState(0);
  let [tax, setTax] = useState(0);
  let [total, setTotal] = useState(0);
  let [customer, setCustomer] = useState({});
  let [isBlocking, setIsBlocking] = useState(false);
  const [getProduct, productResult] = useLazyQuery(GET_PRODUCT);
  const [updateCustomer, updateCustomerResult] = useMutation(UPDATE_CUSTOMER);
  const [updateQuantityDB, QuantityDBResult] = useMutation(UPDATE_QUANTITY_DB);
  const [emptyCart, emptyCartResult] = useMutation(EMPTY_CART);
  usePrompt("Leave screen?", isBlocking);
  useEffect(() => {
    const getItemGrouped = async () => {
      getLazyCart({
        variables: {
          customerId: 1
        }
      })
        .then(
          async value => {
            let shipping = 0;
            let tax = 0;
            let sum = 0;
            let quantity = 0;
            getLazyFee({
              variables: {
                location: value.data.customer.location
              }
            }).then(
              async value => {
                shipping = value.data.fee.shipping;
                tax = value.data.fee.tax;
                setShipping(shipping);
                setTax(tax);
              }
            )

            //logic to group item with similar id (name, color, size, price)
            var tmpCus = { ...value.data }
            var tmpCusData = { ...value.data.customer }
            let itemgroup = Object.entries(groupBy(value.data.customer.items, 'productId'));
            let itemArray = [];
            for (var arr of itemgroup) {
              let itemQuantity = arr[1]
              let anItem = arr[1][0]
              console.log('arr', arr)
              let count = 0;
              for (var iq of itemQuantity) {
                count += iq.quantity
              }
              let aItemGroup = {
                productId: anItem.productId,
                color: anItem.color,
                size: anItem.size,
                quantity: count
              };
              itemArray.push(aItemGroup);
              quantity = aItemGroup.quantity;
              setListQuantity(listQuantity => [...listQuantity, aItemGroup.quantity]);

              //calculate subtotal, total
              await getProduct({
                variables: {
                  productId: arr[0]
                }
              })
                .then(
                  value => {
                    sum += value.data.product.price * quantity;
                    setListPrice(listPrice => [...listPrice, value.data.product.price]);
                    setListStock(listStock => [...listStock, value.data.product.stock]);

                    setSubTotal(sum);
                    setTotal(sum + sum * tax + shipping)
                  }
                )
            }
            let tmpItemArray = [...itemArray]
            tmpCusData.items = tmpItemArray;
            tmpCus.customer = { ...tmpCusData }
            let tmp = { ...tmpCus }
            setCustomer(tmp);
          }
        )
    }
    getItemGrouped();
  }, [getProduct, getLazyCart, getLazyFee, setListQuantity, setCustomer, setShipping, setSubTotal, setTotal, setTax]);
  // console.log('tax ', tax)
  // console.log('shipping ', shipping)
  // console.log('sub total  ', subTotal)
  // console.log(' total  ', total)
  //console.log('cust', customer)
  console.log('list stock ', listStock)
  console.log('list price ', listPrice)

  if (getCart.loading) return <div>Loading...</div>
  if (updateCustomerResult.loading) return <div>Submitting...</div>


  if (!customer) return <div>Loading... </div>
  else
    return (
      <div className='body'>
        <Formik
          enableReinitialize={true}
          initialValues={{
            customer: { ...customer.customer }
          }}
          validate={values => {
            const errors = {};
            if (!values.customer.name) {
              errors.customerName = 'Required';
              console.log('invalid name')
            }
            if (values.customer.name.length >= 50) {
              errors.customerName = 'Name too long';
              console.log('Name too long')
            }
            if (!values.customer.location) {
              console.log('invalid loc')
              errors.location = 'Required';
            }
            return errors;
          }}
          onSubmit={(values) => {
            setIsBlocking(false);
            console.log(values.customer);
            updateCustomer({
              variables: {
                customer: values.customer
              }
            }).then(
              (value) => {
                getLazyCart({
                  variables: {
                    customerId: value.data.updateCustomer.id
                  }
                }).then(
                  async (value) => {
                    for (var product of value.data.customer.items.map(item => item)) {
                      var currentQuantity = 0;
                      await getProduct({
                        variables: {
                          productId: product.productId
                        }
                      }).then(
                        value => {
                          currentQuantity = value.data.product.stock;
                          console.log('get product: ', value)
                        }
                      )
                      console.log(currentQuantity)

                      await updateQuantityDB({
                        variables: {
                          product: {
                            id: product.productId,
                            stock: currentQuantity - product.quantity
                          }
                        }
                      }).then(
                        value => {
                          console.log('update in db: ', value);
                        }
                      )
                      console.log('final', currentQuantity - product.quantity)

                    }
                    console.log('customer get lazy cart', value)
                    await emptyCart({
                      variables: {
                        customerId: 1
                      }
                    })
                    navigate('/success', { replace: true })
                  }
                )
                console.log('checkout success get cust id: ', value.data.updateCustomer.id);
              }
            )
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
              isSubmitting,
              setFieldValue
            }) => (
              <Form
                onSubmit={handleSubmit}
              >
                <div className='container'>
                  <div>
                    <div ref={containerName}>
                      <Field
                        type='text'
                        name='customer.name'
                        placeholder='Customer Name'
                        onChange={(e) => {
                          handleChange(e);
                          setIsBlocking(true)
                          if (e.target.value.length > 50) {
                            setShowPopupName(true)
                          }
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                          if (!e.target.value) {
                            setShowPopupName(true);
                          } else {
                            setShowPopupName(false);
                          }
                        }}
                        ref={targetName}
                        value={values.customer.name}
                      />
                      <Overlay target={targetName.current} show={showPopupName} placement='right' container={containerName}>
                        {(props) => (
                          <Tooltip {...props} ref={targetName}>
                            String less than 50 characters, required
                          </Tooltip>
                        )}
                      </Overlay>
                    </div>

                    {errors.customerName && touched.customerName && errors.customerName}
                    <div ref={containerLocation}>
                      <Field
                        type='text'
                        name='customer.location'
                        placeholder='Location'
                        ref={targetLocation}
                        onChange={(e) => {
                          handleChange(e);
                          setIsBlocking(true)
                          let tmpShipping = 0;
                          let tmpTax = 0;
                          getLazyFee({
                            variables: {
                              location: e.target.value
                            }
                          })
                            .then(
                              async value => {
                                tmpShipping = (value.data?.fee.shipping)
                                tmpTax = (value.data?.fee.tax)
                                setShipping(value.data?.fee.shipping);
                                setTax(value.data?.fee.tax)
                              }
                            )
                            .then(
                              async () => {
                                setTotal(subTotal + subTotal * tmpTax + tmpShipping)
                              }
                            )
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                          if (!e.target.value) {
                            setShowPopupLocation(true);
                          } else {
                            setShowPopupLocation(false);
                          }
                        }}
                        value={values.customer.location}
                      />
                      <Overlay target={targetLocation.current} show={showPopupLocation} placement='right' container={containerLocation}>
                        {(props) => (
                          <Tooltip {...props} ref={targetLocation}>
                            Required
                          </Tooltip>
                        )}
                      </Overlay>
                    </div>

                    {errors.location && touched.location && errors.location}

                  </div>
                  <div>
                    {<FieldArray name='customer.items'>
                      {arrayHelpers => (<div>
                        {values.customer.items?.map((item, index) => (
                          <div className='product' id={index}>
                            <div>
                              <Field
                                type='checkbox'
                                name='customer.items'
                                onChange={(e) => {
                                  handleChange(e);
                                  setIsBlocking(true)
                                  const value = e.target.checked ? item : null
                                  if (e.target.checked) {
                                    arrayHelpers.move(index, values.customer.items.length - 1)
                                  }
                                }}
                              ></Field>
                            </div>
                            <div>{item?.color}</div>
                            <div>{item?.size}</div>
                            <div>
                              <Field
                                type='number'
                                min={0}
                                max={listStock[index]}
                                name={`customer.items.${index}.quantity`}
                                placeholder='Quantity'
                                onChange={async (e) => {
                                  handleChange(e);
                                  setIsBlocking(true)
                                  //handle update subtotal, total
                                  let tmpQuantity = e.target.value;
                                  console.log('quantity arr ', tmpQuantity);
                                  let updatedQuantityList = [...listQuantity];
                                  updatedQuantityList[index] = parseInt(e.target.value);
                                  if (tmpQuantity == 0) {
                                    updatedQuantityList[index] = 1;
                                    setShowModelQuantity(true);
                                    setMarkedDelete(index)
                                  }
                                  setListQuantity(updatedQuantityList);
                                  let sum = updatedQuantityList.reduce((r, a, i) => {
                                    return r + a * listPrice[i]
                                  }, 0);
                                  setSubTotal(sum);
                                  setTotal(sum + sum * tax + shipping);
                                }}
                                onBlur={handleBlur}
                                value={item?.quantity}
                                validate={(value) => {
                                  let error;
                                  // if (!value) {
                                  //   error = 'Required';
                                  //   console.log('invalid quan')
                                  // }
                                  if (value < 0) {
                                    error = 'Quantity cannot be negative';
                                    console.log('Quantity cannot be negative')
                                  }
                                  return error;
                                }}
                              />
                              <Modal id={index} show={markedDelete == index}>
                                <Modal.Header>
                                  <Modal.Title>Delete item</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Do you want to delete this item?</Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={() => {
                                    setShowModelQuantity(false);
                                    item.quantity = 1;

                                    setMarkedDelete(-1);
                                  }}>
                                    Cancel
                                  </Button>
                                  <Button variant="primary" onClick={() => {
                                    setShowModelQuantity(false);
                                    let updatedQuantityList = [...listQuantity];
                                    console.log('updatedQuantityList', updatedQuantityList)
                                    updatedQuantityList.splice(index, 1);
                                    console.log('updatedQuantityList aft', updatedQuantityList)
                                    setListQuantity(updatedQuantityList);
                                    let updatedPriceList = [...listPrice];
                                    console.log('updatedPriceList', updatedPriceList)
                                    updatedPriceList.splice(index, 1);
                                    console.log('updatedPriceList aft', updatedPriceList)

                                    setListPrice(updatedPriceList);
                                    let sum = updatedQuantityList.reduce((r, a, i) => {
                                      return r + a * updatedPriceList[i]
                                    }, 0);
                                    setSubTotal(sum);
                                    setTotal(sum + sum * tax + shipping);
                                    arrayHelpers.remove(index);
                                    setMarkedDelete(-1);
                                  }}>
                                    Delete
                                  </Button>
                                </Modal.Footer>
                              </Modal>

                            </div>
                            <div><Product productId={item?.productId} /></div>
                          </div>
                        ))}
                      </div>)}
                    </FieldArray>}
                    <div>
                      <Fee location={values.customer.location} />
                    </div >
                    <div>Sub Total {isNaN(subTotal) || !values.customer.location ? 'Not available' : subTotal}</div>
                    <div>Total {isNaN(total) || !values.customer.location ? 'Not available' : total}</div>
                    <button type="submit" disabled={
                      isSubmitting
                      || !values.customer.location
                      || !values.customer.name
                      || subTotal === 0
                      || isNaN(subTotal)
                    }>
                      Submit
                    </button>
                  </div>
                </div >


              </Form >
            )
          }

        </Formik >
      </div>
    );
}
/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *
 * @param  blocker
 * @param  when
 * @see https://reactrouter.com/api/useBlocker
 */
function useBlocker(blocker, when = true) {
  const { navigator } = useContext(NavigationContext);

  console.log('navigator ', navigator)
  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}
/**
 * Prompts the user with an Alert before they leave the current screen.
 *
 * @param  message
 * @param  when
 */
function usePrompt(message, when = true) {
  const blocker = useCallback(
    (tx) => {
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );

  useBlocker(blocker, when);
}