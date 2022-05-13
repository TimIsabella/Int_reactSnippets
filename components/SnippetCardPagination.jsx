import React from 'react';
import debug from 'snippet-debug';
import Pagination from 'react-bootstrap/Pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import toastrOptions from '../other/toastrOptions';
import Spinner from 'react-bootstrap/Spinner';
import * as SnippetsService from '../../../services/snippetsService';
import SnippetCard from './Snippetard';
import ModalNewCard from './ModalNewCard';

const SnippetCardPagination = () => {
    const _logger = debug.extend('Snippets - CardPagination');
    _logger('!RUNNING!');

    const pageQty = 12;
    const [paramsState, setParamsState] = React.useState({ pageIndex: 0, pageSize: pageQty, query: '' });
    const [radioValueState, setRadioValueState] = React.useState('1');

    React.useEffect(() => {
        setSpinnyState(true);

        callPaginatedSelection(paramsState);
    }, [paramsState, radioValueState]);

    const [paginationState, setPaginationState] = React.useState([]);
    const [paginationBarState, setPaginationBarState] = React.useState({ totalCount: 0, position: 0 });
    const [queryState, setQueryState] = React.useState('');
    const [spinnyState, setSpinnyState] = React.useState(false);

    const radios = [
        { name: 'All Snippets', value: '1' },
        { name: 'Alliances', value: '2' },
        { name: 'Non-Alliances', value: '3' },
    ];

    toastr.options = { toastrOptions };

    function onQueryFieldChange(e) {
        setQueryState(e.target.value);
    }

    const reSubmit = () => {
        callPaginatedSelection(paramsState);
    };

    function onQueryKeyUp(e) {
        if (e.key === 'Enter') {
            onQuerySubmit();
        }
    }

    function setResultsType(e) {
        setRadioValueState(e.currentTarget.value);
        setQueryState('');

        setParamsState((prevState) => {
            let params = { ...prevState };
            params.pageIndex = 0;
            params.query = '';

            return params;
        });
    }

    function onClickPaginationBar(position) {
        if (position === paginationBarState.position) return;
        if (position < 0 || position >= paginationBarState.totalCount) return;

        setParamsState((prevState) => {
            let params = { ...prevState };
            params.pageIndex = position;
            params.query = queryState;

            return params;
        });
    }

    function onQuerySubmit(submit) {
        if (!submit) setPaginationState([]);

        setParamsState((prevState) => {
            let params = { ...prevState };
            params.pageIndex = 0;
            params.query = queryState;

            return params;
        });
    }

    function callPaginatedSelection(params) {
        if (radioValueState === '1') getPaginatedSearchAllData(params);
        if (radioValueState === '2') getPaginatedSearchAllianceData(params);
        if (radioValueState === '3') getPaginatedSearchNonAllianceData(params);
    }

    function getPaginatedSearchAllData(data) {
        SnippetsService.getSearchPaginatedAll(data)
            .then(onSuccess)
            .catch((response) => {
                onError(response);
                _logger('getPaginatedSearchAllData ERROR: ', response);
            });
    }

    function getPaginatedSearchAllianceData(data) {
        SnippetsService.getSearchPaginatedAlliance(data)
            .then(onSuccess)
            .catch((response) => {
                onError(response);
                _logger('getPaginatedSearchAllianceData ERROR: ', response);
            });
    }

    function getPaginatedSearchNonAllianceData(data) {
        SnippetsService.getSearchPaginatedNonAlliance(data)
            .then(onSuccess)
            .catch((response) => {
                onError(response);
                _logger('getPaginatedSearchNonAllianceData ERROR: ', response);
            });
    }

    function onSuccess(response) {
        setPaginationMapToState(response.data.item.pagedItems);
        setPaginationBarToState(response.data.item);

        setSpinnyState(false);
    }

    function onError(response) {
        if (response.response.status === 404) toastr.info('No record found meeting search criteria');
        else toastr.error(`ERROR! Unable to retrieve page data. ${`${response}`}`);

        setSpinnyState(false);
    }

    function setPaginationMapToState(responseData) {
        setPaginationState([]); //Clear state

        setPaginationState(() => {
            return mapPaginatedData(responseData);
        });
    }

    function setPaginationBarToState(responseData) {
        setPaginationBarState(() => {
            return { totalCount: responseData.totalCount, position: responseData.pageIndex };
        });
    }

    function mapPaginatedData(responseData) {
        return responseData.map((data) => {
            return buildPaginatedCards(data);
        });
    }

    function buildPaginatedCards(props) {
        return (
            <>
                <SnippetCard {...props} reSubmit={reSubmit} />
            </>
        );
    }

    return (
        <React.Fragment>
            <div className="top-buttons-main-container">
                <div>
                    <div className="new-snippet-button-container">
                        <ModalNewCard reSubmit={reSubmit} />
                    </div>
                </div>

                <div className="search-bar">
                    <InputGroup className="sx-1">
                        <Button
                            className="search-bar-button"
                            variant="outline-secondary"
                            id="button-addon1"
                            value={queryState}
                            onClick={onQuerySubmit}>
                            Search
                        </Button>
                        <FormControl
                            className="search-bar-button"
                            aria-describedby="basic-addon1"
                            value={queryState}
                            onChange={onQueryFieldChange}
                            onKeyUp={onQueryKeyUp}
                        />
                    </InputGroup>
                </div>
                <div className="search-selection">
                    {radios.map((radio, idx) => (
                        <ToggleButton
                            className="search-select-buttons"
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={'outline-secondary'}
                            name="radio"
                            value={radio.value}
                            checked={radioValueState === radio.value}
                            onChange={setResultsType}>
                            {radio.name}
                        </ToggleButton>
                    ))}
                </div>
                <div className="pagination-buttons">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => {
                                onClickPaginationBar(paginationBarState.position - pageQty);
                            }}
                        />
                        <Pagination.Item
                            onClick={() => {
                                onClickPaginationBar(0);
                            }}>
                            {1}
                        </Pagination.Item>
                        <Pagination.Ellipsis disabled="true" />
                        <Pagination.Item disabled className="pagination-button-active">
                            {Math.ceil(paginationBarState.position / pageQty + 1)}
                        </Pagination.Item>
                        <Pagination.Ellipsis disabled="true" />
                        <Pagination.Item
                            onClick={() => {
                                onClickPaginationBar(
                                    Math.ceil(paginationBarState.totalCount / pageQty) * pageQty - pageQty
                                );
                            }}>
                            {Math.ceil(paginationBarState.totalCount / pageQty)}
                        </Pagination.Item>
                        <Pagination.Next
                            onClick={() => {
                                onClickPaginationBar(paginationBarState.position + pageQty);
                            }}
                        />
                    </Pagination>
                </div>
            </div>
            <div className="card-row loaded-cards-container">{paginationState}</div>
            <div>
                {spinnyState && (
                    <span>
                        <Spinner className="spinnys" animation="grow" size="sm" />
                        <Spinner className="spinnys" animation="grow" size="sm" />
                        <Spinner className="spinnys" animation="grow" size="sm" />
                    </span>
                )}
            </div>
        </React.Fragment>
    );
};

export default SnippetCardPagination;
