import React from 'react';
import debug from 'snippet-debug';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const SnippetCardMiniPagination = (props) => {
    const _logger = debug.extend('Snippets - CardMiniPagination');
    _logger('!RUNNING!');

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
            return buildPaginationCards(member);
        });
    }

    function buildPaginationCards(member) {
        return (
            <>
                <OverlayTrigger
                    placement="auto-start"
                    overlay={
                        <Popover id={member.name}>
                            <div className="mini-card-popover">
                                <img className="mini-card-popover-img" src={member.logo} alt={member.name} />
                                <br />
                                {member.name}
                            </div>
                        </Popover>
                    }>
                    <div className="mini-card-column">
                        <div className="mini-card-entity">
                            <div className="mini-card-body">
                                <img className="mini-card-image" src={member.logo} alt={member.name} />
                            </div>
                        </div>
                    </div>
                </OverlayTrigger>
            </>
        );
    }

    return <React.Fragment>{stateDataPagination}</React.Fragment>;
};

SnippetsCardMiniPagination.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    logo: PropTypes.string,
    siteUrl: PropTypes.string,
    colorHEX: PropTypes.string,
    statusId: PropTypes.number.isRequired,
    statusName: PropTypes.string,
    regionTypeId: PropTypes.number.isRequired,
    regionName: PropTypes.string,
    locationId: PropTypes.number,
    locationLineOne: PropTypes.string,
    isAlliance: PropTypes.bool.isRequired,
    registrationDate: PropTypes.string,
    members: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string, id: PropTypes.number, logo: PropTypes.string })
    ),
};

export default SnippetsCardMiniPagination;
