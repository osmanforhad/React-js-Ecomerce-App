import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function EditCategory(props) {

    const history = useHistory();
    const [Loading, setLoading] = useState(true);
    const [categoryInput, setCategory] = useState([]);
    const [Error, setError] = useState([]);

    useEffect(() => {

        const category_id = props.match.params.id;
        axios.get(`/api/edit-category/${category_id}`).then(res => {
            if (res.data.status === 200) {

                setCategory(res.data.categorys);

            } else if (res.data.status === 404) {

                swal("Error", res.data.message, 'error');
                history.push('/admin/view-category');
            }
            setLoading(false);
        });

    }, [props.match.params.id, history]);

    const handleInut = (e) => {
        e.persist();

        setCategory({ ...categoryInput, [e.target.name]: e.target.value });
    }

    const updateCategory = (e) => {
        e.preventDefault();

        const data = categoryInput;
        const category_id = props.match.params.id;
        axios.put(`/api/update-category/${category_id}`, data).then(res => {
            if (res.data.status === 200) {

                swal("Success", res.data.message, "success");
                setError([]);

            } else if (res.data.status === 422) {

                swal("All fields are mandatory", "", "error");
                setError(res.data.errors);

            } else if(res.data.status === 400) {

                swal("Error", res.data.message, "error");
                history.push('admin/view-category');

            }
        });
    }

    if (Loading) {
        return <h4>Loading Data...</h4>
    }

    return (
        <div className="container px-4">
            <div className="card mt-4">
                <div className="card-header">
                    <h4 className="mt-4">Edit Category
                        <Link to="/admin/view-category" className="btn btn-primary btn-sm float-end">Back</Link>
                    </h4>
                </div>
                <div className="card-body">
                    <form onSubmit={updateCategory}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <div className="form-group mb-3">
                                    <label>Slug</label>
                                    <input type="text" name="slug" onChange={handleInut} value={categoryInput.slug} className="form-control" />
                                    <small className="text-danger">{Error.slug}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Name</label>
                                    <input type="text" name="name" onChange={handleInut} value={categoryInput.name} className="form-control" />
                                    <small className="text-danger">{Error.name}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Description</label>
                                    <textarea name="description" onChange={handleInut} value={categoryInput.description} className="form-control"></textarea>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Status</label>
                                    <input type="checkbox" name="status" onChange={handleInut} value={categoryInput.status} /> status 0=shown/1=hidden
                                </div>
                            </div>
                            <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">
                                <div className="form-group mb-3">
                                    <label>Meta Title</label>
                                    <input type="text" name="meta_title" onChange={handleInut} value={categoryInput.meta_title} className="form-control" />
                                    <small className="text-danger">{Error.meta_title}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Meta Keywords</label>
                                    <textarea name="meta_keyword" onChange={handleInut} value={categoryInput.meta_keyword} className="form-control"></textarea>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Meta Description</label>
                                    <textarea name="meta_description" onChange={handleInut} value={categoryInput.meta_description} className="form-control"></textarea>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary px-4 mt-1 float-end">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditCategory;