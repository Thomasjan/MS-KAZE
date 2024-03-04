//script to get localhost:3000/api/v1/affaires

import workflow_template from '../data/worflowID';

import jsonMapper from '../utils/jsonMapper';
import Action from '../models/Action';
import { fetchActions, fetchContact, fetchTiers, fetchjobID, insertIntoCollectionFunction, login, postJob, postJobFromWorkflowID, updateAction, updateJobID } from './api.functions';
import logger, { logTimeToHistory } from '../logger';
import { collectionClients, collectionContacts } from '../data/collections';
import moment from 'moment';
import { formatedDate } from '../utils/functions';
moment.locale('fr');



/* ----------------------------------------SYNC CreateJobs-------------------------------------------------- */
const createJob = async (action: Action) => {
    let result = 'Passed';
    if(!action?.PCF_CODE ) {
        await updateAction(action.ACT_NUMERO, {XXX_KZETAT: "Echec - Le Tiers doit être renseigné"})
        return 'No PCF_CODE found'.red;
    }
    let contact;
    if(!action?.CCT_NUMERO ){
        contact = "";
    }
    else{
        contact = await fetchContact(action.CCT_NUMERO);
        if(contact.Erreur) {
            logger.error(`Erreur lors de la récupération du Contact (${action.CCT_NUMERO}) -> `, contact.Erreur)
            await updateAction(action.ACT_NUMERO, {XXX_KZETAT: contact.Erreur})
            return contact.Erreur;
        } 
    }

    //fetch tier and contact
    const tier = await fetchTiers(action.PCF_CODE)
    if(tier.Erreur) {
        logger.error(`Erreur lors de la récupération du Tiers (${action.PCF_CODE}) -> `, tier.Erreur)
        await updateAction(action.ACT_NUMERO, {XXX_KZETAT: tier.Erreur})
        return tier.Erreur;
    }
    

        //handle Errors
        if(!tier){
            console.log('No tier found'.red);
            logger.error('Erreur - Pas de Tiers trouvé');
        }

        //data to send to kaze
        const data = {
            ...action,
            ...tier.client,
            ...contact?.utilisateur,
        }

        //create fields object
        const fields = {
            ACT_NUMERO: data.ACT_NUMERO,
            ACT_OBJET: data.ACT_OBJET,
            CCT_NUMERO: data.CCT_NUMERO,
            CCT_TELM: data.CCT_TELM || '',
            CCT_EMAIL: data.CCT_EMAIL || '',
            CCT_NOM: data.CCT_NOM,
            CCT_PRENOM: data.CCT_PRENOM,
            PCF_CODE: data.PCF_CODE,
            PCF_RUE: data.PCF_RUE,
            PCF_CP: data.PCF_CP,
            PCF_VILLE: data.PCF_VILLE,
            PCF_COMP: data.PCF_COMP,
            ACT_DATE: data.ACT_DATE,
            ACT_DATFIN: data.ACT_DATFIN,
            ACT_DATECH: formatedDate(new Date(data.ACT_DATECH)),
            ACT_TYPE: data.ACT_TYPE,
            ACT_DESC: data.ACT_DESC,
            PCF_RS: data.PCF_RS,
            PCF_EMAIL: data.PCF_EMAIL || '',
            XXX_KZIDM: data.XXX_KZIDM,
            XXX_KZPARC: data.XXX_KCPARC,
        }

        console.log('inserting into collections...'.yellow);
        const clients_items = collectionClients.items
        clients_items.item = {
            ...clients_items.item,
            name: data.PCF_RS,
            reference: data.PCF_CODE,
            widget_data: {
                ...clients_items.item.widget_data,
                pcf_code: {
                    data: data.PCF_CODE
                },
                pcf_rs: {
                    data: data.PCF_RS
                },
                pcf_rue: {
                    data: data.PCF_RUE
                },
                pcf_comp: {
                    data: data.PCF_COMP
                },
                pcf_cp: {
                    data: data.PCF_CP
                },
                pcf_ville: {
                    data: data.PCF_VILLE
                },
            }
        }
        await insertIntoCollectionFunction(collectionClients.id , clients_items);

        const contacts_items = collectionContacts.items
        contacts_items.item = {
            ...contacts_items.item,
            name: data.CCT_NOM,
            reference: data.CCT_NUMERO,
            widget_data: {
                ...contacts_items.item.widget_data,
                cct_nom: {
                    data: data.CCT_NOM
                },
                cct_prenom: {
                    data: data.CCT_PRENOM
                },
                cct_telm: {
                    data: data.CCT_TELM
                },
                cct_email: {
                    data: data.CCT_EMAIL
                },
            }
        }
        // await insertIntoCollectionFunction(collectionContacts.id , contacts_items);

       if(!data.XXX_KZPARC && data.XXX_KZETAT != 'Echec - Vous devez renseigner le parcours de mission (XXX_KZPARC)'){
            console.log('No parc found'.red);
            logger.error(`Erreur - L'action ${action.ACT_NUMERO} n'a pas de parcours de mission (XXX_KZPARC)`);
            const data = {
                XXX_KZETAT: `Echec - Vous devez renseigner le parcours de mission (XXX_KZPARC)`
            }
            await updateAction(action.ACT_NUMERO, data);
            return `Missing required field XXX_KZPARC`.red;
       }

        const requiredFields = ['ACT_NUMERO', 'PCF_CODE', 'ACT_OBJET', 'ACT_TYPE', 'PCF_RS', 'PCF_VILLE', 'PCF_CP', 'PCF_RUE', 'ACT_DATE'];

        //check if required fields are present
        for (const field of requiredFields) {
            const fieldID = `${field}`.yellow;
            if(!fields[field]){
                logger.error(`Champs manquants (${field}) pour l'action ${action.ACT_NUMERO}}`);
                const data = {
                    XXX_KZETAT: `Echec - Le champ "${field}" doit être renseigné`
                }
                await updateAction(action.ACT_NUMERO, data);
                return `Missing required field ${fieldID}`.red;
            }
        }

        //this is the final json to send to kaze
        let json = JSON.parse(JSON.stringify(workflow_template));
        const finalWorkflow: any = jsonMapper(json, fields);
        finalWorkflow.workflow_id = data.XXX_KZPARC;

        const postingJob = `${action.ACT_NUMERO}`.rainbow;
        //post job to kaze
        console.log(`posting job(${postingJob})`.yellow);
        
        const workflowID = finalWorkflow.workflow_id;

        await postJobFromWorkflowID(workflowID, finalWorkflow)
        .then(async (response) => {
            console.log('.THEN'.green, response)
            if(response.error){
                updateAction(action.ACT_NUMERO, {XXX_KZETAT: 'Erreur -' + response.error});
                return;
            }
            //insert response.id into Action XXX_KZIDM
            if(!response.id){
                console.log(`No id found (${action.ACT_NUMERO})`.red);
                logger.error(`Erreur lors de la création de la mission (${action.ACT_NUMERO})`);
                result = 'Fail'.bgRed;
                return;
            }

            const data = {
                XXX_KZIDM: response.id,
                XXX_KZDT: formatedDate(new Date()),
                XXX_KZETAT: 'Mission créée dans Kaze',
                ACT_ETAT: 'Début',
            }
            //update action in gestimum

            console.log(`updating action... (${action.ACT_NUMERO})`.magenta);
            await updateAction(action.ACT_NUMERO, data);
            logTimeToHistory(`[createJobsScript] Mission ${response.id} créée pour l'action ${action.ACT_NUMERO}`);
            result = 'Success'.bgGreen;
        })
        .catch((error) => {
            console.log('.CATCH'.red, error)
            console.log(`Error posting job (${action.ACT_NUMERO})`, error);
            logger.error(`Erreur lors de la création de la mission (${action.ACT_NUMERO}) -> `, error);
            result = 'Fail'.bgRed;
        });

        //result
        return result;
}


//UPDATE JOB
const updateJob = async (action: any) => {
    const Job = await fetchjobID(action.XXX_KZIDM);
    if(!Job){
        console.log(`ID de mission non trouvé (${action.XXX_KZIDM})`.red);
        logger.error(`ID de mission non trouvé (${action.XXX_KZIDM})`);
    }
    // console.log('Job: '.cyan, Job);
    if(Job.status_name != 'Début' && action.XXX_KZETAT != 'Erreur - La mission est déjà commencée, veuillez la modifier dans Kaze'){
        console.log(`La mission n'est pas en état "Début" (${action.XXX_KZIDM})`.red);
        logTimeToHistory(`[createJobsScript] La mission n'est pas en état "Début" (${action.XXX_KZIDM})`);
        updateAction(action.ACT_NUMERO, {XXX_KZETAT: `Erreur - La mission est déjà commencée, veuillez la modifier dans Kaze`});
    }

    if(!action?.PCF_CODE ) {
        await updateAction(action.ACT_NUMERO, {XXX_KZETAT: "Echec - Le Tiers doit être renseigné"})
        return 'No PCF_CODE found'.red;
    }
    let contact;
    if(!action?.CCT_NUMERO ){
        contact = "";
    }
    else{
        contact = await fetchContact(action.CCT_NUMERO);
        if(contact.Erreur) {
            logger.error(`Erreur lors de la récupération du Contact (${action.CCT_NUMERO}) -> `, contact.Erreur)
            await updateAction(action.ACT_NUMERO, {XXX_KZETAT: contact.Erreur})
            return contact.Erreur;
        } 
    }

    //fetch tier and contact
    const tier = await fetchTiers(action.PCF_CODE)
    if(tier.Erreur) {
        logger.error(`Erreur lors de la récupération du Tiers (${action.PCF_CODE}) -> `, tier.Erreur)
        await updateAction(action.ACT_NUMERO, {XXX_KZETAT: tier.Erreur})
        return tier.Erreur;
    }
    
        //handle Errors
        if(!tier){
            console.log('No tier found'.red);
            logger.error('Pas de Tiers trouvé');
        }

        //data to send to kaze
        const data = {
            ...action,
            ...tier.client,
            ...contact?.utilisateur,
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
            ACT_DATECH: formatedDate(new Date(data.ACT_DATECH)),
            ACT_TYPE: data.ACT_TYPE,
            ACT_DESC: data.ACT_DESC,
            PCF_RS: data.PCF_RS,
            PCF_EMAIL: data.PCF_EMAIL || '',
            XXX_KZIDM: data.XXX_KZIDM,
            CCT_NOM: data.CCT_NOM,
            CCT_PRENOM: data.CCT_PRENOM,
        }


        // console.log('fields: '.yellow, fields)
        const requiredFields = ['ACT_NUMERO', 'PCF_CODE', 'ACT_OBJET', 'ACT_TYPE', 'PCF_RS', 'PCF_VILLE', 'PCF_CP', 'PCF_RUE', 'ACT_DATE'];

        //check if required fields are present
        for (const field of requiredFields) {
            const fieldID = `${field}`.yellow;
            if(!fields[field]){
                logger.error(`Champs manquants (${field}) pour l'action ${action.ACT_NUMERO}}`);
                const data = {
                    XXX_KZETAT: `Echec - Le champ "${field}" doit être renseigné`
                }
                await updateAction(action.ACT_NUMERO, data);
                return `Missing required field ${fieldID}`.red;
            }
        }

        //this is the final json to send to kaze
        let json = JSON.parse(JSON.stringify(workflow_template));
        const finalWorkflow: any = jsonMapper(json, fields);

        const updatedJob = `${action.ACT_NUMERO}`.rainbow;
        //post job to kaze
        console.log(`updating job (${updatedJob}) ...`.yellow);
        // console.log('finalWorkflow: '.cyan, finalWorkflow);

        const widgets = finalWorkflow.data;

        //passing widgets to updateJobID
        updateJobID(Job.id, widgets);

        //update Action DTMAJ 2024-02-28 15:25:39.853
        await updateAction(action.ACT_NUMERO, {XXX_KZDT: formatedDate(new Date())});

    return;
}
    

/* ----------------------------------------Main-------------------------------------------------- */
const main = async () => {
    console.log('main()'.red.underline)
    logTimeToHistory(`[createJobsScript] Début de l'exécution du script le: ${moment().format()}`)
    
    //fetching actions
    const actions: Array<Action> = await fetchActions();

    if (!actions) {
        console.log('No actions found'.red);
        logger.error('Pas d\'actions trouvées dans Gestimum \n');
    }

    //MISE A JOUR DES MISSIONS
    const actionsWithKazeID: Array<Action> = actions.filter((action) => action.XXX_KZIDM);

    console.log('actionsWithKazeID: '.cyan, actionsWithKazeID.length);
    logTimeToHistory(`[createJobsScript] Nombre d'actions synchronisée avec Kaze: ${actionsWithKazeID.length}`);

    actionsWithKazeID?.forEach((action) => {
        console.log('action: '.cyan, action.ACT_NUMERO);
        //if (action.ACT_DTMAJ || ACT_DTCRE) > XXX_KZDT, get Job and update Job with Action data, then update action.XXX_KZDT
        if(action.ACT_DTMAJ > action.XXX_KZDT){
            console.log(`Une Action a été modifiée dans Gestimum: ${action.ACT_NUMERO}`.cyan);
            logTimeToHistory(`[createJobsScript] Une Action a été modifiée dans Gestimum: ${action.ACT_NUMERO}`);
            updateJob(action);
        }
    })

    ///CREATION DES MISSIONS
    const actionsWithoutKazeID: Array<Action> = actions.filter((action) => !action.XXX_KZIDM);
    console.log('actionsWithoutKazeID: '.cyan, actionsWithoutKazeID.length);

    if(actionsWithoutKazeID.length === 0){
        console.log('No actions to create'.yellow);
        logTimeToHistory(`[createJobsScript] Pas d'actions a créées dans Kaze \n`);
    }

    //create job for each action
    actionsWithoutKazeID?.forEach(async (action) => {
        const jobID = `${action.ACT_NUMERO}`.green.bold;
        console.log(`creating job(${jobID})`.yellow);

        try {
            await createJob(action)
            .then(async (result) => {
                logTimeToHistory(`[createJobsScript] Resultat pour l'action ${action.ACT_NUMERO}: ${result}`);
                console.log(`Result for action ${jobID}: ${result}`);
                console.log('--------------------------------------------------------------'.america + '\n');
            })
            .catch((error) => {
                console.log(`Error processing action ${jobID}`, error);
            });
        } catch (error) {
            console.log(`Error processing action ${jobID}`, error);
        }
    })

    logTimeToHistory(`[createJobsScript] Fin d'exécution du script le: ${moment().format()} \n`)
}


/* ----------------------------------------lauch script-------------------------------------------------- */
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});




