//script to get localhost:3000/api/v1/affaires

import axios from 'axios';
import 'colors';

import job_template from './data/job_template.json';
import template_type from './data/template_type.json';
import template_description from './data/template_description.json';
import template_client from './data/template_client.json';
import template_contact_num from './data/template_contact_num.json';

import kaze_template from './data/kaze_template.json';
import workflow_template from './data/workflow_exemple.json';

import jsonMapper from './utils/jsonMapper';
import dataMapper from './utils/dataMapper';
import Action from './models/Action';


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

//fetch tier of the action
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

//post job to kaze
const postJob = async (job: Object) => {
    console.log(`postJob()`.magenta)
    
    try{
        const response = await axios.post('http://localhost:3000/api/v1/kaze/createJob', job);
        console.log('POST Success'.rainbow, response.data)
        return response.data;
    }
    catch(error){
        console.log(`POST ERROR`.red, error);
        return error;
    }
}

const updateAction = async (id: string, data: Object) => {
    console.log(`updateAction(${id})`.magenta)
    try{
        const response = await axios.put(`http://localhost:3000/api/v1/gestimum/updateAction/${id}`, data);
        console.log('PUT Success'.rainbow, response.data)
        return response.data;
    }
    catch(error){
        console.log(`UPDATE ERROR ${id}`.red, error);
        return error;
    }
}


const main = async () => {
    console.log('main()'.red.underline)
    
    //fetching actions
    const actions: Array<Action> = await fetchActions();
    // console.log('actions: '.cyan, actions)

    if (!actions) {
        console.log('No actions found'.red)
        throw new Error('No action found');
    }
    //actiions without XXX_IDMKAZE (No Job created in kaze)
    const actionsWithoutKazeID: Array<Action> = actions.filter((action) => {
        return !action.XXX_IDMKAZE;
    });
    console.log('actionsWithoutKazeID: '.cyan, actionsWithoutKazeID)

    if(actionsWithoutKazeID.length === 0){
        console.log('No actions to create'.yellow)
        return;
    }

    //create job for each action
    for (const action of actionsWithoutKazeID) {
        console.log(`creating job(${action.ACT_NUMERO})`.yellow);

        try {
            await createJob(action)
            .then(async (result) => {
                console.log(`Result for action ${action.ACT_NUMERO}: ${result}`);
            })
            .catch((error) => {
                console.log(`Error processing action ${action.ACT_NUMERO}`, error);
            });
        } catch (error) {
            console.log(`Error processing action ${action.ACT_NUMERO}`, error);
        }
    }


    
}


//launch script
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});


const createJob = async (action: Action) => {
    const tier = await fetchTier(action.PCF_CODE);

        //handle Errors
        
        if(!tier){
            console.log('No tier found'.red)
            throw new Error('No tier found');
        }

        //data to send to kaze
        const data = {
            ...action,
            ...tier.client
        }

        //create fields object
        const fields: any = {
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
        console.log('fields: '.yellow, fields)

        if(!fields.ACT_NUMERO || !fields.PCF_CODE || !fields.CCT_NUMERO || !fields.ACT_OBJET || !fields.ACT_TYPE || !fields.PCF_RS){
            console.log(`Missing fields (${action.ACT_NUMERO})`.red)
        }
        //insert jsons into json
        // const jsonArray: Array<Object> = [
        //     template_type,
        //     template_description,
        //     template_client,
        //     template_contact_num
        // ];
        
        // (job.workflow.children[0].children[0].children as Array<Object>) = jsonArray;

        //insert data into json
        // const updatedJson: Object = jsonMapper(job, fields);
        // const kazeJSON: Object = jsonMapper(kaze_template, fields);

        //this is the final json to send to kaze
        let json = JSON.parse(JSON.stringify(workflow_template));

        const finalWorkflow: any = jsonMapper(json, fields);

        console.log(`posting job(${action.ACT_NUMERO})`.yellow)
        //post job to kaze
        await postJob(finalWorkflow)
        .then(async (response) => {
            //insert response.id into Action XXX_IDMKAZE
            if(!response.id){
                console.log(`No id found (${action.ACT_NUMERO})`.red)
                return 'No ID found'
                // throw new Error('No id found');
            }

            const data = {
                XXX_IDMKAZE: response.id,
                XXX_DTKAZE: new Date()
            }
            //update action in gestimum

            console.log(`updating action... (${action.ACT_NUMERO})`.magenta, data);
            await updateAction(action.ACT_NUMERO, data)
            return 'Success'.bgGreen;
        })
        .catch((error) => {
            console.log(`Error posting job ${action.ACT_NUMERO}`.red);
            return 'Fail'.bgRed;
        });

        return 'passed'.bgGreen;
}

