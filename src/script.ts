//script to get localhost:3000/api/v1/affaires

import axios from 'axios';
import dataMapper from './utils/dataMapper';
import 'colors';

import job_template from './data/job_template.json';
import template_type from './data/template_type.json';
import template_description from './data/template_description.json';
import template_client from './data/template_client.json';
import template_contact_num from './data/template_contact_num.json';

import kaze_template from './data/kaze_template.json';
import workflow_template from './data/workflow_exemple.json';

import jsonMapper from './utils/jsonMapper';
import { json } from 'stream/consumers';


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

const fetchActions = async () => {
    console.log('fetchActions()'.magenta)
    const display = `?display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH"]`
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/actions/${display}`);
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

const fetchTier = async (id: string) => {
    console.log('fetchTier()'.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/gestimum/getTier/${id}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

const postJob = async (job: any) => {
    console.log('postJob()'.magenta)
    
    try{
        const response = await axios.post('http://localhost:3000/api/v1/kaze/createJob', job);
        console.log('POST Success'.rainbow)
        return response.data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}





const main = async () => {
    console.log('main()'.red.underline)
    // await login();
    
    const lastAction = await fetchActions();
    const tier = await fetchTier(lastAction.PCF_CODE);
    // console.log('tier: ', tier);
    // console.log('lastAction: ', lastAction);

    if (!lastAction) {
        throw new Error('No action found');
    }

    if(!tier){
        throw new Error('No tier found');
    }

    const data = {
        ...lastAction,
        ...tier.client
    }

    console.log('data: ', data);

    const job = job_template;

    const fields: Object = {
        ACT_NUMERO: data.ACT_NUMERO,
        PCF_CODE: data.PCF_CODE,
        CCT_NUMERO: data.CCT_NUMERO,
        ACT_OBJET: data.ACT_OBJET,
        ACT_TYPE: data.ACT_TYPE,
        ACT_DESC: data.ACT_DESC,
        ACT_DATE: data.ACT_DATE,
        ACT_DATFIN: data.ACT_DATFIN,
        ACT_DATECH: data.ACT_DATECH,
        PCF_RS: data.PCF_RS,
        PCF_EMAIL: data.PCF_EMAIL || 'no_email@gmail.com',
        PCF_VILLE: data.PCF_VILLE,
        PCF_CP: data.PCF_CP,
        PCF_RUE: data.PCF_RUE,
        XXX_IDMKAZE: data.XXX_IDMKAZE,
        
    }

      const jsonArray: Array<Object> = [
        template_type,
        template_description,
        template_client,
        template_contact_num
    ];
      
    (job.workflow.children[0].children[0].children as Array<Object>) = jsonArray;

    const updatedJson: Object = jsonMapper(job, fields);
    const kazeJSON: Object = jsonMapper(kaze_template, fields);
    const finalWorkflow: Object =  jsonMapper(workflow_template, fields);


    console.log('posting job...'.magenta, finalWorkflow);

    postJob(finalWorkflow)
    
}


///launch script
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});



