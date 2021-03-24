class Attaque{
  constructor(){
    this.multiNode = new MultiNode();
    this.multiNode.confirmerConnexion = () => this.confirmerConnexion();
    this.multiNode.confirmerAuthentification = (autresParticipants) => this.confirmerAuthentification(autresParticipants);
    this.multiNode.apprendreAuthentification = (pseudonyme) => this.apprendreAuthentification(pseudonyme);
    this.multiNode.recevoirVariable = (variable) => this.recevoirVariable(variable);
    this.listeJoueur = {};
    this.activePlayer ="";
    this.nbrtour = 1;
    this.pseudonymeJoueur = "";
    this.encore = false;
    this.conteur = 0;
    this.pseudonymeAutreJoueur = "";
    this.formulaireAuthentification = document.getElementById("formulaire-authentification");
    this.formulaireAuthentification.addEventListener("submit", (evenementsubmit) => this.soumettreAuthentificationJoueur(evenementsubmit))
    this.champPseudonyme = document.getElementById("champ-pseudonyme");
    this.boutonAuthentification = document.getElementById("bouton-authentification");
    this.boutondespl1 = document.getElementById("bouton-attaquer");
    this.boutondespl2 = document.getElementById("bouton-attaquer-pl2");
    this.formulaireJeu = document.getElementById("formulaire-jeu");
    this.formulaireJeu.addEventListener("submit", (evenementsubmit) => this.soumettreAttaque(evenementsubmit))
    this.formulaireJeu.style.display = "none";
    this.champPointDeVie = document.getElementById("champ-point-de-vie");
    this.champAttaque = document.getElementById("champ-attaque");
    this.informationAutreJoueur = document.getElementById("information-autre-joueur");
    this.informationJoueur = document.getElementById("information-joueur");
    this.champPointDeVieAutreJoueur = document.getElementById("champ-point-de-vie-autre-joueur");
    this.champnbrtour = document.getElementById("nbr-tour");
  }

  confirmerConnexion(){
    console.log("Je suis connecté.");
    //Le serveur nous confirme que nous sommes bien connecté, nous pouvons faire une demande d'authentification
    this.pseudonymeJoueur = this.champPseudonyme.value;
    this.multiNode.demanderAuthentification(this.pseudonymeJoueur);
  }

  confirmerAuthentification(autresParticipants){
    console.log("Je suis authentifié.");
    console.log("Les autres participants sont " + JSON.stringify(autresParticipants));
    this.formulaireAuthentification.querySelector("fieldset").disabled = true;
    this.ajouterJoueur(this.pseudonymeJoueur);
    if(autresParticipants.length > 0){
      this.pseudonymeAutreJoueur = autresParticipants[0];
      this.ajouterJoueur(autresParticipants[0]);
      this.afficherPartie();
    }
  }
  apprendreAuthentification(pseudonyme){
    console.log("Nouvel ami " + pseudonyme);
    this.ajouterJoueur(pseudonyme);
    this.pseudonymeAutreJoueur = pseudonyme;
    this.quiquiplayenpremier();
    this.afficherPartie();
  }
  ajouterJoueur(pseudonyme){
    console.log("ajouterJoueur : " + pseudonyme);
    this.listeJoueur[pseudonyme] = {pointDeVie : Attaque.NOMBRE_POINT_DE_VIE};
  }

quiquiplayenpremier(){
  let despl1 =  Math.floor(Math.random() * 6) + 1; 
  let despl2 =  Math.floor(Math.random() * 6) + 1; 
  if (despl1 >= despl2) {
    this.activePlayer = this.pseudonymeJoueur;
    console.log(this.pseudonymeJoueur);
  }
  else if (despl2 >= despl1) {
    this.activePlayer = this.pseudonymeAutreJoueur;
    console.log(this.pseudonymeAutreJoueur);
  }
  else{
    console.log("GG");
  }
}

changerplayeractif(){
  if (this.activePlayer == this.pseudonymeJoueur) {
    this.activePlayer = this.pseudonymeAutreJoueur;
    console.log(this.activePlayer);
  }else{
    this.activePlayer = this.pseudonymeJoueur;
    console.log(this.activePlayer);
  }
}


recevoirVariable(variable){
  console.log("Surcharge de recevoirVariable " + variable.cle + " = " + variable.valeur);
  let message = JSON.parse(variable.valeur);
  if(message.pseudonyme == this.pseudonymeJoueur){
    switch (variable.cle) {
      case Attaque.MESSAGE.POINT_DE_VIE:
        this.changerPointdeVieJoueur(message.valeur);
      break;
    }
  }else{
    switch (variable.cle) {
      case Attaque.MESSAGE.ATTAQUE:
        this.subirAttaque(message.valeur);
      break;
      case Attaque.MESSAGE.POINT_DE_VIE:
        this.changerPointdeVieAutreJoueur(message.valeur);
      break;
    }
  }
  }

  soumettreAuthentificationJoueur(evenementsubmit){
    console.log("soumettreAuthentificationJoueur");
    evenementsubmit.preventDefault();
    //La demande de connexion au serveur est asynchrone, il faut attendre la réponse du serveur
    //pour faire une demande d'authentification
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;
  }

  afficherPartie(){
    this.informationAutreJoueur.innerHTML =
      this.informationAutreJoueur.innerHTML.replace("{nom-autre-joueur}", this.pseudonymeAutreJoueur);
      this.informationJoueur.innerHTML.replace("{nom-joueur}", this.pseudonymeJoueur);
    this.champPointDeVieAutreJoueur.value = this.listeJoueur[this.pseudonymeAutreJoueur].pointDeVie;
    this.champPointDeVie.value = this.listeJoueur[this.pseudonymeJoueur].pointDeVie;
      this.formulaireJeu.style.display = "block";
    if (this.activePlayer == this.pseudonymeJoueur) {
      this.boutondespl1.disabled = true;
      this.boutondespl2.disabled = false;
    }else{
      this.boutondespl1.disabled = false;
      this.boutondespl2.disabled =true;
    }
  }

  genererForceAttaque(){
    let des1 = Math.floor(Math.random() * 6) + 1; 
    let des2 = Math.floor(Math.random() * 6) + 1;
    if (des1 == des2) {
      console.log("Super power activated");
      this.encore = true;
    }
    return des1+des2;
  }

  soumettreAttaque(evenementsubmit){
    console.log("soumettreAttaque");
    evenementsubmit.preventDefault();
    let forceAttaque = this.genererForceAttaque();
    console.log(forceAttaque);
    this.champAttaque.value = forceAttaque;
    let message = {
      pseudonyme : this.pseudonymeJoueur,
      valeur : forceAttaque
    };
    this.multiNode.posterVariableTextuelle(Attaque.MESSAGE.ATTAQUE, JSON.stringify(message));
  }

  subirAttaque(valeur){
    console.log("subirAttaque()=>valeur" + valeur);
    let message = {
      pseudonyme : this.pseudonymeJoueur,
      valeur : this.listeJoueur[this.pseudonymeJoueur].pointDeVie + valeur
    };
    this.multiNode.posterVariableTextuelle(Attaque.MESSAGE.POINT_DE_VIE, JSON.stringify(message));
  }

  changerPointdeVieJoueur(nouveauPointDeVie){
    console.log("changerPointdeVieJoueur()=>valeur" + nouveauPointDeVie);
    this.listeJoueur[this.pseudonymeJoueur].pointDeVie = nouveauPointDeVie;
    this.champPointDeVie.value = nouveauPointDeVie;
    this.validerFinPartie();
    this.afficherPartie();
  }

  changerPointdeVieAutreJoueur(nouveauPointDeVie){
    console.log("changerPointdeVieAutreJoueur()=>valeur" + nouveauPointDeVie);
    this.listeJoueur[this.pseudonymeAutreJoueur].pointDeVie = nouveauPointDeVie;
    this.champPointDeVieAutreJoueur.value = nouveauPointDeVie;
    this.validerFinPartie();
    this.afficherPartie();
  }

  validerFinPartie(){
    console.log("validerFinPartie");
    if(this.listeJoueur[this.pseudonymeAutreJoueur].pointDeVie >= 60){
      alert("Vous avez gagné!");
    }else if(this.listeJoueur[this.pseudonymeJoueur].pointDeVie >= 60){
      alert("Vous avez perdu!");
    }
    else if(this.encore == true){
      console.log(this.activePlayer + "a droit a un second tour");
      this.conteur++;
      this.nbrtour++;
      if (this.conteur == 2) {
        this.conteur = 0;
        this.changerplayeractif();
      }
    }else{
      this.nbrtour++;
      this.changerplayeractif();
    }
  }

}

Attaque.NOMBRE_JOUEUR_REQUIS = 2;
Attaque.NOMBRE_POINT_DE_VIE = 0;
Attaque.MESSAGE = {
    ATTAQUE : "ATTAQUE",
    POINT_DE_VIE : "POINT_DE_VIE"
};

new Attaque();