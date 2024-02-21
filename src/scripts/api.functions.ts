import axios from 'axios';
import 'colors';
import logger from '../logger';

//login to kaze
const login = async () => {
    console.log('login()...'.cyan)
    await axios.post('http://localhost:3000/api/v1/kaze/login')
    .then((response) => {
        console.log(response.data);
        return response.data;
    })
    .catch((error: any) => {
        logger.error(new Error("Erreur d'authentification -> " + error.response));
        return error;
    });
}

//fetch actions from gestimum with Sync kaze = 1
const fetchActions = async () => {
    console.log('fetchActions()'.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "ACT_DTCRE", "ACT_DTMAJ", "XXX_KZETAT", "XXX_KZDT", "XXX_KZIDM", "XXX_KAZE"]`
    const select = `&XXX_KAZE=1`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Actions -> ' + error.response.data));
    }
}

//fetch action from gestimum with Sync kaze = 1
const fetchAction = async (id: String) => {
    const ID = `${id}`.green;
    console.log(`fetchAction(${ID})`.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_KZDT", "XXX_KZIDM", "XXX_KAZE"]`
    const select = `&XXX_KAZE=1&XXX_KZIDM=${id}`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error: any){
        logger.error(new Error("Erreur de récupération de l'Action -> " + error.response.data));
    }
}

//fetch jobs from Kaze
const fetchJobs = async (body: Object) => {
    console.log('fetchJobs()'.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/`, {
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        });
        return response.data.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Missions Kaze -> ' + error.response.data));
    }
}

//fetch jobID from Kaze
const fetchjobID = async (id: String) => {
    const ID = `${id}`.green;
    console.log(`fetchjobID(${ID})`.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/${id}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération de la Mission Kaze -> ' + error.response.data));
    }
}

//update action in Gestimum
const updateAction = async (id: string, data: Object) => {
    const ID = `${id}`.green;
    console.log(`updateAction(${ID})`.magenta)
    try{
        const response = await axios.put(`http://localhost:3000/api/v1/gestimum/updateAction/${id}`, data);
        console.log('PUT Success'.green,)
        return response.data;
    }
    catch(error: any){
        console.log(`UPDATE ERROR ${id}`.red);
        logger.error(new Error("Erreur lors de la mise à jour de l'Action-> " + error.response.data));
    }
}


//fetch tier of the action
const fetchTiers = async (id: string) => {
    const ID = `${id}`.green;
    console.log(`fetchTiers(${ID})`.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/getTiers/${id}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('Erreur de récupération des Tiers -> ' + error.response.data));
        return error
    }
}

//fetch contact of the action
const fetchContact = async (id: string) => {
    const ID = `${id}`.green;
    console.log(`fetchContact(${ID})`.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/getContact/${id}`);
        return response.data;
    }
    catch(error: any){
        console.log('error fectching Contact'.red);
        logger.error(new Error('Erreur de récupération du Contact -> ' + error.response.data));
    }
}

//post job to kaze
const postJob = async (job: Object) => {
    console.log(`postJob()`.magenta)
    
    try{
        const response = await axios.post('http://localhost:3000/api/v1/kaze/createJob', job);
        console.log('POST Success'.bgBlue, response.data)
        return response.data;
    }
    catch(error: any){
        console.log(`POST ERROR`.red);
        logger.error(new Error('Erreur lors de la création de la Mission -> ' + error.response.data));
    }
}

//post job from WorkflowID to kaze
const postJobFromWorkflowID = async (workflowID: string, job: Object) => {
    const ID = `${workflowID}`.green;
    console.log(`postJobFromWorkflowID(${ID})`.magenta)
    
    try{
        const response = await axios.post(`http://localhost:3000/api/v1/kaze/createJobFromWorkflowID/${workflowID}`, job);
        console.log('POST Success'.bgBlue, response.data)
        return response.data;
    }
    catch(error: any){
        console.log(`POST ERROR`.red);
        logger.error(new Error('Erreur lors de la création de la Mission -> ' + error.response.data));
    }
}

const updateJobID = async (jobID: string, data) => {
    const ID = `${jobID}`.green;
    console.log(`updateJobID(${ID})`.magenta)
    // console.log("data", data)

   


    return data;
   
}




export { 
    login,
    fetchActions, 
    fetchAction, 
    fetchJobs, 
    fetchjobID, 
    updateAction, 
    fetchTiers, 
    fetchContact,
    postJob,
    postJobFromWorkflowID,
    updateJobID
}