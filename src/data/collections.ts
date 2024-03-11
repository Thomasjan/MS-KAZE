//TODO: change ClientsCollection to Clients
//TODO: change ContactsCollection to Contacts
export const fieldsCollectionClients = {
    "collection": {
        "name": "ClientsCollection",
        "icon": "plumber",
        "structure_json": {
            "type": "structure",
            "children":  [
                {
                    "type": "section",
                    "label": "Section",
                    "children": [
                        {
                            "type": "widget_text",
                            "id": "PCF_CODE".toLocaleLowerCase(),
                            "label": "Code Tiers"
                        },
                        {
                            "type": "widget_text",
                            "id": "PCF_TYPE".toLocaleLowerCase(),
                            "label": "Type Tiers"
                        },
                        {
                            "type": "widget_text",
                            "id": "PCF_RS".toLocaleLowerCase(),
                            "label": "Raison sociale"
                        },
                        {
                            "type": "widget_text",
                            "id": "PCF_RUE".toLocaleLowerCase(),
                            "label": "Rue"
                        },
                        {
                            "type": "widget_text",
                            "id": "PCF_COMP".toLocaleLowerCase(),
                            "label": "Complément rue"
                        },
                        {
                            "type": "widget_text",
                            "id": "PCF_CP".toLocaleLowerCase(),
                            "label": "Code postal Facturation"
                        },
                        {
                            "type": "widget_text",
                            "id": "PCF_VILLE".toLocaleLowerCase(),
                            "label": "Ville Facturation"
                        }
                    ]
                }
            ]
        }
    }
};

export const fieldsCollectionContacts = {
    "collection": {
        "name": "ContactsCollection",
        "icon": "plumber",
        "structure_json": {
            "type": "structure",
            "children":  [
                {
                    "type": "section",
                    "label": "Section",
                    "children": [
                        {
                            "type": "widget_text",
                            "id": "CCT_NUMERO".toLocaleLowerCase(),
                            "label": "Code Contact Interne"
                        },
                        {
                            "type": "widget_text",
                            "id": "CCT_NOM".toLocaleLowerCase(),
                            "label": "Nom"
                        },
                        {
                            "type": "widget_text",
                            "id": "CCT_PRENOM".toLocaleLowerCase(),
                            "label": "Prénom"
                        },
                        {
                            "type": "widget_text",
                            "id": "CCT_TELM".toLocaleLowerCase(),
                            "label": "Téléphone"
                        },
                        {
                            "type": "widget_text",
                            "id": "CCT_EMAIL".toLocaleLowerCase(),
                            "label": "Email"
                        }
                    ]
                }
            ]
        }
    }
};



export const collectionClients = {
    items:{
        "item": {
            "name": "PCF_RS",
            "reference": "PCF_CODE",
    
            "widget_data": {
                "pcf_rs": {
                    "data": "PCF_RS"
                },
                "pcf_code": {
                    "data": "PCF_CODE"
                },
                "pcf_type": {
                    "data": "PCF_TYPE"
                },
                "pcf_rue": {
                    "data": "PDC_RUE"
                },
                "pcf_comp": {
                    "data": "PCF_COMP"
                },
                "pcf_cp": {
                    "data": "PCF_CP"
                },
                "pcf_ville": {
                    "data": "PCF_VILLE"
                },
            }
        }
    }
    
}

export const collectionContacts = {
    items:{
        "item": {
            "name": "CCT_NOM",
            "reference": "CCT_NUMERO",
    
            "widget_data": {
                "cct_numero": {
                    "data": "CCT_NUMERO"
                },
                "cct_nom": {
                    "data": "CCT_NOM"
                },
                "cct_prenom": {
                    "data": "CCT_PRENOM"
                },
                "cct_telm": {
                    "data": "CCT_TELM"
                },
                "cct_email": {
                    "data": "CCT_EMAIL"
                },
                
            }
        }
    }
}
