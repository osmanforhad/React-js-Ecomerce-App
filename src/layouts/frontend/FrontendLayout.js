import React from "react";
import { Route, Switch } from 'react-router-dom';
import Navbar from "../../layouts/frontend/Navbar";
import PublicRotueList from "../../routes/PublicRotueList";

const FrontendLayout = () => {

    return (
        <div>
            <Navbar />

            <div>

                <Switch>
                    {PublicRotueList.map((routedata, idx) => {
                        return (
                            routedata.component && (
                                <Route
                                    key={idx}
                                    path={routedata.path}
                                    exact={routedata.exact}
                                    name={routedata.name}
                                    render={(props) => (
                                        <routedata.component {...props} />
                                    )}
                                />
                            )
                        )
                    })}

                </Switch>
            </div>
        </div>
    );

}

export default FrontendLayout;