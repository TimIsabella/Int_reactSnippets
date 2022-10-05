import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';
import ModalEditCard from './ModalEditCard';
import SnippetCardMiniPagination from './SnippetCardMiniPagination';

const SnippetCard = (props) => {

    return (
        <>
            <div className="card-column" id="modal-window-id">
                <Card className="card-entity">
                    <div className="card-image-container" style={{ backgroundColor: `${props.colorHEX}` }}>
                        <div className="card-img-overlay">
                            <ModalEditCard {...props} />
                        </div>
                        <div>
                            <Card.Img variant="top" className="card-image" src={props.logo} alt={props.name} />
                        </div>
                        <div className="card-img-overlay" style={{ userSelect: 'none', pointerEvents: 'none' }}>
                            <div className="card-badges">
                                <div
                                    className={classNames('badge', 'card-badge-status', {
                                        'bg-secondary': props.isAlliance === true,
                                    })}>
                                    {props.isAlliance && <>Snippet Alliance</>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Card.Body>
                        <Card.Link href={props.siteUrl} target="_blank">
                            <label className="card-title">{props.name}</label>
                        </Card.Link>
                        <div className="card-code">
                            <label>{`(${props.code})`}</label>
                        </div>
                        <div className="card-lower">
                            {props.members && (
                                <>
                                    <div className="card-lower-members">
                                        <u>Alliance Members</u>
                                        <div className="mini-card-row loaded-mini-cards-container">
                                            <SnippetCardMiniPagination {...props} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

SnippetCard.propTypes = {
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

export default SnippetCard;
