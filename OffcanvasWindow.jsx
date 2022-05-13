import React from 'react';
import debug from 'snippet-debug';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OffcanvasMiniPaginationAssigned from './components/OffcanvasMiniPaginationAssigned';
import OffcanvasMiniPaginationAvailable from './components/OffcanvasMiniPaginationAvailable';

const OffcanvasWindow = ({ setSelectionState, ...props }) => {
    const _logger = debug.extend('Snippets - Offcanvas');
    _logger('!RUNNING!-');

    let assignedMembers = [];

    if (props.members) {
        assignedMembers = [...props.members].map((member) => {
            return { id: member.id };
        });
    }

    const [showOffcanvasState, setShowOffcanvasState] = React.useState(false);
    const [selectionOutputState, setSelectionOutputState] = React.useState(assignedMembers);

    function handleClose() {
        setShowOffcanvasState(false);

        if (selectionOutputState) {
            setSelectionState(selectionOutputState);
        }
    }
    function handleShow() {
        setShowOffcanvasState(true);

        if (selectionOutputState) {
            setSelectionOutputState(selectionReset(props));
        }
    }

    function selectionReset(props) {
        let result = [];

        if (props.members) {
            result = [...props.members].map((member) => {
                return { id: member.id };
            });
        }

        return result;
    }

    function drag(e) {
        e.dataTransfer.setData('text', e.target.id);
    }

    function allowDrop(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();

        let dropCardId = parseInt(e.dataTransfer.getData('text').split('-')[1]);
        let dropContainerLocation = e.target.className.split('-')[2];
        let data = e.dataTransfer.getData('text');

        //Check to ensure drop location is ONLY one of the correct locations
        if (dropContainerLocation === 'available' || dropContainerLocation === 'assigned') {
            dropAppendToDom(e, data, dropCardId, dropContainerLocation);
        }
    }

    function dropAppendToDom(e, data, dropCardId, dropContainerLocation) {
        let membersState = selectionOutputState;
        e.target.appendChild(document.getElementById(data));

        membersState = membersState.filter((element) => {
            return element.id !== dropCardId;
        });

        if (dropContainerLocation === 'assigned') {
            membersState = [...membersState, { id: dropCardId }];
        }

        setSelectionOutputState(membersState);
    }

    return (
        <React.Fragment>
            <Button className="modal-members-button" variant="primary" onClick={handleShow}>
                Snippet Members
            </Button>
            <Offcanvas show={showOffcanvasState} onHide={handleClose} placement="bottom">
                <Offcanvas.Header closeButton>
                    <div className="offcanvas-header">
                        <div>
                            <h4 className="offcanvas-title">
                                &nbsp;Editing snippet members for &apos;{props.name}&nbsp;
                                {`(${props.code})`}&apos;
                            </h4>
                        </div>
                        <div className="offcanvas-dragdrop-label">
                            <span className="offcanvas-dragdrop-arrows">
                                <span>🡄</span> Drag &amp; Drop <span>🡆</span>
                            </span>
                        </div>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="offcanvas-main-container">
                        <div className="offcanvas-dragdrop-container">
                            <div className="offcanvas-minicards">
                                <label>Available Snippets</label>
                                <div className="offcanvas-location-available" onDrop={drop} onDragOver={allowDrop}>
                                    <OffcanvasMiniPaginationAvailable {...props} drag={drag} />
                                </div>
                            </div>

                            <div className="offcanvas-minicards">
                                <label>Assigned Snippets</label>
                                <div className="offcanvas-location-assigned" onDrop={drop} onDragOver={allowDrop}>
                                    <OffcanvasMiniPaginationAssigned {...props} drag={drag} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </React.Fragment>
    );
};

OffcanvasWindow.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    members: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string, id: PropTypes.number, logo: PropTypes.string })
    ),
    setOffcanvasState: PropTypes.func,
    setSelectionState: PropTypes.func,
    drag: PropTypes.func,
};

export default OffcanvasWindow;
