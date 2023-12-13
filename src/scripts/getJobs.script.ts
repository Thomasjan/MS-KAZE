import dataMapper from '../utils/dataMapper';
import Action from '../models/Action';
import { fetchAction, fetchJobs, fetchjobID, login, updateAction } from './api.functions';
import logger from '../logger';





/* ----------------------------------------SYNC CreateJObs-------------------------------------------------- */
const syncJobs = async (job: any) => {
    let result = 'Passed'.bgBlue
    //get Action from Gestimum (Job.id = Action.XXX_IDMKAZE)
    const action: Array<Action> = await fetchAction(job.id);
    // console.log('action: '.cyan, action);
    
    if(!action[0]){
        console.log('No action found'.red)
        return result;
    }

    //check if Action.XXX_DTKAZE < Job.updated_at
    if(!action[0].XXX_DTKAZE || !(new Date(action[0].XXX_DTKAZE).getTime()+2 > job.updated_at)){
        // console.log(`${new Date(action[0].XXX_DTKAZE).getTime()} < ${job.updated_at}`.yellow, new Date(action[0].XXX_DTKAZE).getTime() < job.updated_at)
        console.log('Action need to be updated'.yellow)
        //get Job from Kaze
        const jobID: any = await fetchjobID(job.id);
        // console.log('jobID: '.cyan, jobID);

        if(!jobID){
            console.log('No jobID found'.red)
            return 'No jobID found'.red;
        }
        
        //dataMapper
        const data = dataMapper(jobID, 'Actions');
        // console.log('data: '.cyan, data);

        const newAction = {
            XXX_IDMKAZE: data.XXX_IDMKAZE,
            XXX_DTKAZE: new Date(data.XXX_DTKAZE),
            ACT_OBJET: data.ACT_OBJET,
            ACT_NUMERO: data.ACT_NUMERO,
            // ACT_STATUS: data.ACT_STATUS,
            ACT_DATE: new Date(data.ACT_DATE) ,
            ACT_DATFIN: new Date(data.ACT_DATFIN),
            ACT_DATECH: new Date(data.ACT_DATECH),
            XXX_GKNAV: data.XXX_GKNAV,
            XXX_GKIMA: data.XXX_GKIMA,
            XXX_GKSIGN: data.XXX_GKSIGN,
            XXX_GKVIDE: data.XXX_GKVIDE,
        }

        //update Action with data
        console.log('updating action...: '.cyan);
        const update: Object = await updateAction(newAction.ACT_NUMERO, newAction);

        result = `Action updated`.bgGreen;
    }
    else{
        result = `Action already up to date`.bgBlue;
    }

    return result;
}

/* ----------------------------------------Main-------------------------------------------------- */
const main = async () => {
    console.log('main()'.red.underline)
    
    
    //fetching Finish Jobs from Kaze
    const body: Object = {
        filter: {
            status: "in_progress", //TODO: change to "finished"
        }
    }
    const jobs: Array<Object> = await fetchJobs(body);
    console.log('jobs finished: '.cyan, jobs.length);

    if (!jobs) {
        console.log('No jobs found'.red)
        return 'No jobs found';
    }
   
    //foreach job 
    jobs.forEach(async (job: any) => {
    try {
        await syncJobs(job)
        .then(async (result) => {
            console.log(`Result for job ${job.id}: ${result}`);
            console.log('--------------------------------------------------------------'.america + '\n')
        })
        .catch((error) => {
            console.log(`Error processing job ${job.id}`, error);
        });
        
    }
    catch (error) {
        console.log(`Error processing job ${job.id}`, error);
    }
})

}

//lauch main
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
    logger.error(new Error(error));
});
