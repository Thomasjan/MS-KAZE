//script to get localhost:3000/api/v1/affaires

import axios from 'axios';
import dataMapper from './utils/dataMapper';
import 'colors';

import job_template from './data/job_template.json';
import template_type from './data/template_type.json';
import template_description from './data/template_description.json';
import template_client from './data/template_client.json';
import template_contact_num from './data/template_contact_num.json';
import { type } from 'os';


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

    job.workflow.children[0].job_reference = data.ACT_NUMERO;
    job.workflow.children[0].job_title = data.ACT_OBJET;
    job.workflow.children[0].job_address = data.adresse;
    job.workflow.children[0].zip_code = data.code_postal;
    job.workflow.children[0].city = data.ville;

    template_type.data = data.ACT_TYPE;
    template_description.data = data.ACT_DESC;
    template_client.address = data.adresse;
    template_client.address_title = data.adresse;
    template_client.zip_code =data.code_postal;
    template_client.city = data.ville;
    template_client.name = data.raison_sociale;
    template_client.email = tier.client.PCF_EMAIL;


      const jsonArray: any = [
        template_type,
        template_description,
        template_client,
        template_contact_num
    ];
      
    (job.workflow.children[0].children[0].children as any) = jsonArray;

    console.log('job: ', job.workflow.children[0]);

    

    postJob(job)

    
}


///launch script
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});



