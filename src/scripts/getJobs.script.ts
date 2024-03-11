import { flattenWorkflow, dataMapper } from '../utils/dataMapper';
import Action from '../models/Action';
import { fetchAction, fetchJobs, fetchjobID, login, updateAction } from './api.functions';
import logger, { logTimeToHistory } from '../logger';
import Job from '../models/Job';
import moment from 'moment';
import { formatedDate } from '../utils/functions';
moment.locale('fr');



/* ----------------------------------------SYNC CreateJObs-------------------------------------------------- */
const syncJobs = async (job: any) => {
    let result = 'Passed'.bgBlue;

    if(job.status_name == 'Début'){
        console.log("Job is waiting".yellow);
        return;
    }
    //get Action from Gestimum (Job.id = Action.XXX_KZIDM)
    const action: Array<Action> = await fetchAction(job.id);
    // console.log('action: '.cyan, action);
    
    if(!action[0]){
        console.log('No action found'.red);
        return result;
    }

    

    //check if Action.XXX_KZDTE < Job.updated_at
    console.log(`${new Date(action[0].XXX_KZDT).getTime()+2} < ${job.updated_at+3600*1000}: `, new Date(action[0].XXX_KZDT).getTime()+2 > job.updated_at+3600*1000)
    // console.log(`${(new Date(action[0].XXX_KZDT).toISOString())} < ${new Date(job.updated_at+3600*1000).toISOString()}: `.yellow, new Date(action[0].XXX_KZDT) < job.updated_at+3600*1000)
    if(!action[0].XXX_KZDT || !(new Date(action[0].XXX_KZDT).getTime()+2 > job.updated_at+3600*1000)){
        console.log('Action need to be updated'.yellow);
        logTimeToHistory(`[getJobsScript] Action ${action[0].ACT_NUMERO} besoin de mise à jour :${moment().format()}`);
        const jobID = await fetchjobID(job.id);

        if(!jobID){
            console.log('No jobID found'.red);
            logger.error(`Pas de mission trouvée pour l'action ${action[0].ACT_NUMERO}`)
            return 'No jobID found'.red;
        }
        
        // dataMapper
        const data: any = dataMapper(jobID, 'Actions');
       
        const newAction = {
            XXX_KZIDM: data.XXX_KZIDM,
            XXX_KZDT:  formatedDate(new Date(data.XXX_KZDT)),
            ACT_OBJET: data.ACT_OBJET,
            ACT_DATE:  formatedDate(new Date(data.ACT_DATE)),
            ACT_DATFIN:  formatedDate(new Date(data.ACT_DATFIN)),
            ACT_DATECH:  formatedDate(new Date(data.ACT_DATECH)),
            ACT_DESC: data.ACT_DESC,
            ACT_DTMAJ: formatedDate(new Date(data.XXX_KZDT)),
            XXX_KZURL: jobID.bwa_link,
            ACT_ETAT: job.status_name,
            XXX_KZETAT: "MIS A JOUR le " + moment().format('LLL'),
        }

        //update Action with data
        console.log('updating action...: '.cyan);
        const update: Action = await updateAction(data.ACT_NUMERO, newAction);
        if(!update){
            console.log('Error updating action'.red);
            return 'Error updating action'.red;
        }

        // console.log('update: '.cyan, update);
        result = `Action ${action[0].ACT_NUMERO} updated`.bgGreen;
        logTimeToHistory(`[getJobsScript] Action ${action[0].ACT_NUMERO} mise à jour le: ${moment().format()}`);
    }
    else{
        result = `Action already up to date`.bgBlue;
    }

    return result;
}

/* ----------------------------------------Main-------------------------------------------------- */
const main = async () => {
    console.log('main()'.red.underline);
    logTimeToHistory(`[getJobsScript] Début de l'exécution du script le: ${moment().format()}`)    
    
    
    //fetching Finish Jobs from Kaze
    const finish: Object = {
        filter: {
            status: "initial,in_progress,completed,assigned",
        }
    }
    const jobs: Array<Job> = await fetchJobs(finish);
    console.log('jobs finished: '.cyan, jobs.length);
    logTimeToHistory(`[getJobsScript] Nombres de mission terminées: ${jobs.length}`);

    if (!jobs) {
        console.log('No finished jobs found'.red);
        logTimeToHistory(`[getJobsScript] Psa de mission terminées trouvées le: ${moment().format()}`);
        return 'No finished jobs found';
    }
   
    //foreach job 
    for (const job of jobs) {
        const jobID = `${job.id}`.green.bold;
        console.log(`processing job ${jobID}`.yellow);
        try {
            await syncJobs(job)
            .then(async (result) => {
                logTimeToHistory(`[getJobsScript] Résultat pour la mission ${job.id}: ${result}`);
                console.log(`Result for job ${jobID}: ${result}`);
                console.log('--------------------------------------------------------------'.america + '\n')
            })
            .catch((error) => {
                console.log(`Error processing job ${jobID}`, error);
            });
            
        }
        catch (error: any) {
            console.log(`Error processing job ${jobID}`, error);
            logger.error(`Erreur lors du traitement de la mission ${jobID}: ${error}`);
        }

    }

    logTimeToHistory(`[getJobsScript] Fin d'exécution du script le: ${moment().format()} \n`);
}

//lauch main
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
    logger.error(`Erreur du lancement du script: ${error}`);
});
