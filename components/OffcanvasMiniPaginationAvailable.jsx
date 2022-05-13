import React from 'react';
import debug from 'snippet-debug';
import PropTypes from 'prop-types';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import toastrOptions from '../other/toastrOptions';
import Spinner from 'react-bootstrap/Spinner';
import * as SnippetsService from '../../../services/snippetsService';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const OffcanvasMiniPaginationAvailable = ({ drag, ...props }) => {
    const _logger = debug.extend('Snippets - OffcanvasMiniPaginationAvailable');
    _logger('!Running!');

    React.useEffect(() => {
        setSpinnyState(true);

        getPaginatedData({ pageIndex: 0, pageSize: 9999999, query: '' });
    }, []);

    const [stateDataPagination, setStatePagination] = React.useState([]);
    const [spinnyState, setSpinnyState] = React.useState(false);

    toastr.options = { toastrOptions };

    function getPaginatedData(data) {
        SnippetsService.getSearchPaginatedNonCoalition(data)
            .then(paginatedResponseSuccess)
            .catch((response) => {
                onError(response);
            });
    }

    function onError(response) {
        _logger('getPaginatedData ERROR: ', response);
        toastr.error(`ERROR! Unable to retrieve offcanvas data. ${`${response}`}`);

        setSpinnyState(false);
    }

    function paginatedResponseSuccess(response) {
        setPaginationMapToState(response.data.item.pagedItems);

        setSpinnyState(false);
    }

    function setPaginationMapToState(responseData) {
        setStatePagination([]); //Clear state

        setStatePagination(() => {
            return mapPaginatedData(responseData);
        });
    }

    function mapPaginatedData(responseData) {
        let filteredResponse = [];

        //Remove already assigned members from full list by id comparison
        if (props.members) {
            filteredResponse = responseData.filter((response) => {
                return props.members.every((member) => {
                    return response.id !== member.id;
                });
            });
        } else filteredResponse = responseData;

        return filteredResponse.map((member) => {
            return buildPaginatedCards(member);
        });
    }

    function buildPaginatedCards(member) {
        return (
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Popover id={data.name}>
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

    return (
        <React.Fragment>
            {spinnyState && (
                <span>
                    <Spinner className="spinnys" animation="grow" size="sm" />
                    <Spinner className="spinnys" animation="grow" size="sm" />
                    <Spinner className="spinnys" animation="grow" size="sm" />
                </span>
            )}
            {!spinnyState && stateDataPagination}
        </React.Fragment>
    );
};

OffcanvasMiniPaginationAvailable.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string, id: PropTypes.number, logo: PropTypes.string })
    ),
    drag: PropTypes.func,
};

export default OffcanvasMiniPaginationAvailable;
