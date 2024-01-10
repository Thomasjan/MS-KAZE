import axios from 'axios';
import 'colors';
import logger from '../logger';

//login to kaze
const login = async () => {
    console.log('login()...'.cyan)
    await axios.post('http://localhost:3000/api/v1/kaze/login')
    .then((response) => {
        console.log(response.data);
    })
    .catch((error: any) => {
        logger.error(new Error('login error -> ' + error.response));
    });
}

//fetch actions from gestimum with Sync kaze = 1
const fetchActions = async () => {
    console.log('fetchActions()'.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_DTKZ", "XXX_IDMKZ", "XXX_KAZE"]`
    const select = `&XXX_KAZE=1`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error: any){
        logger.error(new Error('fetchActions error -> ' + error.response.data));
    }
}

//fetch action from gestimum with Sync kaze = 1
const fetchAction = async (id: String) => {
    const ID = `${id}`.green;
    console.log(`fetchAction(${ID})`.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_DTKZ", "XXX_IDMKZ", "XXX_KAZE"]`
    const select = `&XXX_KAZE=1&XXX_IDMKZ=${id}`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error: any){
        logger.error(new Error('fetchAction error -> ' + error.response.data));
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
        logger.error(new Error('fetchJobs error -> ' + error.response.data));
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
        logger.error(new Error('fetchjobID error -> ' + error.response.data));
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
        logger.error(new Error('updateAction error -> ' + error.response.data));
    }
}


//fetch tier of the action
const fetchTier = async (id: string) => {
    const ID = `${id}`.green;
    console.log(`fetchTier(${ID})`.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/getTier/${id}`);
        return response.data;
    }
    catch(error: any){
        logger.error(new Error('fetchTier error -> ' + error.response.data));
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
        logger.error(new Error('fetchContact error -> ' + error.response.data));
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
        logger.error(new Error('postJob error -> ' + error.response.data));
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
        logger.error(new Error('postJobFromWorkflowID error -> ' + error.response.data));
    }
}



export { 
    login,
    fetchActions, 
    fetchAction, 
    fetchJobs, 
    fetchjobID, 
    updateAction, 
    fetchTier, 
    fetchContact,
    postJob,
    postJobFromWorkflowID
}