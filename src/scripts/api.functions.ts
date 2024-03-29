import axios from 'axios';
import 'colors';
import logger from '../logger';
import dotenv from 'dotenv';
dotenv.config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

//login to kaze
const login = async () => {
    console.log('login()...'.cyan)
    try {
        const response = await axios.post(`${SERVER_URL}/api/v1/kaze/login`)
        console.log(response.data);
        return response.data;
    }
    catch (error: any) {
        logger.error(new Error(`Erreur d'authentification -> ${error.response}`));
        return error;
    }
};

//fetch actions from gestimum with Sync kaze = 1
const fetchActions = async () => {
    console.log('fetchActions()'.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "ACT_DTCRE", "ACT_DTMAJ", "XXX_KZETAT", "XXX_KZDT", "XXX_KZIDM", "XXX_KAZE", "XXX_KZPARC"]`
    const select = `&XXX_KAZE=1`
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Actions -> ' + error?.response?.data));
        return error;
    }
};

//fetch action from gestimum with Sync kaze = 1
const fetchAction = async (id: String) => {
    const ID = `${id}`.green;
    console.log(`fetchAction(${ID})`.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_KZDT", "XXX_KZIDM", "XXX_KAZE", "XXX_KZPARC"]`
    const select = `&XXX_KAZE=1&XXX_KZIDM=${id}`
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error: any){
        logger.error(new Error("Erreur de récupération de l'Action -> " + error?.response?.data));
        return error;
    }
};

//fetch jobs from Kaze
const fetchJobs = async (body: Object) => {
    console.log('fetchJobs()'.magenta)
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/kaze/getJobs/`, {
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        });
        return response.data.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Missions Kaze -> ' + error?.response?.data));
        return error;
    }
};

//fetch jobID from Kaze
const fetchjobID = async (id: String) => {
    const ID = `${id}`.green;
    console.log(`fetchjobID(${ID})`.magenta)
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/kaze/getJobs/${id}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération de la Mission Kaze -> ' + error?.response?.data));
        return error;
    }
};

//update action in Gestimum
const updateAction = async (id: string, data: Object) => {
    const ID = `${id}`.green;
    console.log(`updateAction(${ID})`.magenta)
    try{
        const response = await axios.put(`${SERVER_URL}/api/v1/gestimum/updateAction/${id}`, data);
        console.log('PUT Success'.green)
        return response.data;
    }
    catch(error: any){
        console.log(`UPDATE ERROR ${id}`.red);
        logger.error(new Error("Erreur lors de la mise à jour de l'Action-> " + error?.response?.data));
        return error;
    }
};

//updateTiers
const updateTiers = async (id: string, data: Object) => {
    const ID = `${id}`.green;
    console.log(`updateTiers(${ID})`.magenta)
    try{
        const response = await axios.put(`${SERVER_URL}/api/v1/gestimum/updateTiers/${id}`, data);
        console.log('PUT Success'.green)
        return response.data;
    }
    catch(error: any){
        console.log(`UPDATE ERROR ${id}`.red);
        logger.error(new Error("Erreur lors de la mise à jour du Tiers-> " + error?.response?.data));
        return error;
    }
};

//updateContact
const updateContact = async (id: string, data: Object) => {
    const ID = `${id}`.green;
    console.log(`updateContact(${ID})`.magenta)
    try{
        const response = await axios.put(`${SERVER_URL}/api/v1/gestimum/updateContact/${id}`, data);
        console.log('PUT Success'.green)
        return response.data;
    }
    catch(error: any){
        console.log(`UPDATE ERROR ${id}`.red);
        logger.error(new Error("Erreur lors de la mise à jour du Contact-> " + error?.response?.data));
        return error;
    }
};

//fetch all tiers where XXX_KAZE = 1
const fetchAllTiers = async () => {
    console.log('fetchAllTiers()'.magenta)
    const display = `?display=["PCF_CODE","PCF_RS","PCF_TYPE","PCF_RUE","PCF_COMP","PCF_VILLE","PCF_CP","XXX_KAZE", "XXX_KZIDT", "XXX_KZDT"]`;
    const select = `&XXX_KAZE=1`;
    try{
       //fetch all tiers where XXX_KAZE = 1
        const response = await axios.get(`${SERVER_URL}/api/v1/gestimum/getTiers/${display}${select}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Tiers -> ' + error?.response?.data));
        return error;
    }
};

//fetch Tiers
const fetchTiers = async (id: string) => {
    const ID = `${id}`.green;
    console.log(`fetchTiers(${ID})`.magenta)
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/gestimum/getTiers/${id}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération du Tiers -> ' + error?.response?.data));
        return error
    }
}

//fetch all contacts
const fetchAllContacts = async () => {
    console.log('fetchAllContacts()'.magenta)
    const display = `?display=["CCT_NUMERO","CCT_NOM","CCT_PRENOM","CCT_TELB","CCT_TELM","CCT_EMAIL","XXX_KAZE", "XXX_KZIDCT", "XXX_KZDT"]`;
    const select = `&XXX_KAZE=1`;
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/gestimum/getContacts/${display}${select}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Contacts -> ' + error?.response?.data));
        return error;
    }
};

//fetch contact of the action
const fetchContact = async (id: string) => {
    const ID = `${id}`.green;
    console.log(`fetchContact(${ID})`.magenta)
    try{
        const response = await axios.get(`${SERVER_URL}/api/v1/gestimum/getContact/${id}`);
        return response.data;
    }
    catch(error: any){
        console.log('error fectching Contact'.red);
        logger.error(new Error('Erreur de récupération du Contact -> ' + error?.response?.data));
        return error;
    }
};

//post job to kaze
const postJob = async (job: Object) => {
    console.log(`postJob()`.magenta)
    
    try{
        const response = await axios.post(`${SERVER_URL}/api/v1/kaze/createJob`, job);
        console.log('POST Success'.bgBlue, response.data)
        return response.data;
    }
    catch(error: any){
        console.log(`POST ERROR`.red);
        logger.error(new Error('Erreur lors de la création de la Mission -> ' + error?.response?.data));
        return error;
    }
};

//post job from WorkflowID to kaze
const postJobFromWorkflowID = async (workflowID: string, job: Object) => {
    const ID = `${workflowID}`.green;
    console.log(`postJobFromWorkflowID(${ID})`.magenta)
    
    try{
        const response = await axios.post(`${SERVER_URL}/api/v1/kaze/createJobFromWorkflowID/${workflowID}`, job);
        console.log('POST Success'.bgBlue, response.data)
        return response.data;
    }
    catch(error: any){
        console.log(`POST ERROR`.red);
        logger.error(new Error('Erreur lors de la création de la Mission -> ' + JSON.stringify(error?.response?.data)));
        return error?.response?.data
    }
};

//update jobID
const updateJobID = async (jobID: string, data: Object) => {
    const ID = `${jobID}`.green;
    console.log(`updateJobID(${ID})`.magenta)

    let cells: Array<Object> = []

    for (const [key, value] of Object.entries(data)) {
        let cell: any = {}

        console.log(`Key: ${key}`);
        if (typeof value === 'object' && value !== null) {
            for (const [innerKey, innerValue] of Object.entries(value)) {
                 cell = {
                    widget_id: innerKey,
                    value: innerValue
                }
                cells.push(cell)
            }
        } else {
             cell = {
                widget_id: key,
                value: value
            }
            cells.push(cell)
        }
        cells.forEach(async (cell: any) => {
            try{
                const response = await axios.post(`${SERVER_URL}/api/v1/kaze/updateJob/${jobID}/${cell.widget_id}`, cell)
                return response.data;
            }
            catch(error: any){
                console.log(`POST ERROR`.red);
                logger.error(new Error("Erreur lors de la mise à jour de la Mission -> " + JSON.stringify(error?.response?.data)));
                return error;
            }
        })
    }
    return cells;
   
};

const insertIntoCollectionFunction = async (id: string, data: Object) => {
    const collection_id = `${id}`.green;
    console.log(`insertIntoCollectionFunction(${collection_id})`.magenta)

    try{
        const response = await axios.post(`${SERVER_URL}/api/v1/kaze/insertIntoCollection/${id}`, data);
        console.log('Insert Success'.bgBlue)
        return response.data;
    }
    catch(error: any){
        console.log(`POST ERROR`.red);
        logger.error(new Error("Erreur lors de l'ajout à la collection -> " + error?.response?.data));
        return error;
    }
};




export { 
    login,
    fetchActions, 
    fetchAction, 
    fetchJobs, 
    fetchjobID, 
    updateAction,
    updateTiers,
    updateContact,
    fetchAllTiers, 
    fetchTiers,
    fetchAllContacts,
    fetchContact,
    postJob,
    postJobFromWorkflowID,
    updateJobID,
    insertIntoCollectionFunction
}