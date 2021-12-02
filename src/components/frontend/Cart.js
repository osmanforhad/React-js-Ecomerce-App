import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';


function Cart() {

    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [cartdata, setCartdata] = useState([]);

    var totalCartPrice = 0;

    if (!localStorage.getItem('auth_token')) {
        history.push('/');
        swal("Warning", "Please Login to go to Cart Page", "error");
    }

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

    const handleDecrement = (cart_id) => {
        setCartdata(cartdata =>
            cartdata.map((item) =>
                cart_id === item.id ? { ...item, product_qty: item.product_qty - (item.product_qty > 1 ? 1 : 0) } : item
            )
        );
        updateCartQuantity(cart_id, "dec");
    }

    const handleIncrement = (cart_id) => {
        setCartdata(cartdata =>
            cartdata.map((item) =>
                cart_id === item.id ? { ...item, product_qty: item.product_qty + (item.product_qty < 10 ? 1 : 0) } : item
            )
        );
        updateCartQuantity(cart_id, "inc");
    }

    function updateCartQuantity(cart_id, scope) {

        axios.put(`/api/update-cartquantity/${cart_id}/${scope}`).then(res => {

            if (res.data.status === 200) {
                //swal("Success", res.data.message, "success");
            }
        });
    }

    const deleteCartItem = (e, cart_id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Removing";

        axios.delete(`/api/delete-cartitem/${cart_id}`).then(res => {

            if (res.data.status === 200) {

                swal("Success", res.data.message, "success");
                thisClicked.closest("tr").remove();

            } else if (res.data.status === 404) {

                swal("Error", res.data.message, "error");
                thisClicked.innerText = "Remove";
            }

        });

    }

    if (loading) {

        return <h4>Loading... Cart Details</h4>

    }

    var cart_TABLE = '';

    if (cartdata.length > 0) {

        cart_TABLE = <div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Quantity</th>
                            <th className="text-center">Total Price</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartdata.map((item, idx) => {
                            totalCartPrice += item.products.selling_price * item.product_qty;
                            return (
                                <tr key={idx}>
                                    <td width="10%">
                                        <img src={`http://localhost:8000/${item.products.image}`} alt={item.products.name} width="50px" height="50px" />
                                    </td>
                                    <td>{item.products.name}</td>
                                    <td width="15%" className="text-center">{item.products.selling_price}</td>
                                    <td width="15%">
                                        <div className="input-group">
                                            <button type="button" onClick={() => handleDecrement(item.id)} className="input-group-text">-</button>
                                            <div className="form-control text-center">{item.product_qty}</div>
                                            <button type="button" onClick={() => handleIncrement(item.id)} className="input-group-text">+</button>
                                        </div>
                                    </td>
                                    <td width="15%" className="text-center">{item.products.selling_price * item.product_qty}</td>
                                    <td width="10%">
                                        <button type="button" onClick={(e) => deleteCartItem(e, item.id)} className="btn btn-danger btn-sm">Remove</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="col-md-8"></div>
            <div className="col-md-4">
                <div className="card card-body mt-3">
                    <h4>Sub Total:
                        <span className="float-end">{totalCartPrice}</span>
                    </h4>
                    <h4>Grand Total:
                        <span className="float-end">{totalCartPrice}</span>
                    </h4>
                    <hr />
                    <Link to="/checkout" className="btn btn-primary">Checkout</Link>
                </div>
            </div>

        </div>

    } else {
        cart_TABLE = <div className="table-responsive">
            <div className="card card-body py-5 text-center shadow-sm">
                <h4>Your Shopping Cart is Empty</h4>
            </div>
        </div>
    }

    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Cart</h6>
                </div>
            </div>
            <div className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">

                            {cart_TABLE}

                        </div>


                    </div>
                </div>
            </div>
        </div>

    )

}

export default Cart;