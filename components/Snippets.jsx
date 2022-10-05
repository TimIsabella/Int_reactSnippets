import React from 'react';
import './snippets.css';
import SnippetCardPagination from './components/SnippetCardPagination';
import SnippetsTop from './components/SnippetsTop';

const Snippets = () => {
    return (
        <div className="snippets">
            <SnippetsTop />
            <SnippetCardPagination />
        </div>
    );
};

export default Snippets;
