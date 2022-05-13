import React from 'react';
import debug from 'snippet-debug';
import Button from 'react-bootstrap/Button';
import ModalWindow from '../ModalWindow';

const ModalNewCard = (props) => {
    const _logger = debug.extend('Snippets - ModalNewCard');
    _logger('!RUNNING!');

    const [open, setOpen] = React.useState(false);

    return (
        <>
            {open && <ModalWindow props={props} setOpen={setOpen} />}
            <Button
                className="snippet-new-button"
                variant="success"
                size="sm"
                onClick={() => {
                    setOpen(true);
                }}>
                New Snippet
            </Button>
        </>
    );
};

export default ModalNewCard;
