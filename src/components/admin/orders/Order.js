import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Order() {

    document.title = "View Orders";
    var display_orders = "";
    const [loading, setLoading] = useState(true);
    const [Orders, setOrders] = useState([]);

    useEffect(() => {

        axios.get(`/api/admin/orders`).then(res => {

            if (res.data.status === 200) {

                setOrders(res.data.orders);
                setLoading(false);
            }
        });

    }, []);

    if (loading) {
        return <h4>Loading... Orders record</h4>
    } else {
        display_orders = Orders.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.traking_no}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>
                        <Link to={`view-order/${item.id}`} className="btn btn-success btn-sm">View</Link>
                    </td>
                </tr>
            )
        });
    }

    return (
        <div className="card px-4 mt-3">
            <div className="card-header">
                <h4>Order history</h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tracking No</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_orders}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Order
