import * as Yup from 'yup';

const snippetFormInputsSchema = Yup.object({
    name: Yup.string().required('Required').min(3, 'Must be at least 3 characters or more'),
    code: Yup.string().required('Required').min(2, 'Must be 2 characters or more'),
    siteUrl: Yup.string().required('Required').url('Invalid Site URL'),
});

export default snippetFormInputsSchema;
