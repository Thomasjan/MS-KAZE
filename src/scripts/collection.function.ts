//Créer les collections nécessaires dans Kaze

import axios from 'axios';
import logger from '../logger';
import { getAuthToken, login } from '../controllers/auth.controllers';
import { collectionClients, collectionContacts } from '../data/collections';
require('dotenv').config();
// insertIntoCollection


interface ClientProps {
    PCF_CODE: string,
    PCF_TYPE: string,
    PCF_RS: string,
    PCF_RUE: string,
    PCF_COMP: string,
    PCF_CP: string,
    PCF_VILLE: string,
    XXX_KAZE: boolean,
    XXX_KZIDT: null,
    XXX_KZDT: null
};

interface ContactProps {
    CCT_NUMERO: string,
    CCT_NOM: string,
    CCT_PRENOM: string,
    CCT_TELM: string,
    CCT_EMAIL: string,
    XXX_KAZE: boolean,
    XXX_KZIDT: null,
    XXX_KZDT: null
};

export const getCollections = async () => {
    //login to get the token
    await login();

    const token = await getAuthToken();

    const response = await axios.get('https://app.kaze.so/api/collections.json', {
        headers: {
            Authorization: `${token}`
        }
    });

    return response.data;
};

export const getCollection = async (id: string) => {
    const idCollection = `${id}`.yellow;
    console.log(`getCollection(${idCollection})`.cyan)
    //login to get the token
    await login();

    const token = await getAuthToken();

    const response = await axios.get(`https://app.kaze.so/api/collections/${id}/items.json`, {
        headers: {
            Authorization: `${token}`
        }
    });

    return response.data;
};

export const createCollection = async (collection: Object) => {
    console.log("createCollection()".cyan)
    //login to get the token
    await login();

    const token = await getAuthToken();

    const response = await axios.post('https://app.kaze.so/api/collections.json', collection, {
        headers: {
            Authorization: `${token}`
        }
    });

    return response.data;
};

export const InsertIntoCollectionClients = async (collectionID: string, item: ClientProps) => {
    console.log(`InsertIntoCollectionClients(${collectionID})`.cyan)
    //login to get the token
    await login();

    const jsonClients = collectionClients.items;
    // replacce the item with the new item with matching values
    jsonClients.item.name = item.PCF_RS;
    jsonClients.item.reference = item.PCF_CODE;
    jsonClients.item.widget_data.pcf_rs.data = item.PCF_RS;
    jsonClients.item.widget_data.pcf_code.data = item.PCF_CODE;
    jsonClients.item.widget_data.pcf_type.data = item.PCF_TYPE;
    jsonClients.item.widget_data.pcf_rue.data = item.PCF_RUE;
    jsonClients.item.widget_data.pcf_comp.data = item.PCF_COMP;
    jsonClients.item.widget_data.pcf_cp.data = item.PCF_CP;
    jsonClients.item.widget_data.pcf_ville.data = item.PCF_VILLE;

    try {
        const token = await getAuthToken();

        const response = await axios.post(`https://app.kaze.so/api/collections/${collectionID}/items.json`, jsonClients, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json"
            }
        });
    
        return response.data;
    } catch (error) {
        logger.error(`Erreur lors de la création de l'item dans la collection ${collectionID}: ${error}`);
    }
   
};

export const InsertIntoCollectionContacts = async (collectionID: string, item: ContactProps) => {
    console.log(`InsertIntoCollectionContacts(${collectionID})`.cyan)
    //login to get the token
    await login();

    const jsonContacts = collectionContacts.items;
    // replacce the item with the new item with matching values

    jsonContacts.item.name = item.CCT_NOM;
    jsonContacts.item.reference = item.CCT_NUMERO;
    jsonContacts.item.widget_data.cct_numero.data = item.CCT_NUMERO;
    jsonContacts.item.widget_data.cct_nom.data = item.CCT_NOM;
    jsonContacts.item.widget_data.cct_prenom.data = item.CCT_PRENOM;
    jsonContacts.item.widget_data.cct_telm.data = item.CCT_TELM;
    jsonContacts.item.widget_data.cct_email.data = item.CCT_EMAIL;


    try {
        const token = await getAuthToken();

        const response = await axios.post(`https://app.kaze.so/api/collections/${collectionID}/items.json`, jsonContacts, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json"
            }
        });
    
        return response.data;
    } catch (error) {
        logger.error(`Erreur lors de la création de l'item dans la collection ${collectionID}: ${error}`);
    }
   
};




