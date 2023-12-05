import axios from 'axios';
import 'colors';
import dataMapper from './utils/dataMapper';



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

//fetch jobs from Kaze
const fetchJobs = async () => {
    console.log('fetchJobs()'.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/`);
        return response.data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

const fetchjobID = async (id: String) => {
    console.log('fetchjobID()'.magenta)
    try{
        const response = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/${id}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}



const main = async () => {
    console.log('main()'.red.underline)
    
    //fetching jobs from Kaze
    const jobs = await fetchJobs();
    //handle Errors
    if (!jobs) {
        throw new Error('No jobs found');
    }

    const firstjobId: String = jobs.data[0].id;
    // console.log('firstjobId: '.cyan, firstjobId);

    //fetching jobID from Kaze
    const jobID = await fetchjobID(firstjobId);
    //handle Errors
    if (!jobID) {
        throw new Error('No jobID found');
    }
    // console.log('job: '.cyan, jobID);

    const workflow = jobID.workflow;
    // console.log('workflow: '.cyan, workflow);
    
    const result = dataMapper(workflow, 'Actions');
    console.log('result: '.cyan, result);
    
}

login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
});
