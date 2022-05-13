import axios from 'axios';
import { API_HOST_PREFIX } from './serviceHelpers';

const endpoint = `${API_HOST_PREFIX}/api/snippets`;

export const getSearchPaginatedAll = (page) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/search/all?pageIndex=${page.pageIndex}&pageSize=${page.pageSize}&query=${page.query}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export const getSearchPaginatedAlliance = (page) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/search/alliance?pageIndex=${page.pageIndex}&pageSize=${page.pageSize}&query=${page.query}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export const getSearchPaginatedNonAlliance = (page) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/search/nonalliance?pageIndex=${page.pageIndex}&pageSize=${page.pageSize}&query=${page.query}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export const getByIdAll = (id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export const post = (payload) => {
    const config = {
        method: 'POST',
        url: `${endpoint}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export const put = (payload) => {
    const config = {
        method: 'PUT',
        url: `${endpoint}/${payload.id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

export const snippetsService = {
    getSearchPaginatedAll,
    getSearchPaginatedAlliance,
    getSearchPaginatedNonAlliance,
    getByIdAll,
    post,
    put,
};

export default snippetsService;
