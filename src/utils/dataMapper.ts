//dataMapper

type Jobs = { 
    id: string;
    job_reference: string;
    job_title: string;
    job_address: string;
    zip_code: string;
    city: string;
    job_start_date: string;
    job_end_date: string;
};

type Actions = {
    ACT_NUMERO: string;
    ACT_OBJET: string;
    PCF_RUE: string;
    PCF_CP: string;
    PCF_VILLE: string;
    ACT_DATE: string;
    ACT_DATFIN: string;
    XXX_IDMKAZE: string;
};


const dataMapper = (data: any, table: string) => {

    switch (table) {
        
        //Kaze vers Gestimum

            case 'Actions':
                
            const actions = {
                ACT_NUMERO: data.job_reference,
                ACT_OBJET: data.job_title,
                PCF_RUE: data.job_address,
                PCF_CP: data.zip_code,
                PCF_VILLE: data.city,
                ACT_DATE: data.job_start_date,
                ACT_DATFIN: data.job_end_date,
                XXX_IDMKAZE: data.id, // (Workflow)
            };

            return actions;



        //Gestimum vers Kaze

            case 'Jobs':
                const jobs = {
                    id: data.XXX_IDMKAZE,
                    job_reference: data.ACT_NUMERO,
                    job_title: data.ACT_OBJET,
                    job_address: data.PCF_RUE,
                    zip_code: data.PCF_CP,
                    city: data.PCF_VILLE,
                    job_start_date: data.ACT_DATE,
                    job_end_date: data.ACT_DATFIN,
                }; 

                return jobs;


        default:
        return undefined;
    }
}

export default dataMapper;