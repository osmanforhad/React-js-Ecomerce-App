import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';


function Checkout() {

    const history = useHistory();
    if (!localStorage.getItem('auth_token')) {
        history.push('/');
        swal("Warning", "Please Login to go to Cart Page", "error");
    }


    const [loading, setLoading] = useState(true);
    const [cartdata, setCartdata] = useState([]);

    var totalCartPrice = 0;

    const [checkoutInput, setCheckoutInput] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
    });

    const [error, setError] = useState([]);

    useEffect(() => {

        let isMounted = true;

        axios.get(`/api/cart`).then(res => {

            if (isMounted) {
                if (res.data.status === 200) {
                    setCartdata(res.data.carts);
                    setLoading(false);
                } else if (res.data.status === 401) {

                    history.push('/');
                    swal("Warning", res.data.message, "error");
                }
            }

        });

        return () => {
            isMounted = false;
        }

    }, [history]);

    const handleInput = (e) => {
        e.persist();

        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    }

    const submitOrder = (e) => {
        e.preventDefault();

        const data = {
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            zipcode: checkoutInput.zipcode,
        }

        axios.post(`/api/place-order/`, data).then(res => {

            if (res.data.status === 200) {
                swal("Order Placed Successfully", res.data.message, "success");
                setError([]);
                history.push('/thank-you');
            } else if (res.data.status === 422) {
                swal("All fields are mandatory", "", "error");
                setError(res.data.errors);
            }

        });
    }


    if (loading) {

        return <h4>Loading... Checkout</h4>

    }

    var checkout_HTML = '';

    if (cartdata.length > 0) {

        checkout_HTML = <div>
            <div className="row">

                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">Shipping Address</h4>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>First Name</label>
                                        <input type="text" name="firstname" onChange={handleInput} value={checkoutInput.firstname} className="form-control" />
                                        <small className="text-danger">{error.firstname}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Last Name</label>
                                        <input type="text" name="lastname" onChange={handleInput} value={checkoutInput.lastname} className="form-control" />
                                        <small className="text-danger">{error.lastname}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Phone Number</label>
                                        <input type="text" name="phone" onChange={handleInput} value={checkoutInput.phone} className="form-control" />
                                        <small className="text-danger">{error.phone}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Email Address</label>
                                        <input type="text" name="email" onChange={handleInput} value={checkoutInput.email} className="form-control" />
                                        <small className="text-danger">{error.email}</small>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label>Full Address</label>
                                        <textarea rows="3" name="address" onChange={handleInput} value={checkoutInput.address} className="form-control"></textarea>
                                        <small className="text-danger">{error.address}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>City</label>
                                        <input type="text" name="city" onChange={handleInput} value={checkoutInput.city} className="form-control" />
                                        <small className="text-danger">{error.city}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>State</label>
                                        <input type="text" name="state" onChange={handleInput} value={checkoutInput.state} className="form-control" />
                                        <small className="text-danger">{error.state}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>Zip Code</label>
                                        <input type="text" name="zipcode" onChange={handleInput} value={checkoutInput.zipcode} className="form-control" />
                                        <small className="text-danger">{error.zipcode}</small>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <button type="button" className="btn btn-primary float-end" onClick={submitOrder}>Place Order</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card-header">
                        <h4 className="text-center">Your Shopping Cart</h4>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th width="50%">Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartdata.map((item, idx) => {
                                totalCartPrice += item.products.selling_price * item.product_qty;
                                return (
                                    <tr key={idx}>
                                        <td>{item.products.name}</td>
                                        <td>{item.products.selling_price}</td>
                                        <td>{item.product_qty}</td>
                                        <td>{item.products.selling_price * item.product_qty}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colSpan="2" className="text-end fw-bold">Grand Total</td>
                                <td colSpan="2" className="text-end fw-bold">{totalCartPrice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    } else {
        checkout_HTML = <div className="table-responsive">
            <div className="card card-body py-5 text-center shadow-sm">
                <h4>Your Shopping Cart is Empty. You are in Checkout page</h4>
            </div>
        </div>
    }

    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Checkout</h6>
                </div>
            </div>
            <div className="py-4">
                <div className="container">
                    {checkout_HTML}
                </div>
            </div>

        </div >
    )
}

export default Checkout;