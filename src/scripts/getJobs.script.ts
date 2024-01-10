import { flattenWorkflow, dataMapper } from '../utils/dataMapper';
import Action from '../models/Action';
import { fetchAction, fetchJobs, fetchjobID, login, updateAction } from './api.functions';
import logger, { logTimeToHistory } from '../logger';
import Job from '../models/Job';
import { log } from 'console';





/* ----------------------------------------SYNC CreateJObs-------------------------------------------------- */
const syncJobs = async (job: any) => {
    let result = 'Passed'.bgBlue;
    //get Action from Gestimum (Job.id = Action.XXX_IDMKZ)
    const action: Array<Action> = await fetchAction(job.id);
    // console.log('action: '.cyan, action);
    
    if(!action[0]){
        console.log('No action found'.red);
        return result;
    }

    //check if Action.XXX_DTKZE < Job.updated_at
    if(!action[0].XXX_DTKZ || !(new Date(action[0].XXX_DTKZ).getTime()+2 > job.updated_at)){
        // console.log(`${new Date(action[0].XXX_DTKZ).getTime()} < ${job.updated_at}`.yellow, new Date(action[0].XXX_DTKZ).getTime() < job.updated_at)
        console.log('Action need to be updated'.yellow);
        //get Job from Kaze
        const jobID = await fetchjobID(job.id);
        // console.log('jobID: '.cyan, jobID);

        if(!jobID){
            console.log('No jobID found'.red);
            return 'No jobID found'.red;
        }

        // const workflow: any = jobID.workflow;
        // console.log('workflow: '.cyan, workflow.children[1].children[0].children[0].data);
        
        // dataMapper
        const data: any = dataMapper(jobID, 'Actions');

        const newAction = {
            XXX_IDMKZ: data.XXX_IDMKZ,
            XXX_DTKZ: new Date(data.XXX_DTKZ),
            ACT_OBJET: data.ACT_OBJET,
            // ACT_NUMERO: data.ACT_NUMERO,
            ACT_DATE: new Date(data.ACT_DATE) ,
            ACT_DATFIN: new Date(data.ACT_DATFIN),
            ACT_DATECH: new Date(data.ACT_DATECH),
            ACT_DESC: data.ACT_DESC,
            XXX_KZURL: jobID.bwa_link,
            ACT_ETAT: 'T',
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
        logTimeToHistory(`[getJobsScript] Action ${action[0].ACT_NUMERO} updated at: ${new Date().toISOString()}`);
    }
    else{
        result = `Action already up to date`.bgBlue;
    }

    return result;
}

/* ----------------------------------------Main-------------------------------------------------- */
const main = async () => {
    console.log('main()'.red.underline);
    logTimeToHistory(`[getJobsScript] Script executed at: ${new Date().toISOString()}`)    
    
    
    //fetching Finish Jobs from Kaze
    const body: Object = {
        filter: {
            status: "completed",
        }
    }
    const jobs: Array<Job> = await fetchJobs(body);
    console.log('jobs finished: '.cyan, jobs.length);
    logTimeToHistory(`[getJobsScript] jobs finished: ${jobs.length}`);

    if (!jobs) {
        console.log('No jobs found'.red);
        return 'No jobs found';
    }
   
    //foreach job 
    for (const job of jobs) {
        const jobID = `${job.id}`.green.bold;
        console.log(`processing job ${jobID}`.yellow);
        try {
            await syncJobs(job)
            .then(async (result) => {
                logTimeToHistory(`[getJobsScript] Result for job ${job.id}: ${result}`);
                console.log(`Result for job ${jobID}: ${result}`);
                console.log('--------------------------------------------------------------'.america + '\n')
            })
            .catch((error) => {
                console.log(`Error processing job ${jobID}`, error);
            });
            
        }
        catch (error: any) {
            console.log(`Error processing job ${jobID}`, error);
            logger.error(new Error(error));
        }

    }

    logTimeToHistory(`[getJobsScript] Script finished at: ${new Date().toISOString()} \n`);
}

//lauch main
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
    logger.error(new Error(error));
});
