class Monstore{

    constructor(){
        this.state={
            valider:'valider',
            url:'http://localhost:8080/GE/public/api/',
            enregistrer:'Enregistrer',
            modifier:'Modifier',
            annuler:'Annuler',
            supprimer:'Supprimer',
            supp:'Supp',
            modif:'Modif',
            nom:'',
            id:'',
            menu:[]
        }
    }
    setId(id){
        this.state.id=id

    }

    getId(){
        return this.state.id;

    }
    setNom(nom){
        this.state.id=nom

    }
    getNom(){
        return this.state.nom;
    }
    setMenu()
    {

    }
    getMenu(){

    }
}
export default new Monstore()