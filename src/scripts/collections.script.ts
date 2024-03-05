import logger from "../logger";
import { login } from "./api.functions";




const main = async () => {
    //createCollections();
    //getTiers && getContacts (All)

    //getCollectionTiers && getCollectionsContacts

    //create new Tiers and new Contacts
};




//lauch main
login().then(() => {
    main();
})
.catch((error) => {
    console.log(error);
    logger.error(`Erreur du lancement du script: ${error}`);
});
