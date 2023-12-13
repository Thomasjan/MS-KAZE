//script to get localhost:3000/api/v1/affaires

import workflow_template from '../data/workflow_exemple.json';

import jsonMapper from '../utils/jsonMapper';
import Action from '../models/Action';
import { fetchActions, fetchContact, fetchTier, login, postJob, updateAction } from './api.functions';
import logger from '../logger';



/* ----------------------------------------SYNC CreateJObs-------------------------------------------------- */
const createJob = async (action: Action) => {
    let result = 'Passed';
    const tier = await fetchTier(action.PCF_CODE);
    const contact = await fetchContact(action.CCT_NUMERO);

        //handle Errors
        if(!tier){
            console.log('No tier found'.red)
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
            PCF_CODE: data.PCF_CODE,
            CCT_NUMERO: data.CCT_NUMERO,
            CCT_TELM: data.CCT_TELM || '',
            CCT_EMAIL: data.CCT_EMAIL || '',
            ACT_OBJET: data.ACT_OBJET,
            ACT_TYPE: data.ACT_TYPE,
            ACT_DESC: data.ACT_DESC,
            ACT_DATE: data.ACT_DATE,
            ACT_DATFIN: data.ACT_DATFIN,
            ACT_DATECH: data.ACT_DATECH,
            PCF_RS: data.PCF_RS,
            PCF_EMAIL: data.PCF_EMAIL || '',
            PCF_VILLE: data.PCF_VILLE,
            PCF_CP: data.PCF_CP,
            PCF_RUE: data.PCF_RUE,
            XXX_IDMKAZE: data.XXX_IDMKAZE,
            
        }
        // console.log('fields: '.yellow, fields)
        const requiredFields = ['ACT_NUMERO', 'PCF_CODE', 'CCT_NUMERO', 'ACT_OBJET', 'ACT_TYPE', 'PCF_RS', 'PCF_VILLE', 'PCF_CP', 'PCF_RUE'];

        //check if required fields are present
        for (const field of requiredFields) {
            if(!fields[field]){
                logger.error(`Missing required field ${field}`);
                return `Missing required field ${field}`.red;
            }
        }

        //this is the final json to send to kaze
        let json = JSON.parse(JSON.stringify(workflow_template));
        const finalWorkflow: any = jsonMapper(json, fields);

        //post job to kaze
        console.log(`posting job(${action.ACT_NUMERO})`.yellow)
        await postJob(finalWorkflow)
        .then(async (response) => {
            //insert response.id into Action XXX_IDMKAZE
            if(!response.id){
                console.log(`No id found (${action.ACT_NUMERO})`.red)
                logger.error(`No id found (${action.ACT_NUMERO})`);
                result = 'Fail'.bgRed;
                return;
            }

            const data = {
                XXX_IDMKAZE: response.id,
                XXX_DTKAZE: new Date()
            }
            //update action in gestimum

            console.log(`updating action... (${action.ACT_NUMERO})`.magenta);
            await updateAction(action.ACT_NUMERO, data)
            result = 'Success'.bgGreen;
        })
        .catch((error) => {
            console.log(`Error posting job ${action.ACT_NUMERO}`.red);
            logger.error(`Error posting job ${action.ACT_NUMERO}`);
            result = 'Fail'.bgRed;
        });

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
        console.log('No actions found'.red)
        throw new Error('No action found');
    }
    //actiions without XXX_IDMKAZE (No Job created in kaze)
    const actionsWithoutKazeID: Array<Action> = actions.filter((action) => {
        return !action.XXX_IDMKAZE;
    });
    console.log('actionsWithoutKazeID: '.cyan, actionsWithoutKazeID.length)

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
                console.log('--------------------------------------------------------------'.america + '\n')
            })
            .catch((error) => {
                console.log(`Error processing action ${action.ACT_NUMERO}`, error);
            });
        } catch (error) {
            console.log(`Error processing action ${action.ACT_NUMERO}`, error);
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




