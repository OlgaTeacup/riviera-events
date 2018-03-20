import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const events = [
    { 
        "name": "Carnaval de Nice",
        "id": "carnaval-de-nice",
        "date": "17 fevrier 2018", 
        "imageUrl": "assets/carnaval-de-nice.jpg",  
        "snippet": "Le carnaval de Nice est le 1er carnaval de France et l'un des plus célèbres du monde. Il se déroule chaque hiver, au mois de février, et est l'une des fêtes les plus prisées de la Côte d'Azur, attirant chaque année plusieurs centaines de milliers de spectateurs.",
        "webUrl": "http://www.nicecarnaval.com/le-carnaval"
    },
    { 
        "name": "Fête du Citron",
        "id": "fete-du-citron",
        "date": "17 fevrier 2018", 
        "imageUrl": "assets/fete-du-citron.jpg",  
        "snippet": "Bollywood. Un nom pour rêver et faire rêver à Menton en 2018.  Un nom et un thème qui permettra de réaliser des motifs monumentaux, des parterres de fleurs colorés, un bestiaire fabuleux grâce à la mythologie indienne, des danses et des chants, mais aussi de nouvelles attractions !",
        "webUrl": "https://www.fete-du-citron.com/"
    },
        { 
        "name": "Fête des Roses et des Plantes",
        "id": "fete-des-roses-et-des-plantes",
        "date": "5 mai 2018", 
        "imageUrl": "assets/fete-des-roses-et-des-plantes.jpg",  
        "snippet": "Vous êtes invités à déambuler au milieu d’une variété de roses grimpantes ou couvre-sols, anciennes ou modernes. Aux côtés des rosiéristes et de leurs stands colorés, d’autres professionnels sont invités à prendre place dans les allées du jardin à la française pour présenter des plantes rares, leurs fleurs exotiques ou méditerranéennes.",
        "webUrl": "http://www.villa-ephrussi.com/fr/fete-roses-et-plantes-0"
    },
    { 
        "name": "Fête des Mais",
        "id": "fete-des-mais",
        "date": "1 mai 2018", 
        "imageUrl": "assets/fete-des-mais.jpg",  
        "snippet": "Mardi 1er mai 2018 à Cagnes-sur-mer, la \"Fête des Mais\" vous propose ses animations et spectacles pour petits et grands, musiques et folklore dans les ruelles médiévales du Haut-de-Cagnes.",
        "webUrl": "http://www.recreanice.fr/sortie-famille-fete-des-mais-1er-mai-cagnes-mer"
    },
        { 
        "name": "Fête de l'oranger",
        "id": "fete-de-loranger",
        "date": "2 avril 2018", 
        "imageUrl": "assets/fete-de-loranger.jpg",  
        "snippet": "On célèbre chaque lundi de Pâques les orangers dont les fleurs ont longtemps servi à fabriquer des parfums. Créée il y a 24 ans, la Fête de l’Oranger met à l’honneur les traditions baroises et le savoir faire des artistes.",
        "webUrl": "http://lebarsurloup.fr/fete-de-lorange/"
    },
    ];
    return {events};
  }
}
