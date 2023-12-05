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

    sync_kaze: boolean;
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
    ACT_DATECH: string;
};


const dataMapper = (data: any, table: string) => {

    switch (table) {
        
        //Kaze vers Gestimum

            case 'Actions':
                
            const fields = {
                XXX_IDMKAZE: data.id,
                ACT_NUMERO: data.children[0]?.job_reference,
                ACT_OBJET: data.children[0]?.job_title,
                PCF_RUE: data.children[0]?.job_address,
                PCF_CP: data.children[0]?.zip_code,
                PCF_VILLE: data.children[0]?.city,
                ACT_DATE: data.children[0]?.job_start_date,
                ACT_DATFIN: data.children[0]?.job_end_date,
                ACT_DATECH: data.children[0]?.job_due_date,
            }

            return fields;



        //Gestimum vers Kaze

            case 'Jobs':
                const jobs = {
                    id: data.XXX_IDMKAZE,
                    job_reference: data.ACT_NUMERO,
                    job_type: data.ACT_TYPE,
                    job_title: data.ACT_OBJET,
                    job_desc: data.ACT_DESC,
                    job_companie_code: data.code,
                    job_companie_name: data.raison_sociale,
                    job_address: data.adresse,
                    zip_code: data.code_postal,
                    city: data.ville,
                    job_contact: data.CCT_NUMERO,
                    job_start_date: data.ACT_DATE,
                    job_end_date: data.ACT_DATFIN,
                    job_expiration: data.ACT_DATECH,

                    last_maj: data.XXX_DTKAZE,
                    sync_kaze: data.XXX_IDMKAZE,
                    template_navigation: data.XXX_GKNAV,
                    template_photo: data.XXX_GKIMAGE,
                    template_signature: data.XXX_GKSIGN,
                    template_time_follow: data.XXX_GKTRAC,
                    template_blank: data.XXX_GKVIDE,
                    template_inspection: data.XXX_GKINSP,

                }; 

                return jobs;


        default:
        return undefined;
    }
}

export default dataMapper;