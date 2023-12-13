//dataMapper

const dataMapper = (data: any, table: string) => {

    switch (table) {
        
        //Kaze vers Gestimum

            case 'Actions':
                
            const fields: any = {
                XXX_IDMKAZE: data.id,
                XXX_DTKAZE: data.updated_at,
                ACT_OBJET: data.title,
                ACT_NUMERO: data.reference,
                ACT_STATUS: data.status_name,
                PCF_RUE: data.workflow.children[0]?.job_address,
                PCF_CP: data.workflow.children[0]?.zip_code,
                PCF_VILLE: data.workflow.children[0]?.city,
                ACT_DATE: data.workflow.children[0]?.job_start_date,
                ACT_DATFIN: data.workflow.children[0]?.job_end_date,
                ACT_DATECH: data.workflow.children[0]?.job_due_date,

                XXX_GKNAV: template_navigation(data.workflow.children[1]),
                XXX_GKIMA: template_photo(data.workflow.children[2]),
                XXX_GKSIGN: template_signature(data.workflow.children[3]), 
                XXX_GKVIDE: template_blank(data.workflow.children[4]),
                // XXX_GKTRAC 
                // XXX_GKINSP 
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


const template_navigation = (data: any) => {
    return `
    Ville: ${data.city}, ${data.zip_code} \n
    Adresse: ${data.address}, ${data.details} \n
    Contact:  ${data.beneficiary_phone} \n`
}

const template_photo = (data: any) => {
    return `
    Instructions: ${data.annotation_tips} \n
    Photo: ${JSON.stringify(data.photos[0])}`
}

const template_signature = (data: any) => {
    return `
    Signature ${data.terms}: ${data.signature}`
}

const template_blank = (data: any) => {
    return JSON.stringify(data)
}

export default dataMapper;