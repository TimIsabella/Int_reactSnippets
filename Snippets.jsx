import React from 'react';
import debug from 'snippet-debug';
import './snippets.css';
import SnippetCardPagination from './components/SnippetCardPagination';
import SnippetsTop from './components/SnippetsTop';

const Snippets = () => {
    const _logger = debug.extend('Snippets');

    _logger('!RUNNING!');

    return (
        <div className="sippets">
            <SnippetsTop />
            <SnippetCardPagination />
        </div>
    );
};

export default Snippets;
