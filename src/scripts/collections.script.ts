import logger, { logTimeToHistory } from "../logger";
import { fetchAllContacts, fetchAllTiers, login, updateContact, updateTiers } from "./api.functions";
import moment from "moment";
import { InsertIntoCollectionClients, InsertIntoCollectionContacts, createCollection, getCollection, getCollections } from "./collection.function";
import { fieldsCollectionClients, fieldsCollectionContacts } from "../data/collections";
import { formatedDate } from "../utils/functions";
moment.locale('fr');


//TODO: change ClientsCollection to Clients
//TODO: change ContactsCollection to Contacts 

const main = async () => {
    console.log('[collectionsScript] main()'.red.underline);
    // logTimeToHistory(`[collectionsScript] Début de l'exécution du script le: ${moment().format()}`)
    
    const requiredCollections = [
        "ClientsCollection",
        "ContactsCollection",
    ];
    //getCollections
    const collections = await getCollections()
    const collectionsNames = collections.data.map((collection) => collection.name);

    //check if requiredCollections are present

    requiredCollections.forEach((collection) => {
        const name = collection.red
        if(!collectionsNames.includes(collection)){
            console.log(`La collection ${name} n'existe pas`);
            //create it
            if(collection === "ClientsCollection"){
                createCollection(fieldsCollectionClients)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    logger.error(`Erreur lors de la création de la collection ${collection}: ${error}`);
                });
            }
            if(collection === "ContactsCollection"){
                createCollection(fieldsCollectionContacts)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    logger.error(`Erreur lors de la création de la collection ${collection}: ${error}`);
                });
            }
        }
    });

    const newCollections = await getCollections();

    //getTiers && getContacts (All)
    const tiers = await fetchAllTiers();
    const contacts = await fetchAllContacts();
    
    //getCollectionClients && getCollectionsContacts
    const collectionClientsID = newCollections.data.find((collection) => collection.name === "ClientsCollection").id;
    const collectionClients = await getCollection(collectionClientsID);

    const collectionContactsID = newCollections.data.find((collection) => collection.name === "ContactsCollection").id;
    const collectionContacts = await getCollection(collectionContactsID);

    //create new Tiers and new Contacts
    if(tiers?.clients?.length){
        tiers.clients.forEach(async (client) => {
            //check if client exists in collectionClients
            const clientExists = collectionClients.data.find((item) => item.id === client.XXX_KZIDT);
            if(!clientExists){
                //create client
                console.log(`Création du client ${client.PCF_RS}`);
                const response = await InsertIntoCollectionClients(collectionClientsID, client)
                await updateTiers(client.PCF_CODE , {XXX_KZIDT: response.id, XXX_KZDT: formatedDate(new Date())})
            }
        });
    }

    if(contacts?.utilisateurs?.length){
        contacts.utilisateurs.forEach(async (contact) => {
            //check if contact exists in collectionContacts
            const contactExists = collectionContacts.data.find((item) => item.id === contact.XXX_KZIDCT);
            if(!contactExists){
                //create contact
                console.log(`Création du contact ${contact.CCT_NOM}`);
                const response =  await InsertIntoCollectionContacts(collectionContactsID, contact)
                await updateContact(contact.CCT_NUMERO , {XXX_KZIDCT: response.id, XXX_KZDT: formatedDate(new Date())})
            }
        });
    }
};



//lauch main
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
    logger.error(`Erreur du lancement du script: ${error}`);
});
