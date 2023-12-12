import axios from 'axios';
import 'colors';
import dataMapper from './utils/dataMapper';
import Action from './models/Action';
import { Request, Response } from 'express';



//login to kaze
const login = async () => {
    console.log('login()...'.cyan)
    await axios.post('http://localhost:3000/api/v1/kaze/login')
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
}

//fetch actions from gestimum with Sync kaze = 1
const fetchActions = async () => {
    console.log('fetchActions()'.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_DTKAZE", "XXX_IDMKAZE", "XXX_KAZE"]`
    const select = `&XXX_KAZE=1`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

const fetchAction = async (id: String) => {
    console.log(`fetchAction(${id})`.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_DTKAZE", "XXX_IDMKAZE", "XXX_KAZE"]`
    const select = `&XXX_KAZE=1&XXX_IDMKAZE=${id}`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}${select}`);
        return response.data.actions;
    }
    catch(error){
        console.log(error);
        return error;
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
    catch(error){
        console.log(error);
        return error;
    }
}

//fetch jobID from Kaze
const fetchjobID = async (id: String) => {
    console.log('fetchjobID()'.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/${id}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

//update action in Gestimum
const updateAction = async (id: string, data: Object) => {
    console.log(`updateAction(${id})`.magenta)
    try{
        const response = await axios.put(`http://localhost:3000/api/v1/gestimum/updateAction/${id}`, data);
        console.log('PUT Success'.rainbow, response.data)
        return response.data;
    }
    catch(error){
        console.log(`UPDATE ERROR ${id}`.red);
        return error;
    }
}



const main = async () => {
    console.log('main()'.red.underline)
    
    //fetching Finish Jobs from Kaze
    const body: Object = {
        filter: {
            status: "in_progress", //TODO: change to "finished"
        }
    }
    const jobs: Array<Object> = await fetchJobs(body);
    console.log('jobs: '.cyan, jobs);

    if (!jobs) {
        console.log('No jobs found'.red)
        return;
    }
   
    //foreach job 
    jobs.forEach(async (job: any) => {
    
    //get Action from Gestimum (Job.id = Action.XXX_IDMKAZE)
    const action: Array<Action> = await fetchAction(job.id);
    console.log('action: '.cyan, action);
    
    if(!action[0]){
        console.log('No action found'.red)
        return;
    }

    //check if Action.XXX_DTKAZE < Job.updated_at
    if(!action[0].XXX_DTKAZE || new Date(action[0].XXX_DTKAZE).getTime()+2 < job.updated_at){
        // console.log(`${new Date(action[0].XXX_DTKAZE).getTime()} < ${job.updated_at}`.yellow, new Date(action[0].XXX_DTKAZE).getTime() < job.updated_at)
        console.log('Action need to be updated'.yellow)
        //get Job from Kaze
        const jobID: Object = await fetchjobID(job.id);
        console.log('jobID: '.cyan, jobID);

        if(!jobID){
            console.log('No jobID found'.red)
            return;
        }
        
        //dataMapper
        const data = dataMapper(jobID, 'Actions');
        console.log('data: '.cyan, data);

        const newAction = {
            XXX_IDMKAZE: data.XXX_IDMKAZE,
            XXX_DTKAZE: new Date(data.XXX_DTKAZE),
            ACT_OBJET: data.ACT_OBJET,
            ACT_NUMERO: data.ACT_NUMERO,
            // ACT_STATUS: data.ACT_STATUS,
            ACT_DATE: new Date(data.ACT_DATE) ,
            ACT_DATFIN: new Date(data.ACT_DATFIN),
            ACT_DATECH: new Date(data.ACT_DATECH),
        }
        // console.log('newAction: '.cyan, newAction)

        //update Action with data
        const update: Object = await updateAction(newAction.ACT_NUMERO, newAction);
        console.log('update: '.cyan, update);

        return `Action ${job.id} updated`;
    }
    else{
        return `Action ${job.id} already up to date`;
    }
});

}

//lauch main
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});
