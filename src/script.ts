//script to get localhost:3000/api/v1/affaires

import axios from 'axios';
import job_json from './data/job.json';
import dataMapper from './utils/dataMapper';

let job = job_json;
let lastAction;

const login = async () => {
    console.log('login()')
    axios.post('http://localhost:3000/api/v1/kaze/login')
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
}

const fetchActions = async () => {
    console.log('fetchActions()')
    try{
        const response = await axios.get('http://localhost:3000/api/v1/gestimum/actions');
        // lastAction = response.data.actions[0];
        //random number between 0 and 40
        const random = Math.floor(Math.random() * 40);
        return response.data.actions[random];
    }
    catch(error){
        console.log(error);
        return error;
    }
}

const postJob = async (job: any) => {
    console.log('postJob()')
    
    try{
        const response = await axios.post('http://localhost:3000/api/v1/kaze/createJob', job);
        return response.data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

    
login()
.then(() => {
    fetchActions()
    .then((data) => {
        lastAction = data;
        // console.log(lastAction);
        if (!lastAction) {
            throw new Error('No action found');
        }

        const mappedData  = dataMapper(lastAction, 'Jobs');
        console.log(mappedData);
        if (mappedData && 'job_title' in mappedData) {
            // TypeScript now knows that 'mappedData' has a 'job_title' property
            job.workflow.children[0].job_title = mappedData.job_title;
            job.workflow.children[0].job_reference = mappedData.job_reference;
            
        }

        postJob(job)
    });
});
