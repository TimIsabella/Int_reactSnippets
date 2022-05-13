import React from 'react';
import debug from 'snippet-debug';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const OffcanvasMiniPaginationAssigned = ({ drag, ...props }) => {
    const _logger = debug.extend('Snippets - OffcanvasMiniPaginationAssigned');
    _logger('!Running!');

    React.useEffect(() => {
        if (props.members) setPaginatedState(props.members);
    }, []);

    const [stateDataPagination, setStatePagination] = React.useState([]);

    function setPaginatedState(members) {
        setStatePagination(() => {
            return mapPaginatedData(members);
        });
    }

    function mapPaginatedData(members) {
        return members.map((member) => {
            return buildPaginatedCards(member);
        });
    }

    function buildPaginatedCards(member) {
        return (
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Popover id={member.name}>
                        <div className="offcanvas-minicards-popover">{member.name}</div>
                    </Popover>
                }>
                <img
                    className="offcanvas-snippet-image"
                    src={member.logo}
                    alt="altimg"
                    id={`drag-${member.id}`}
                    draggable="true"
                    onDragStart={drag}
                />
            </OverlayTrigger>
        );
    }

    return <React.Fragment>{stateDataPagination}</React.Fragment>;
};

OffcanvasMiniPaginationAssigned.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string, id: PropTypes.number, logo: PropTypes.string })
    ),
    drag: PropTypes.func,
};

export default OffcanvasMiniPaginationAssigned;
