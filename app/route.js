import express from 'express'

import partyController from './DS/controllers/party' ;
import officeController from './DS/controllers/office' ;

const router = express.Router();

// party routes
router.post('/parties', partyController.createParty);
router.get('/parties', partyController.getAllParties);
router.get('/parties/:id', partyController.getParty);
router.delete('/parties/:id', partyController.deleteParty);
router.patch('/parties/:id/name', partyController.editPartyName);


// office routes

router.post('/offices', officeController.createOffice);
router.get('/offices', officeController.getAllOffices);
router.get('/offices/:id', officeController.getOffice);

export default router;