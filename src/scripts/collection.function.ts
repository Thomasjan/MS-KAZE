//Créer les collections nécessaires dans Kaze

import axios from 'axios';
import logger from '../logger';
import { getAuthToken, login } from '../controllers/auth.controllers';
require('dotenv').config();

let collectionCreated: boolean = false;

// Login to Kaze
export const createCollections = async (): Promise<void> => {
    if(collectionCreated) return;

    //login to get the token

    await login();

    const token = await getAuthToken();
    
    let collectionName: string = '';
    let children: Array<Object> = [];


    const baseJson = {
        "collection": {
            "name": collectionName,
            "icon": "plumber",
            "structure_json": {
                "type": "structure",
                "children":  [
                    {
                        "type": "section",
                        "label": "Section",
                        "children": children
                    }
                ]
            }
        }
    }

    const collectionsClients = [
        {
            "type": "widget_text",
            "id": "PCF_CODE",
            "label": "Code Tiers"
        },
        {
            "type": "widget_text",
            "id": "PCF_TYPE",
            "label": "Type Tiers"
        },
        {
            "type": "widget_text",
            "id": "PCF_RS",
            "label": "Raison sociale"
        },
        {
            "type": "widget_text",
            "id": "PCF_RUE",
            "label": "Rue"
        },
        {
            "type": "widget_text",
            "id": "PCF_COMP",
            "label": "Complément rue"
        },
        {
            "type": "widget_text",
            "id": "PCF_CP",
            "label": "CP Facturation"
        },
        {
            "type": "widget_text",
            "id": "PCF_VILLE",
            "label": "Ville Facturation"
        }
    ]
    const collectionsContacts = [
        {
            "type": "widget_text",
            "id": "CCT_NUMERO",
            "label": "Code Contact Interne"
        },
        {
            "type": "widget_text",
            "id": "CCT_NOM",
            "label": "Nom"
        },
        {
            "type": "widget_text",
            "id": "CCT_TELB",
            "label": "Téléphone Bureau"
        },
        {
            "type": "widget_text",
            "id": "CCT_TELM",
            "label": "Téléphone Mobile"
        }

    ]
    const collectionsAdresses = [
        {
            "type": "widget_text",
            "id": "PCF_RUE",
            "label": "Rue"
        },
        {
            "type": "widget_text",
            "id": "PCF_COMP",
            "label": "Complément rue"
        },
        {
            "type": "widget_text",
            "id": "PCF_VILLE",
            "label": "Ville Facturation"
        },
        {
            "type": "widget_text",
            "id": "PCF_CP",
            "label": "CP Facturation"
        }
    ]

    const collections: Array<Object> = [
        {name: "ClientsTest", children: collectionsClients},
        {name: "ContactsTest", children: collectionsContacts},
        // {name: "AdressesTest", children: collectionsAdresses}
    ];

    collections.forEach(async (collection: any) => {
        baseJson.collection.name = collection.name;
        baseJson.collection.structure_json.children[0].children = collection.children;
        try{
            const response = await axios.post('https://app.kaze.so/api/collections.json', baseJson, {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data);
            collectionCreated = true;
        }
        catch(error: any){
            console.log(error);
            logger.error("Erreur lors de la création des collections " + error?.response?.data);
        }
    });

};

// Get the auth token
export const getCollectionCreated = (): boolean => {
  return collectionCreated;
};
