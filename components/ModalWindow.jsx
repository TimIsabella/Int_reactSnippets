import React from 'react';
import PropTypes from 'prop-types';
import payloadModel from './other/payloadModel';
import ReactDOM from 'react-dom';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import { useFormik } from 'formik';
import snippetFormInputsSchema from './schema/snippetFormInputsSchema';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import toastrOptions from './other/toastrOptions';
import Spinner from 'react-bootstrap/Spinner';
import FileUpload from '../../components/file/FileUpload';
import * as PartiesService from '../../services/snippetsService';
import OffcanvasWindow from './OffcanvasWindow';
import getLookUps from '../../services/lookUpsService';

const ModalWindow = ({ props, setOpen }) => {
    React.useEffect(() => {
        setSpinnyState(true);

        if (props.id) {
            let mergedModel = JSON.parse(JSON.stringify(payloadModel));

            for (let p in payloadModel) {
                mergedModel[p] = props[p];
            }

            if (props.members) {
                mergedModel.snippetBase = props.members.map((member) => {
                    return member.id;
                });
            } else mergedModel.snippetBase = [];

            mergedModel.isCoalition += '';

            formikState.setValues(mergedModel);
        }

        getLookUps(['StatusTypes', 'RegionTypes'])
            .then(setSelectOptionsStates)
            .catch((response) => _logger('getLookup ERROR: ', response));
    }, []);

    const formikState = useFormik({
        initialValues: payloadModel,
        validationSchema: snippetFormInputsSchema,
        onSubmit: onSubmit,
    });

    const [selectionState, setSelectionState] = React.useState();
    const [spinnyState, setSpinnyState] = React.useState(false);
    const [logoUrlState, setLogoUrlState] = React.useState(props.logo);
    const [regionOptionsState, setRegionOptionsState] = React.useState([]);
    const [statusOptionsState, setStatusOptionsState] = React.useState([]);

    toastr.options = { toastrOptions };

    function onClose() {
        setOpen(false);
    }

    function setSelectOptionsStates(response) {
        setRegionOptionsState(response.item.RegionTypes);
        setStatusOptionsState(response.item.StatusTypes);

        setSpinnyState(false);
    }

    function selectOptionMapper(options) {
        return (
            <>
                {options.map((option) => {
                    return (
                        <>
                            <option value={`${option.id}`}>{option.name}</option>
                        </>
                    );
                })}
            </>
        );
    }

    function FileUploadContainer() {
        return (
            <>
                <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={
                        <Popover className="file-upload-button-popover">
                            <FileUpload onFileChange={logoUpload} />
                        </Popover>
                    }>
                    <Button className="file-upload-button" variant="bg-white">
                        ⤒
                    </Button>
                </OverlayTrigger>
            </>
        );
    }

    function logoUpload(response) {
        setLogoUrlState(response[0].url);
    }

    const modalWindowHeight = (formikState) => {
        if (formikState.values.isCoalition === 'true') return '63%';
        if (formikState.values.isCoalition === 'false') return '56.8%';
    };

    const modalBannerHeight = (formikState) => {
        if (formikState.values.isCoalition === 'true') return '21.33%';
        if (formikState.values.isCoalition === 'false') return '23.66%';
    };

    function onSubmit() {
        setSpinnyState(true);

        preparePayload();
    }

    function preparePayload() {
        let payload = JSON.parse(JSON.stringify(formikState.values));

        //Correct form input casts (HTML outputs all values as string)
        payload.isCoalition === 'true' ? (payload.isCoalition = true) : (payload.isCoalition = false);

        if (selectionState) {
            payload.snippetBase = selectionState.map((snippet) => {
                return snippet.id;
            });
        } else {
            if (payload.snippetBase) payload.snippetBase = formikState.values.snippetBase;
            else payload.snippetBase = [];
        }

        payload.logo = logoUrlState;

        if (!payload.id) {
            delete payload.id;
            postRecord(payload);
        }

        if (payload.id) {
            putRecord(payload);
        }
    }

    function postRecord(payload) {
        PartiesService.post(payload).then(postOnSuccess).catch(onError);
    }

    function putRecord(payload) {
        PartiesService.put(payload).then(putOnSuccess).catch(onError);
    }

    function postOnSuccess() {
        toastr.success('New Snippet SUCCESSFULLY Submitted!');
        setSpinnyState(false);

        props.reSubmit();
        setOpen(false);
    }

    function putOnSuccess() {
        toastr.success('Snippet SUCCESSFULLY Updated!');
        setSpinnyState(false);

        props.reSubmit();
        setOpen(false);
    }

    function onError(response) {
        toastr.error(`Submission ERROR! Check inputs and try again. ${`${response}`}`);
        setSpinnyState(false);
    }

    return ReactDOM.createPortal(
        <React.Fragment>
            <div className="modal-shadow" onClick={onClose} />
            <div
                className="modal"
                style={{
                    maxHeight: modalWindowHeight(formikState),
                }}>
                <div
                    className="modal-banner"
                    style={{
                        height: modalBannerHeight(formikState),
                    }}>
                    <div className="modal-banner-container">
                        <FileUploadContainer />
                        <div className="modal-banner-logo-container">
                            <div
                                className="modal-banner-background"
                                style={{ backgroundColor: `${formikState.values.colorHEX}` }}>
                                <img className="modal-snippet-image" src={logoUrlState} alt={formikState.values.name} />
                            </div>
                        </div>
                        <div>
                            <Form.Control
                                title="Change Background Color"
                                type="color"
                                placement="right"
                                name="colorHEX"
                                defaultValue={payloadModel.colorHEX}
                                value={formikState.values.colorHEX}
                                onChange={formikState.handleChange}
                            />
                        </div>
                    </div>
                </div>
                {spinnyState && (
                    <span>
                        <Spinner className="spinnys" animation="grow" size="sm" />
                        <Spinner className="spinnys" animation="grow" size="sm" />
                        <Spinner className="spinnys" animation="grow" size="sm" />
                    </span>
                )}
                {!spinnyState && (
                    <>
                        <br />
                    </>
                )}
                <div className="modal-upper">
                    <div className="modal-upper-container">
                        <label className="modal-input-label">
                            Snippet Name &nbsp;&nbsp;&nbsp;
                            {formikState.touched.name && formikState.errors.name ? (
                                <span className="yup-validation">{formikState.errors.name}</span>
                            ) : null}
                        </label>
                        <Form.Control
                            className="modal-text-input"
                            name="name"
                            placeholder="Name"
                            type="text"
                            defaultValue={payloadModel.name}
                            value={formikState.values.name}
                            onChange={formikState.handleChange}
                        />
                        <label className="modal-input-label">
                            Snippet Code &nbsp;&nbsp;&nbsp;
                            {formikState.touched.code && formikState.errors.code ? (
                                <span className="yup-validation">{formikState.errors.code}</span>
                            ) : null}
                        </label>

                        <Form.Control
                            className="modal-text-input"
                            type="text"
                            placeholder="Snippet code"
                            name="code"
                            defaultValue={payloadModel.code}
                            value={formikState.values.code}
                            onChange={formikState.handleChange}
                        />
                        <label className="modal-input-label">
                            Snippet Website URL &nbsp;&nbsp;&nbsp;
                            {formikState.touched.siteUrl && formikState.errors.siteUrl ? (
                                <span className="yup-validation">{formikState.errors.siteUrl}</span>
                            ) : null}
                        </label>

                        <Form.Control
                            className="modal-text-input"
                            type="text"
                            placeholder="Snippet website URL"
                            name="siteUrl"
                            defaultValue={payloadModel.siteUrl}
                            value={formikState.values.siteUrl}
                            onChange={formikState.handleChange}
                        />
                    </div>
                </div>

                <div className="modal-middle">
                    <div className="modal-middle-container">
                        <div className="modal-middle-select-cluster">
                            <label className="modal-option-label">Region&nbsp;</label>
                            <br />
                            <Form.Select
                                size="sm"
                                className="modal-input-box"
                                name="regionTypeId"
                                defaultValue={payloadModel.regionTypeId}
                                value={formikState.values.regionTypeId}
                                onChange={formikState.handleChange}>
                                {selectOptionMapper(regionOptionsState)}
                            </Form.Select>
                        </div>

                        <div className="modal-middle-select-cluster">
                            <label className="modal-lower-input-label">Location&nbsp;</label>
                            <br />
                            <Form.Control
                                className="modal-input-box"
                                type="number"
                                name="locationId"
                                placeholder="Location Id"
                                defaultValue={payloadModel.locationId}
                                value={formikState.values.locationId}
                                onChange={formikState.handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-middle-container">
                        <div className="modal-middle-select-cluster">
                            <label className="modal-option-label">Status&nbsp;</label>
                            <br />
                            <Form.Select
                                className="modal-input-box"
                                name="statusId"
                                defaultValue={payloadModel.statusId}
                                value={formikState.values.statusId}
                                onChange={formikState.handleChange}>
                                {selectOptionMapper(statusOptionsState)}
                            </Form.Select>
                        </div>

                        <div className="modal-middle-select-cluster">
                            <label className="modal-option-label">Type&nbsp;</label>
                            <br />
                            <Form.Select
                                className="modal-input-box"
                                name="isCoalition"
                                defaultValue={payloadModel.isCoalition}
                                value={formikState.values.isCoalition}
                                onChange={formikState.handleChange}>
                                <option value="false">Non-Coalition</option>
                                <option value="true">Coalition</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>

                <div className="modal-lower">
                    <Button
                        className="modal-submit-button"
                        variant="success"
                        type="submit"
                        onClick={formikState.handleSubmit}>
                        Submit
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button className="modal-cancel-button" variant="danger" onClick={onClose}>
                        Cancel
                    </Button>
                    {formikState.values.isCoalition === 'true' && (
                        <>
                            <br />
                            <OffcanvasWindow {...props} setSelectionState={setSelectionState} />
                        </>
                    )}
                </div>
                <div>
                    {selectionState && formikState.values.isCoalition === 'true' && (
                        <div>
                            <label className="modal-members-save-message">
                                Click submit to save snippet member changes
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>,
        document.getElementById('modal-window-id')
    );
};

ModalWindow.propTypes = {
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
    isCoalition: PropTypes.bool.isRequired,
    registrationDate: PropTypes.string,
    members: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            logo: PropTypes.string.isRequired,
        })
    ),
};

export default ModalWindow;
