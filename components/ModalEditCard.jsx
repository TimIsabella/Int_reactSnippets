import React from 'react';
import ModalWindow from '../ModalWindow';

const ModalEditCard = (props) => {
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
