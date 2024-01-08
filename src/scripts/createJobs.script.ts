//script to get localhost:3000/api/v1/affaires

import workflow_template from '../data/worflowID';

import jsonMapper from '../utils/jsonMapper';
import Action from '../models/Action';
import { fetchActions, fetchContact, fetchTier, login, postJob, postJobFromWorkflowID, updateAction } from './api.functions';
import logger from '../logger';



/* ----------------------------------------SYNC CreateJobs-------------------------------------------------- */
const createJob = async (action: Action) => {
    let result = 'Passed';
    if(!action?.PCF_CODE ) return 'No PCF_CODE found'.red;
    if(!action?.CCT_NUMERO ) return 'No CCT_NUMERO found'.red;

    //fetch tier and contact
    const tier = await fetchTier(action.PCF_CODE);
    const contact = await fetchContact(action.CCT_NUMERO);

        //handle Errors
        if(!tier){
            console.log('No tier found'.red);
            logger.error('No tier found');
        }

        //data to send to kaze
        const data = {
            ...action,
            ...tier.client,
            ...contact.utilisateur,
        }

        //create fields object
        const fields = {
            ACT_NUMERO: data.ACT_NUMERO,
            ACT_OBJET: data.ACT_OBJET,
            CCT_NUMERO: data.CCT_NUMERO,
            CCT_TELM: data.CCT_TELM || '',
            CCT_EMAIL: data.CCT_EMAIL || '',
            PCF_CODE: data.PCF_CODE,
            PCF_RUE: data.PCF_RUE,
            PCF_CP: data.PCF_CP,
            PCF_VILLE: data.PCF_VILLE,
            ACT_DATE: data.ACT_DATE,
            ACT_DATFIN: data.ACT_DATFIN,
            //+ 1h to ACT_DATECH
            ACT_DATECH: new Date(data.ACT_DATECH).getTime(),
            ACT_TYPE: data.ACT_TYPE,
            ACT_DESC: data.ACT_DESC,
            PCF_RS: data.PCF_RS,
            PCF_EMAIL: data.PCF_EMAIL || '',
            XXX_IDMKAZE: data.XXX_IDMKAZE,
            CCT_NOM: data.CCT_NOM,
            CCT_PRENOM: data.CCT_PRENOM,
        }


        // console.log('fields: '.yellow, fields)
        const requiredFields = ['ACT_NUMERO', 'PCF_CODE', 'CCT_NUMERO', 'ACT_OBJET', 'ACT_TYPE', 'PCF_RS', 'PCF_VILLE', 'PCF_CP', 'PCF_RUE'];

        //check if required fields are present
        for (const field of requiredFields) {
            const fieldID = `${field}`.yellow;
            if(!fields[field]){
                logger.error(`Missing required field ${field} for action ${action.ACT_NUMERO}}`);
                return `Missing required field ${fieldID}`.red;
            }
        }

        //this is the final json to send to kaze
        let json = JSON.parse(JSON.stringify(workflow_template));
        const finalWorkflow: any = jsonMapper(json, fields);
        // console.log('finalWorkflow: '.yellow, finalWorkflow.data);

        const postingJob = `${action.ACT_NUMERO}`.rainbow;
        //post job to kaze
        console.log(`posting job(${postingJob})`.yellow);
        // await postJob(finalWorkflow)
        // .then(async (response) => {
        //     //insert response.id into Action XXX_IDMKAZE
        //     if(!response.id){
        //         console.log(`No id found (${action.ACT_NUMERO})`.red);
        //         logger.error(`No id found (${action.ACT_NUMERO})`);
        //         result = 'Fail'.bgRed;
        //         return;
        //     }

        //     const data = {
        //         XXX_IDMKAZE: response.id,
        //         XXX_DTKAZE: new Date(),
        //     }
        //     //update action in gestimum

        //     console.log(`updating action... (${action.ACT_NUMERO})`.magenta);
        //     await updateAction(action.ACT_NUMERO, data);
        //     result = 'Success'.bgGreen;
        // })
        // .catch((error) => {
        //     console.log(`Error posting job ${action.ACT_NUMERO}`.red);
        //     logger.error(`Error posting job ${action.ACT_NUMERO}`);
        //     result = 'Fail'.bgRed;
        // });
        const workflowID = finalWorkflow.workflow_id;

        await postJobFromWorkflowID(workflowID, finalWorkflow)
        .then(async (response) => {
            //insert response.id into Action XXX_IDMKAZE
            if(!response.id){
                console.log(`No id found (${action.ACT_NUMERO})`.red);
                logger.error(`No id found (${action.ACT_NUMERO})`);
                result = 'Fail'.bgRed;
                return;
            }

            const data = {
                XXX_IDMKAZE: response.id,
                XXX_DTKAZE: new Date(),
            }
            //update action in gestimum

            console.log(`updating action... (${action.ACT_NUMERO})`.magenta);
            await updateAction(action.ACT_NUMERO, data);
            result = 'Success'.bgGreen;
        })

        //result
        return result;
}

/* ----------------------------------------Main-------------------------------------------------- */
const main = async () => {
    console.log('main()'.red.underline)
    
    //fetching actions
    const actions: Array<Action> = await fetchActions();
    // console.log('actions: '.cyan, actions)

    if (!actions) {
        console.log('No actions found'.red);
        throw new Error('No action found');
    }

    //actiions without XXX_IDMKAZE (No Job created in kaze)
    const actionsWithoutKazeID: Array<Action> = actions.filter((action) => {
        return !action.XXX_IDMKAZE;
    });
    console.log('actionsWithoutKazeID: '.cyan, actionsWithoutKazeID.length);

    if(actionsWithoutKazeID.length === 0){
        console.log('No actions to create'.yellow);
        return;
    }

    //create job for each action
    for (const action of actionsWithoutKazeID) {

        const jobID = `${action.ACT_NUMERO}`.green.bold;
        console.log(`creating job(${jobID})`.yellow);

        try {
            await createJob(action)
            .then(async (result) => {
                console.log(`Result for action ${jobID}: ${result}`);
                console.log('--------------------------------------------------------------'.america + '\n');
            })
            .catch((error) => {
                console.log(`Error processing action ${jobID}`, error);
            });
        } catch (error) {
            console.log(`Error processing action ${jobID}`, error);
        }
    }
}


/* ----------------------------------------lauch script-------------------------------------------------- */
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});




