import React from 'react';
import debug from 'snippet-debug';
import ModalWindow from '../ModalWindow';

const ModalEditCard = (props) => {
    const _logger = debug.extend('Snippets - ModalEditCard');
    _logger('!RUNNING!');

    const [open, setOpen] = React.useState(false);

    return (
        <>
            {open && <ModalWindow props={props} setOpen={setOpen} />}
            <button
                className="card-edit-button"
                type="button"
                onClick={() => {
                    setOpen(true);
                }}>
                •••
            </button>
        </>
    );
};

export default ModalEditCard;
