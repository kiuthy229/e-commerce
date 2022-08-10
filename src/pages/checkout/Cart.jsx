import React, { useContext, useEffect, useCallback, useState, useRef } from 'react'
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { useNavigate, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { Product } from './ProductInfo';
import { Fee } from './Fee';
import './Cart.css';
import { Formik, Form, Field, FieldArray, getIn, ErrorMessage } from 'formik';
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
  //get userID from homepage
  const [customerId, setCustomerId] = useState(() => {
    const saved = window.localStorage.getItem("customerID");
    const initialValue = JSON.parse(saved);
    return initialValue || "";
  })

  // reduce function: group items with similar id
  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  //check redirect to another page
  const navigate = useNavigate();
  const getCart = useQuery(GET_CART, {
    variables: {
      customerId: customerId
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

  //Call function to check redirecting
  usePrompt("Leave screen?", isBlocking);
  useEffect(() => {
    const getItemGrouped = async () => {
      getLazyCart({
        variables: {
          customerId: customerId
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

  if (getCart.loading) return <div>Loading...</div>
  if (updateCustomerResult.loading) return <div>Submitting...</div>


  if (!customer) return <div>Loading... </div>
  else
    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          customer: { ...customer.customer }
        }}
        validate={values => {
          let errors = {};
          let empErrors = {};
          if (!values.customer.name) {
            empErrors.name = 'Required'
            errors.customer = empErrors;
          }
          if (values.customer.name.length >= 50) {
            empErrors.name = 'Name too long';
            errors.customer = empErrors;
          }
          if (!values.customer.location) {
            empErrors.location = 'Required';
            errors.customer = empErrors;
          }
          return errors;
        }}

        //Submit logic
        onSubmit={(values) => {
          setIsBlocking(false);
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
                      }
                    )

                    await updateQuantityDB({
                      variables: {
                        product: {
                          id: product.productId,
                          stock: currentQuantity - product.quantity
                        }
                      }
                    })
                  }
                  await emptyCart({
                    variables: {
                      customerId: customerId
                    }
                  })
                  navigate('/success', { replace: true })
                }
              )
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
            <Form id='checkoutForm'
              onSubmit={handleSubmit}
            >
              <div className='customerInfo'>
                <div className='title'>Customer Detail</div>
                <div>Username</div>
                <Field
                  className='textField'
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
                  value={values.customer.name}
                />
                <ErrorMessage name='customer.name' style={{ "color": "red" }}></ErrorMessage>
                <div>Location</div>
                <Field
                  error={errors.location}
                  className='textField'
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
                <ErrorMessage name='customer.location' ></ErrorMessage>

              </div>
              <div className='productInfo'>
                <div className='title'>Your Cart</div>
                <div>
                  {<FieldArray name='customer.items'>
                    {arrayHelpers => (<div>
                      {values.customer.items?.map((item, index) => (
                        <div className='product' id={index}>
                          <Product productId={item?.productId} />
                          <div>{item?.color}</div>
                          <div>{item?.size}</div>
                          <div>
                            Quantity
                            <Field
                              className='quantityInput'
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
                                if (value < 0) {
                                  error = 'Quantity cannot be negative';
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
                                  updatedQuantityList.splice(index, 1);
                                  setListQuantity(updatedQuantityList);
                                  let updatedPriceList = [...listPrice];
                                  updatedPriceList.splice(index, 1);

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

                        </div>
                      ))}
                    </div>)}
                  </FieldArray>}
                </div>

                <div style={{ "margin-top": "3vh" }}>
                  <Fee location={values.customer.location} />
                </div >
                <div className='fee'><span className='smallTitle'>Sub Total</span><span>{isNaN(subTotal) || !values.customer.location ? 'Not available' : subTotal}</span> </div>
                <div className='fee'><span className='smallTitle'>Total</span><span>{isNaN(total) || !values.customer.location ? 'Not available' : total}</span> </div>
                <button id='checkoutButton' type="submit" disabled={
                  isSubmitting
                  || !values.customer.location
                  || !values.customer.name
                  || subTotal === 0
                  || isNaN(subTotal)
                  || values.customer.name.length > 50
                }>
                  Checkout
                </button>
              </div>


            </Form >
          )
        }

      </Formik >
    );
}

function useBlocker(blocker, when = true) {
  const { navigator } = useContext(NavigationContext);
  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

function usePrompt(message, when = true) {
  const blocker = useCallback(
    (tx) => {
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );

  useBlocker(blocker, when);
}