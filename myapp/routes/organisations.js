var express = require('express');
var router = express.Router();
var userModel = require('../model/organisations.js');
var db = require('../model/db.js');


/* GET organisation listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/organisationslist', function (req, res, next) {
  result=userModel.readall(function(result){
    res.render('orgasList', { title: 'Liste des organisations', orgas:result });
  });});

  router.get('/devenirRecruteur', function (req, res, next) {
    res.render('devenirRecruteur');
  });

  // Demander à rejoindre une organisation

  router.get('/joinorga', function (req, res, next) {
    result=userModel.readallvalid(function(result){
      res.render('rejoindreOrga', { title: 'Liste des organisations', orgas:result });
    });});


    router.post('/sendjoinorga', function (req, res, next) {
      const siren = req.body.siren;
    
      sql = "INSERT INTO DemandesJoin (orga, emailusers) VALUES (?, ?)";
      
      var DemandToInsert = [siren, req.session.userid];
    
      rows = db.query(sql, DemandToInsert , function (err, results) {
              if (err) throw err;
                    res.render('display', { message: 'Votre demande d\'ajout a été réalisée avec succès'});
             
          });   
      });

// Demande d'ajout d'une organsisation

  router.post('/addorga', function (req, res, next) {
    const nom = req.body.nom;
    const siren = req.body.siren;
    const type = req.body.type;
    const siege = req.body.siege;
  
    sql = "INSERT INTO Organisation (nom, siren, type, siegeSocial) VALUES (?, ?, ?, ?)";
    
    var orgaToInsert = [nom, siren, type, siege];
  
    rows = db.query(sql, orgaToInsert , function (err, results) {
            if (err) throw err;
            sql = "INSERT INTO Demandes (emailusers, orga) VALUES (?, ?)";
            rows = db.query(sql, [req.session.userid, nom] , function (err, results) {
              res.render('display', { message: 'Votre demande d\'ajout a été réalisée avec succès'});
            });
        });   
    });

    // Gestion organisations par l'admin 

    router.get('/adminorga', function (req, res, next) {
      result=userModel.readallwaitingforvalidation(function(result){
        res.render('orgasList', { title: 'Liste des organisations', orgas:result });
      });});


      router.post('/setadminorga', function (req, res, next) {
        
        if (req.body.accepter) {
          var rep = req.body.accepter.split(',');
          var siren = rep[0];
          var user = rep[1];
          sql = "UPDATE Demandes SET traitement = 1, reponse = 1 WHERE orga = ?";
          rows = db.query(sql, [siren], function (err, results) {
            if (err) throw err;
            sql = "UPDATE Users SET premierRecruteur = 1, type = 'recruteur' WHERE email = ?";
            rows = db.query(sql, [user], function (err, results) {
              result = userModel.readallwaitingforvalidation(function(result) {
                res.render('orgasList', { title: 'Liste des organisations', orgas: result });
              });
            });
          });
        }
        

        if (req.body.rejeter) {
          var rep = req.body.rejeter.split(',');
          var siren = rep[0];
          var user = rep[1];          
          sql = "UPDATE Demandes SET traitement = 1, reponse = 0 WHERE orga = ?";
          rows = db.query(sql, [siren] , function (err, results) {
                  if (err) throw err;
                  sql = "DELETE FROM 'Organisation' WHERE 'orga' = '?'";
                  rows = db.query(sql, [siren] , function (err, results) {
                    result=userModel.readallwaitingforvalidation(function(result){
                      res.render('orgasList', { title: 'Liste des organisations', orgas:result });                  
                    });
              });   
           });
        }
       
        });

// Gestion recruteur par le premier recruteur


        router.get('/recruteurorga', function (req, res, next) {
          result=userModel.readalluserswaitingforvalidation(req,function(result){
            res.render('demandesJoin', { title: 'Liste des utilisateurs demandant à rejoindre votre organisation', demandes:result });
          });});


          router.post('/setrecruteurorga', function (req, res, next) {
            var req = req;
          
            if (req.body.accepter) {
              var rep = req.body.accepter.split(',');
              var siren = rep[0];
              var user = rep[1];
              sql = "UPDATE DemandesJoin SET traitement = 1, reponse = 1 WHERE emailusers = ? AND orga = ?";
              rows = db.query(sql, [user, siren], function (err, results) {
                if (err) {
                  console.error("Error updating DemandesJoin table:", err);
                  throw err; // Rethrow the error
                }
                sql = "UPDATE Users SET type = 'recruteur' WHERE email = ?";
                rows = db.query(sql, [user], function (err, results) {
                  if (err) {
                    console.error("Error updating Users table:", err);
                    throw err; // Rethrow the error
                  }
                  results = userModel.readalluserswaitingforvalidation(req, function (result) {
                    res.render('demandesJoin', { title: 'Liste des utilisateurs demandant à rejoindre votre organisation', demandes: result });
                  });
                });
              });
            }
          
            if (req.body.rejeter) {
              var rep = req.body.rejeter.split(',');
              var siren = rep[0];
              var user = rep[1];
              sql = "UPDATE DemandesJoin SET traitement = 1, reponse = 0 WHERE emailusers = ? AND orga = ?";
              rows = db.query(sql, [user, siren], function (err, results) {
                if (err) {
                  console.error("Error updating DemandesJoin table:", err);
                  throw err; // Rethrow the error
                }
                results = userModel.readalluserswaitingforvalidation(req, function (result) {
                  res.render('demandesJoin', { title: 'Liste des utilisateurs demandant à rejoindre votre organisation', demandes: result });
                });
              });
            }
          });
          

  module.exports = router;
