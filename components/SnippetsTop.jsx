import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const SnippetsTop = () => {
    return (
        <>
            <div className="snippets-top">
                <div className="page-title-container">
                    <label className="page-title">Snippets</label>
                </div>
                <div className="page-breadcrumbs-container breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/dashboard/snipporium">Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active href="/snippets">
                            Parties
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </>
    );
};

export default SnippetsTop;
