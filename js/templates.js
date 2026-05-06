// Templates de phrases
// tense   : temps grammatical requis pour cette phrase
// pre/post : texte avant/après le verbe conjugué
// pronoun  : pronom (yo/tú/él/nosotros/vosotros/ellos)
// verb     : infinitif (doit exister dans V)
// tr / trEn / trPt : traductions
// variants : surcharges optionnelles par temps, sans dupliquer la phrase entière

const T = [

  // ─── PRESENTE ────────────────────────────────────────────────────────────

  {tense:"presente",pre:"Cada mañana, yo",post:"un café con leche.",pronoun:"yo",verb:"tomar",tr:"Chaque matin, je prends un café au lait.",trEn:"Every morning, I have a coffee with milk.",trPt:"Todas as manhãs, eu tomo um café com leite."},
  {tense:"presente",pre:"Tú siempre",post:"la música muy alta.",pronoun:"tú",verb:"escuchar",tr:"Tu écoutes toujours la musique très fort.",trEn:"You always listen to music very loudly.",trPt:"Tu ouves sempre a música muito alta."},
  {tense:"presente",pre:"Mi madre",post:"muy bien la paella.",pronoun:"él",verb:"cocinar",tr:"Ma mère cuisine très bien la paella.",trEn:"My mother cooks paella very well.",trPt:"A minha mãe cozinha muito bem a paella."},
  {tense:"presente",pre:"Nosotros",post:"la casa los sábados por la mañana.",pronoun:"nosotros",verb:"limpiar",tr:"Nous nettoyons la maison le samedi matin.",trEn:"We clean the house on Saturday mornings.",trPt:"Nós limpamos a casa aos sábados de manhã."},
  {tense:"presente",pre:"Vosotros siempre",post:"tarde a las reuniones.",pronoun:"vosotros",verb:"llegar",tr:"Vous arrivez toujours en retard aux réunions.",trEn:"You always arrive late to meetings.",trPt:"Vocês chegam sempre atrasados às reuniões."},
  {tense:"presente",pre:"Ellos",post:"en una empresa de tecnología.",pronoun:"ellos",verb:"trabajar",tr:"Ils travaillent dans une entreprise technologique.",trEn:"They work at a technology company.",trPt:"Eles trabalham numa empresa de tecnologia."},
  {tense:"presente",pre:"Ella",post:"las flores del jardín cada semana.",pronoun:"él",verb:"regar",tr:"Elle arrose les fleurs du jardin chaque semaine.",trEn:"She waters the garden flowers every week.",trPt:"Ela rega as flores do jardim todas as semanas."},
  {tense:"presente",pre:"Yo",post:"las llaves en el bolso.",pronoun:"yo",verb:"buscar",tr:"Je cherche les clés dans le sac.",trEn:"I look for the keys in the bag.",trPt:"Eu procuro as chaves na mala."},
  {tense:"presente",pre:"Tú",post:"demasiado tiempo en el móvil.",pronoun:"tú",verb:"pasar",tr:"Tu passes trop de temps sur le téléphone.",trEn:"You spend too much time on your phone.",trPt:"Tu passas demasiado tempo no telemóvel."},
  {tense:"presente",pre:"El perro",post:"mucho cuando tiene hambre.",pronoun:"él",verb:"comer",tr:"Le chien mange beaucoup quand il a faim.",trEn:"The dog eats a lot when it is hungry.",trPt:"O cão come muito quando tem fome."},
  {tense:"presente",pre:"Nosotros",post:"a nuestros amigos el fin de semana.",pronoun:"nosotros",verb:"visitar",tr:"Nous rendons visite à nos amis le week-end.",trEn:"We visit our friends on the weekend.",trPt:"Nós visitamos os nossos amigos ao fim de semana."},
  {tense:"presente",pre:"Vosotros",post:"una receta nueva cada domingo.",pronoun:"vosotros",verb:"preparar",tr:"Vous préparez une nouvelle recette chaque dimanche.",trEn:"You prepare a new recipe every Sunday.",trPt:"Vocês preparam uma receita nova todos os domingos."},
  {tense:"presente",pre:"Mi hermano",post:"muy tarde los fines de semana.",pronoun:"él",verb:"descansar",tr:"Mon frère se repose très tard le week-end.",trEn:"My brother rests very late on weekends.",trPt:"O meu irmão descansa muito tarde aos fins de semana."},
  {tense:"presente",pre:"Yo no",post:"nunca mi contraseña.",pronoun:"yo",verb:"olvidar",tr:"Je n'oublie jamais mon mot de passe.",trEn:"I never forget my password.",trPt:"Eu nunca me esqueço da minha senha."},
  {tense:"presente",pre:"Ellas",post:"mucho dinero en ropa.",pronoun:"ellos",verb:"gastar",tr:"Elles dépensent beaucoup d'argent en vêtements.",trEn:"They spend a lot of money on clothes.",trPt:"Elas gastam muito dinheiro em roupa."},
  {tense:"presente",pre:"Mi hermano",post:"en Barcelona desde hace tres años.",pronoun:"él",verb:"vivir",tr:"Mon frère vit à Barcelone depuis trois ans.",trEn:"My brother has been living in Barcelona for three years.",trPt:"O meu irmão vive em Barcelona há três anos."},
  {tense:"presente",pre:"Tú",post:"a tu hermana con los deberes.",pronoun:"tú",verb:"ayudar",tr:"Tu aides ta sœur avec les devoirs.",trEn:"You help your sister with her homework.",trPt:"Tu ajudas a tua irmã com os trabalhos de casa."},
  {tense:"presente",pre:"Ellos",post:"una casa nueva en las afueras.",pronoun:"ellos",verb:"construir",tr:"Ils construisent une nouvelle maison en banlieue.",trEn:"They are building a new house in the suburbs.",trPt:"Eles constroem uma casa nova nos arredores."},
  {tense:"presente",pre:"Nosotros",post:"a los abuelos en Navidad.",pronoun:"nosotros",verb:"visitar",tr:"Nous rendons visite aux grands-parents à Noël.",trEn:"We visit our grandparents at Christmas.",trPt:"Nós visitamos os avós no Natal."},
  {tense:"presente",pre:"Vosotros",post:"la tele juntos por las noches.",pronoun:"vosotros",verb:"ver",tr:"Vous regardez la télé ensemble le soir.",trEn:"You watch TV together in the evenings.",trPt:"Vocês veem televisão juntos à noite."},
  {tense:"presente",pre:"Ella",post:"a sus hijos al colegio.",pronoun:"él",verb:"llevar",tr:"Elle emmène ses enfants à l'école.",trEn:"She takes her children to school.",trPt:"Ela leva os filhos à escola."},
  {tense:"presente",pre:"Mi padre",post:"siempre la verdad.",pronoun:"él",verb:"decir",tr:"Mon père dit toujours la vérité.",trEn:"My father always tells the truth.",trPt:"O meu pai diz sempre a verdade."},
  {tense:"presente",pre:"Yo",post:"a mi abuela todos los domingos.",pronoun:"yo",verb:"llamar",tr:"J'appelle ma grand-mère tous les dimanches.",trEn:"I call my grandmother every Sunday.",trPt:"Eu ligo para a minha avó todos os domingos."},
  {tense:"presente",pre:"Yo",post:"al trabajo en bicicleta.",pronoun:"yo",verb:"ir",tr:"Je vais au travail à vélo.",trEn:"I go to work by bike.",trPt:"Eu vou para o trabalho de bicicleta."},
  {tense:"presente",pre:"Ellos",post:"a París el próximo verano.",pronoun:"ellos",verb:"viajar",tr:"Ils voyagent à Paris l'été prochain.",trEn:"They are travelling to Paris next summer.",trPt:"Eles viajam para Paris no próximo verão."},
  {tense:"presente",pre:"El avión",post:"a las tres de la tarde.",pronoun:"él",verb:"salir",tr:"L'avion part à trois heures de l'après-midi.",trEn:"The plane leaves at three in the afternoon.",trPt:"O avião parte às três da tarde."},
  {tense:"presente",pre:"Tú",post:"demasiado rápido en la autopista.",pronoun:"tú",verb:"conducir",tr:"Tu conduis trop vite sur l'autoroute.",trEn:"You drive too fast on the motorway.",trPt:"Tu conduzes demasiado rápido na autoestrada."},
  {tense:"presente",pre:"Nosotros",post:"las maletas la noche anterior.",pronoun:"nosotros",verb:"preparar",tr:"Nous préparons les valises la veille au soir.",trEn:"We pack our bags the night before.",trPt:"Nós preparamos as malas na noite anterior."},
  {tense:"presente",pre:"Ella",post:"el billete por internet.",pronoun:"él",verb:"comprar",tr:"Elle achète le billet sur Internet.",trEn:"She buys the ticket online.",trPt:"Ela compra o bilhete pela internet."},
  {tense:"presente",pre:"Vosotros",post:"el camino en el mapa.",pronoun:"vosotros",verb:"buscar",tr:"Vous cherchez le chemin sur la carte.",trEn:"You look for the route on the map.",trPt:"Vocês procuram o caminho no mapa."},
  {tense:"presente",pre:"El tren",post:"a las ocho en punto.",pronoun:"él",verb:"llegar",tr:"Le train arrive à huit heures pile.",trEn:"The train arrives at eight o'clock sharp.",trPt:"O comboio chega às oito em ponto."},
  {tense:"presente",pre:"Yo",post:"mi ciudad natal con cariño.",pronoun:"yo",verb:"recordar",tr:"Je me souviens de ma ville natale avec affection.",trEn:"I remember my hometown with fondness.",trPt:"Eu lembro a minha cidade natal com carinho."},
  {tense:"presente",pre:"Nosotros",post:"en ese restaurante italiano los viernes.",pronoun:"nosotros",verb:"comer",tr:"Nous mangeons dans ce restaurant italien le vendredi.",trEn:"We eat at that Italian restaurant on Fridays.",trPt:"Nós comemos naquele restaurante italiano às sextas-feiras."},
  {tense:"presente",pre:"Yo",post:"agua con gas, por favor.",pronoun:"yo",verb:"querer",tr:"Je veux de l'eau gazeuse, s'il vous plaît.",trEn:"I want sparkling water, please.",trPt:"Eu quero água com gás, por favor."},
  {tense:"presente",pre:"Tú siempre",post:"demasiado azúcar en el café.",pronoun:"tú",verb:"poner",tr:"Tu mets toujours trop de sucre dans le café.",trEn:"You always put too much sugar in your coffee.",trPt:"Tu pões sempre demasiado açúcar no café."},
  {tense:"presente",pre:"Ellos",post:"vino tinto con la carne.",pronoun:"ellos",verb:"beber",tr:"Ils boivent du vin rouge avec la viande.",trEn:"They drink red wine with the meat.",trPt:"Eles bebem vinho tinto com a carne."},
  {tense:"presente",pre:"Ella",post:"una receta nueva cada semana.",pronoun:"él",verb:"probar",tr:"Elle essaie une nouvelle recette chaque semaine.",trEn:"She tries a new recipe every week.",trPt:"Ela experimenta uma receita nova todas as semanas."},
  {tense:"presente",pre:"Vosotros",post:"la cuenta al camarero.",pronoun:"vosotros",verb:"pedir",tr:"Vous demandez l'addition au serveur.",trEn:"You ask the waiter for the bill.",trPt:"Vocês pedem a conta ao empregado."},
  {tense:"presente",pre:"Ese plato",post:"demasiado picante para mí.",pronoun:"él",verb:"ser",tr:"Ce plat est trop épicé pour moi.",trEn:"That dish is too spicy for me.",trPt:"Esse prato é demasiado picante para mim."},
  {tense:"presente",pre:"El chef",post:"los ingredientes frescos cada día.",pronoun:"él",verb:"comprar",tr:"Le chef achète les ingrédients frais chaque jour.",trEn:"The chef buys fresh ingredients every day.",trPt:"O chef compra os ingredientes frescos todos os dias."},
  {tense:"presente",pre:"Yo",post:"la sopa porque está muy fría.",pronoun:"yo",verb:"calentar",tr:"Je chauffe la soupe car elle est trop froide.",trEn:"I heat up the soup because it is too cold.",trPt:"Eu aqueço a sopa porque está muito fria."},
  {tense:"presente",pre:"Los estudiantes",post:"un examen muy difícil mañana.",pronoun:"ellos",verb:"tener",tr:"Les étudiants ont un examen très difficile demain.",trEn:"The students have a very difficult exam tomorrow.",trPt:"Os estudantes têm um exame muito difícil amanhã."},
  {tense:"presente",pre:"Yo",post:"mis apuntes antes del examen.",pronoun:"yo",verb:"leer",tr:"Je lis mes notes avant l'examen.",trEn:"I read my notes before the exam.",trPt:"Eu leio os meus apontamentos antes do exame."},
  {tense:"presente",pre:"Tú",post:"muy rápido en el ordenador.",pronoun:"tú",verb:"escribir",tr:"Tu écris très vite sur l'ordinateur.",trEn:"You type very fast on the computer.",trPt:"Tu escreves muito rápido no computador."},
  {tense:"presente",pre:"El jefe",post:"una reunión importante para mañana.",pronoun:"él",verb:"tener",tr:"Le patron a une réunion importante pour demain.",trEn:"The boss has an important meeting tomorrow.",trPt:"O chefe tem uma reunião importante para amanhã."},
  {tense:"presente",pre:"Nosotros",post:"el informe antes del viernes.",pronoun:"nosotros",verb:"terminar",tr:"Nous finissons le rapport avant vendredi.",trEn:"We finish the report before Friday.",trPt:"Nós terminamos o relatório antes de sexta-feira."},
  {tense:"presente",pre:"Vosotros",post:"la respuesta correcta.",pronoun:"vosotros",verb:"saber",tr:"Vous savez la bonne réponse.",trEn:"You know the correct answer.",trPt:"Vocês sabem a resposta correta."},
  {tense:"presente",pre:"Ella",post:"inglés y francés perfectamente.",pronoun:"él",verb:"hablar",tr:"Elle parle anglais et français parfaitement.",trEn:"She speaks English and French perfectly.",trPt:"Ela fala inglês e francês perfeitamente."},
  {tense:"presente",pre:"Los profesores",post:"los ejercicios a sus alumnos.",pronoun:"ellos",verb:"explicar",tr:"Les professeurs expliquent les exercices à leurs élèves.",trEn:"The teachers explain the exercises to their students.",trPt:"Os professores explicam os exercícios aos alunos."},
  {tense:"presente",pre:"Yo",post:"español desde hace dos años.",pronoun:"yo",verb:"estudiar",tr:"J'étudie l'espagnol depuis deux ans.",trEn:"I have been studying Spanish for two years.",trPt:"Eu estudo espanhol há dois anos."},
  {tense:"presente",pre:"Tú",post:"mucho talento para el dibujo.",pronoun:"tú",verb:"tener",tr:"Tu as beaucoup de talent pour le dessin.",trEn:"You have a lot of talent for drawing.",trPt:"Tu tens muito talento para o desenho."},
  {tense:"presente",pre:"Mi empresa",post:"productos de alta calidad.",pronoun:"él",verb:"producir",tr:"Mon entreprise produit des produits de haute qualité.",trEn:"My company produces high-quality products.",trPt:"A minha empresa produz produtos de alta qualidade."},
  {tense:"presente",pre:"Yo",post:"muy cansado después del trabajo.",pronoun:"yo",verb:"estar",tr:"Je suis très fatigué après le travail.",trEn:"I am very tired after work.",trPt:"Eu estou muito cansado depois do trabalho."},
  {tense:"presente",pre:"Ella",post:"muy feliz con su nuevo trabajo.",pronoun:"él",verb:"estar",tr:"Elle est très heureuse avec son nouveau travail.",trEn:"She is very happy with her new job.",trPt:"Ela está muito feliz com o novo emprego."},
  {tense:"presente",pre:"Nosotros",post:"muchas ganas de verte.",pronoun:"nosotros",verb:"tener",tr:"Nous avons très envie de te voir.",trEn:"We really look forward to seeing you.",trPt:"Nós temos muita vontade de te ver."},
  {tense:"presente",pre:"Ellos",post:"mucho cuando están juntos.",pronoun:"ellos",verb:"reír",tr:"Ils rient beaucoup quand ils sont ensemble.",trEn:"They laugh a lot when they are together.",trPt:"Eles riem muito quando estão juntos."},
  {tense:"presente",pre:"Yo",post:"que este proyecto va a funcionar.",pronoun:"yo",verb:"creer",tr:"Je crois que ce projet va fonctionner.",trEn:"I believe this project is going to work.",trPt:"Eu acredito que este projeto vai funcionar."},
  {tense:"presente",pre:"Tú",post:"mucho a tu familia.",pronoun:"tú",verb:"querer",tr:"Tu aimes beaucoup ta famille.",trEn:"You love your family very much.",trPt:"Tu amas muito a tua família."},
  {tense:"presente",pre:"Ella",post:"mucho cuando recibe malas noticias.",pronoun:"él",verb:"sentir",tr:"Elle ressent beaucoup quand elle reçoit de mauvaises nouvelles.",trEn:"She feels a lot when she receives bad news.",trPt:"Ela sente muito quando recebe más notícias."},
  {tense:"presente",pre:"Yo",post:"un poco nervioso antes de la presentación.",pronoun:"yo",verb:"estar",tr:"Je suis un peu nerveux avant la présentation.",trEn:"I am a little nervous before the presentation.",trPt:"Eu estou um pouco nervoso antes da apresentação."},
  {tense:"presente",pre:"Vosotros",post:"muy bien en este momento.",pronoun:"vosotros",verb:"estar",tr:"Vous allez bien en ce moment.",trEn:"You are doing very well right now.",trPt:"Vocês estão muito bem neste momento."},
  {tense:"presente",pre:"Yo",post:"en el mar todos los veranos.",pronoun:"yo",verb:"nadar",tr:"Je nage dans la mer tous les étés.",trEn:"I swim in the sea every summer.",trPt:"Eu nado no mar todos os verões."},
  {tense:"presente",pre:"Ellos",post:"al fútbol en el parque.",pronoun:"ellos",verb:"jugar",tr:"Ils jouent au football dans le parc.",trEn:"They play football in the park.",trPt:"Eles jogam futebol no parque."},
  {tense:"presente",pre:"Tú",post:"muy bien al tenis.",pronoun:"tú",verb:"jugar",tr:"Tu joues très bien au tennis.",trEn:"You play tennis very well.",trPt:"Tu jogas ténis muito bem."},
  {tense:"presente",pre:"Nosotros",post:"por el bosque los domingos.",pronoun:"nosotros",verb:"correr",tr:"Nous courons dans la forêt le dimanche.",trEn:"We run through the forest on Sundays.",trPt:"Nós corremos pela floresta aos domingos."},
  {tense:"presente",pre:"El pájaro",post:"hacia el sur en invierno.",pronoun:"él",verb:"volar",tr:"L'oiseau vole vers le sud en hiver.",trEn:"The bird flies south in winter.",trPt:"O pássaro voa para o sul no inverno."},
  {tense:"presente",pre:"Ella",post:"la música de los pájaros por la mañana.",pronoun:"él",verb:"oír",tr:"Elle entend le chant des oiseaux le matin.",trEn:"She hears the birds singing in the morning.",trPt:"Ela ouve o canto dos pássaros de manhã."},
  {tense:"presente",pre:"Yo",post:"muy tarde esta noche.",pronoun:"yo",verb:"volver",tr:"Je rentre très tard ce soir.",trEn:"I am coming back very late tonight.",trPt:"Eu volto muito tarde esta noite."},
  {tense:"presente",pre:"El equipo",post:"mucho esta temporada.",pronoun:"él",verb:"ganar",tr:"L'équipe gagne beaucoup cette saison.",trEn:"The team wins a lot this season.",trPt:"A equipa ganha muito esta temporada."},
  {tense:"presente",pre:"Yo",post:"un correo electrónico a mi jefe.",pronoun:"yo",verb:"escribir",tr:"J'écris un e-mail à mon patron.",trEn:"I write an email to my boss.",trPt:"Eu escrevo um e-mail para o meu chefe."},
  {tense:"presente",pre:"Ella",post:"fotos de sus viajes en Instagram.",pronoun:"él",verb:"subir",tr:"Elle publie des photos de ses voyages sur Instagram.",trEn:"She posts photos of her trips on Instagram.",trPt:"Ela publica fotos das suas viagens no Instagram."},
  {tense:"presente",pre:"Nosotros",post:"la reunión por videollamada.",pronoun:"nosotros",verb:"hacer",tr:"Nous faisons la réunion en visioconférence.",trEn:"We hold the meeting by video call.",trPt:"Nós fazemos a reunião por videochamada."},
  {tense:"presente",pre:"Ellos",post:"la respuesta en internet.",pronoun:"ellos",verb:"buscar",tr:"Ils cherchent la réponse sur internet.",trEn:"They look for the answer on the internet.",trPt:"Eles procuram a resposta na internet."},
  {tense:"presente",pre:"Tú",post:"siempre lo que piensas en las redes sociales.",pronoun:"tú",verb:"decir",tr:"Tu dis toujours ce que tu penses sur les réseaux sociaux.",trEn:"You always say what you think on social media.",trPt:"Tu dizes sempre o que pensas nas redes sociais."},
  {tense:"presente",pre:"Yo",post:"muchos documentos al trabajo.",pronoun:"yo",verb:"traer",tr:"J'apporte beaucoup de documents au travail.",trEn:"I bring many documents to work.",trPt:"Eu trago muitos documentos para o trabalho."},
  {tense:"presente",pre:"Yo",post:"un libro muy interesante.",pronoun:"yo",verb:"leer",tr:"Je lis un livre très intéressant.",trEn:"I am reading a very interesting book.",trPt:"Eu leio um livro muito interessante."},
  {tense:"presente",pre:"Tú",post:"muy bien en las fiestas.",pronoun:"tú",verb:"bailar",tr:"Tu danses très bien lors des fêtes.",trEn:"You dance very well at parties.",trPt:"Tu danças muito bem nas festas."},
  {tense:"presente",pre:"Ella",post:"en un coro de música clásica.",pronoun:"él",verb:"cantar",tr:"Elle chante dans un chœur de musique classique.",trEn:"She sings in a classical music choir.",trPt:"Ela canta num coro de música clássica."},
  {tense:"presente",pre:"Nosotros",post:"al teatro esta noche.",pronoun:"nosotros",verb:"ir",tr:"Nous allons au théâtre ce soir.",trEn:"We are going to the theatre tonight.",trPt:"Nós vamos ao teatro esta noite."},
  {tense:"presente",pre:"Vosotros",post:"una película francesa esta tarde.",pronoun:"vosotros",verb:"ver",tr:"Vous regardez un film français cet après-midi.",trEn:"You are watching a French film this afternoon.",trPt:"Vocês veem um filme francês esta tarde."},
  {tense:"presente",pre:"Yo",post:"que la música clásica es muy relajante.",pronoun:"yo",verb:"creer",tr:"Je crois que la musique classique est très relaxante.",trEn:"I think classical music is very relaxing.",trPt:"Eu acho que a música clássica é muito relaxante."},
  {tense:"presente",pre:"Ese abrigo",post:"cien euros.",pronoun:"él",verb:"costar",tr:"Ce manteau coûte cent euros.",trEn:"That coat costs one hundred euros.",trPt:"Esse casaco custa cem euros."},
  {tense:"presente",pre:"Ellos",post:"flores para el cumpleaños.",pronoun:"ellos",verb:"traer",tr:"Ils apportent des fleurs pour l'anniversaire.",trEn:"They bring flowers for the birthday.",trPt:"Eles trazem flores para o aniversário."},
  {tense:"presente",pre:"Tú",post:"el recibo al cajero.",pronoun:"tú",verb:"dar",tr:"Tu donnes le ticket au caissier.",trEn:"You give the receipt to the cashier.",trPt:"Tu dás o recibo ao caixa."},
  {tense:"presente",pre:"Nosotros",post:"el mejor producto del mercado.",pronoun:"nosotros",verb:"obtener",tr:"Nous obtenons le meilleur produit du marché.",trEn:"We get the best product on the market.",trPt:"Nós obtemos o melhor produto do mercado."},
  {tense:"presente",pre:"Yo no",post:"dónde está la librería más cercana.",pronoun:"yo",verb:"saber",tr:"Je ne sais pas où est la librairie la plus proche.",trEn:"I don't know where the nearest bookshop is.",trPt:"Eu não sei onde fica a livraria mais próxima."},
  {tense:"presente",pre:"Mi cabeza",post:"mucho esta mañana.",pronoun:"él",verb:"doler",tr:"J'ai très mal à la tête ce matin.",trEn:"My head hurts a lot this morning.",trPt:"A minha cabeça dói muito esta manhã."},
  {tense:"presente",pre:"El médico",post:"que necesito descansar más.",pronoun:"él",verb:"decir",tr:"Le médecin dit que je dois me reposer davantage.",trEn:"The doctor says I need to rest more.",trPt:"O médico diz que preciso de descansar mais."},
  {tense:"presente",pre:"Yo",post:"muy mal cuando como demasiado.",pronoun:"yo",verb:"sentir",tr:"Je me sens très mal quand je mange trop.",trEn:"I feel very ill when I eat too much.",trPt:"Eu sinto-me muito mal quando como demasiado."},
  {tense:"presente",pre:"Ellos",post:"bien después de la operación.",pronoun:"ellos",verb:"estar",tr:"Ils vont bien après l'opération.",trEn:"They are fine after the operation.",trPt:"Eles estão bem depois da operação."},
  {tense:"presente",pre:"Yo no",post:"en qué pensar.",pronoun:"yo",verb:"saber",tr:"Je ne sais pas quoi penser.",trEn:"I don't know what to think.",trPt:"Eu não sei em que pensar."},
  {tense:"presente",pre:"Tú",post:"razón, hay que cambiar de plan.",pronoun:"tú",verb:"tener",tr:"Tu as raison, il faut changer de plan.",trEn:"You are right, we need to change the plan.",trPt:"Tu tens razão, é preciso mudar de plano."},
  {tense:"presente",pre:"Nosotros",post:"las maletas al taxi.",pronoun:"nosotros",verb:"traer",tr:"Nous apportons les valises au taxi.",trEn:"We bring the suitcases to the taxi.",trPt:"Nós trazemos as malas para o táxi."},
  {tense:"presente",pre:"Ella",post:"muy bien a su vecino.",pronoun:"él",verb:"conocer",tr:"Elle connaît très bien son voisin.",trEn:"She knows her neighbour very well.",trPt:"Ela conhece muito bem o seu vizinho."},
  {tense:"presente",pre:"Yo",post:"la ropa en la maleta.",pronoun:"yo",verb:"poner",tr:"Je mets les vêtements dans la valise.",trEn:"I put the clothes in the suitcase.",trPt:"Eu ponho a roupa na mala."},
  {tense:"presente",pre:"Ellos",post:"del trabajo a las seis.",pronoun:"ellos",verb:"salir",tr:"Ils sortent du travail à six heures.",trEn:"They leave work at six o'clock.",trPt:"Eles saem do trabalho às seis."},
  {tense:"presente",pre:"Tú",post:"muy bien el español.",pronoun:"tú",verb:"entender",tr:"Tu comprends très bien l'espagnol.",trEn:"You understand Spanish very well.",trPt:"Tu entendes muito bem o espanhol."},
  {tense:"presente",pre:"Yo",post:"un ruido extraño en la calle.",pronoun:"yo",verb:"oír",tr:"J'entends un bruit étrange dans la rue.",trEn:"I hear a strange noise in the street.",trPt:"Eu ouço um barulho estranho na rua."},
  {tense:"presente",pre:"Nosotros",post:"de vacaciones en agosto.",pronoun:"nosotros",verb:"volver",tr:"Nous revenons de vacances en août.",trEn:"We come back from holiday in August.",trPt:"Nós voltamos de férias em agosto."},
  {tense:"presente",pre:"Ella",post:"instrucciones claras al equipo.",pronoun:"él",verb:"dar",tr:"Elle donne des instructions claires à l'équipe.",trEn:"She gives clear instructions to the team.",trPt:"Ela dá instruções claras à equipa."},
  {tense:"presente",pre:"Vosotros",post:"a casa antes de medianoche.",pronoun:"vosotros",verb:"volver",tr:"Vous rentrez à la maison avant minuit.",trEn:"You come home before midnight.",trPt:"Vocês voltam para casa antes da meia-noite."},
  {tense:"presente",pre:"El texto",post:"del español al francés.",pronoun:"él",verb:"traducir",tr:"Le texte se traduit de l'espagnol au français.",trEn:"The text is translated from Spanish to French.",trPt:"O texto traduz-se do espanhol para o francês."},
  {tense:"presente",pre:"Yo",post:"a mis amigos al aeropuerto.",pronoun:"yo",verb:"seguir",tr:"Je suis mes amis jusqu'à l'aéroport.",trEn:"I follow my friends to the airport.",trPt:"Eu sigo os meus amigos até ao aeroporto."},
  {tense:"presente",pre:"Tú",post:"demasiado rápido y a veces te equivocas.",pronoun:"tú",verb:"elegir",tr:"Tu choisis trop vite et tu te trompes parfois.",trEn:"You choose too quickly and sometimes make mistakes.",trPt:"Tu escolhes demasiado rápido e às vezes enganás-te."},
  {tense:"presente",pre:"Nosotros",post:"agua en las botellas.",pronoun:"nosotros",verb:"incluir",tr:"Nous incluons de l'eau dans les bouteilles.",trEn:"We include water in the bottles.",trPt:"Nós incluímos água nas garrafas."},


];

const TEMPLATE_TENSES = [
  "presente",
  "indefinido",
  "imperfecto",
  "perfecto",
  "pluscuamperfecto",
  "futuro",
  "futuro_perifrastico",
  "condicional",
  "subjuntivo",
  "subjuntivo_imperfecto",
  "imperativo",
];

const TENSE_CONTEXTS = {
  presente: {
    pre: (subject, template) => template.pre,
    post: (post, template) => template.post,
  },
  indefinido: {
    pre: subject => `Ayer, ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "indefinido"),
    trEn: text => adaptTranslationTime(text, "en", "indefinido"),
    trPt: text => adaptTranslationTime(text, "pt", "indefinido"),
  },
  imperfecto: {
    pre: subject => `Antes, ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "imperfecto"),
    trEn: text => adaptTranslationTime(text, "en", "imperfecto"),
    trPt: text => adaptTranslationTime(text, "pt", "imperfecto"),
  },
  perfecto: {
    pre: subject => `Esta semana, ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "perfecto"),
    trEn: text => adaptTranslationTime(text, "en", "perfecto"),
    trPt: text => adaptTranslationTime(text, "pt", "perfecto"),
  },
  pluscuamperfecto: {
    pre: subject => `Antes de llegar, ${lowerFirst(subject)} ya`,
    tr: text => adaptTranslationTime(text, "fr", "pluscuamperfecto"),
    trEn: text => adaptTranslationTime(text, "en", "pluscuamperfecto"),
    trPt: text => adaptTranslationTime(text, "pt", "pluscuamperfecto"),
  },
  futuro: {
    pre: subject => `Mañana, ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "futuro"),
    trEn: text => adaptTranslationTime(text, "en", "futuro"),
    trPt: text => adaptTranslationTime(text, "pt", "futuro"),
  },
  futuro_perifrastico: {
    pre: subject => `Esta tarde, ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "futuro_perifrastico"),
    trEn: text => adaptTranslationTime(text, "en", "futuro_perifrastico"),
    trPt: text => adaptTranslationTime(text, "pt", "futuro_perifrastico"),
  },
  condicional: {
    pre: subject => `Con más tiempo, ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "condicional"),
    trEn: text => adaptTranslationTime(text, "en", "condicional"),
    trPt: text => adaptTranslationTime(text, "pt", "condicional"),
  },
  subjuntivo: {
    pre: subject => `Es posible que ${lowerFirst(subject)}`,
    tr: text => adaptTranslationTime(text, "fr", "subjuntivo"),
    trEn: text => adaptTranslationTime(text, "en", "subjuntivo"),
    trPt: text => adaptTranslationTime(text, "pt", "subjuntivo"),
  },
  subjuntivo_imperfecto: {
    pre: subject => `Si ${lowerFirst(subject)}`,
    post: post => `${stripFinalPunctuation(post)} sería diferente.`,
    tr: text => adaptTranslationTime(text, "fr", "subjuntivo_imperfecto"),
    trEn: text => adaptTranslationTime(text, "en", "subjuntivo_imperfecto"),
    trPt: text => adaptTranslationTime(text, "pt", "subjuntivo_imperfecto"),
  },
  imperativo: {
    pre: (subject, template) => imperativePre(template),
    tr: text => adaptTranslationTime(text, "fr", "imperativo"),
    trEn: text => adaptTranslationTime(text, "en", "imperativo"),
    trPt: text => adaptTranslationTime(text, "pt", "imperativo"),
  },
};

T.forEach(template => {
  template.variants = {
    ...buildGeneratedVariants(template),
    ...(template.variants || {}),
  };
});

const T_FAMILIES = T.filter(template => template.tense === "presente");

const T_TENSES = TEMPLATE_TENSES.reduce((groups, tense) => {
  groups[tense] = T_FAMILIES.map(template => buildTenseTemplate(template, tense))
    .filter(template => template.pronoun !== "yo" || tense !== "imperativo");
  return groups;
}, {});

function buildTenseTemplate(template, tense) {
  const context = TENSE_CONTEXTS[tense] || TENSE_CONTEXTS.presente;
  const variant = (template.variants && template.variants[tense]) || {};
  const subject = normalizeSubject(template.pre);
  const post = cleanPost(variant.post || (context.post ? context.post(template.post, template) : template.post));
  const pre = typeof context.pre === "function" ? context.pre(subject, template) : subject;

  return {
    ...template,
    ...variant,
    tense,
    pre: cleanPre(variant.pre || pre),
    post,
    tr: variant.tr || (context.tr ? context.tr(template.tr, template) : template.tr),
    trEn: variant.trEn || (context.trEn ? context.trEn(template.trEn, template) : template.trEn),
    trPt: variant.trPt || (context.trPt ? context.trPt(template.trPt, template) : template.trPt),
  };
}

function buildGeneratedVariants(template) {
  return TEMPLATE_TENSES.reduce((variants, tense) => {
    if (tense === "presente") return variants;

    const context = TENSE_CONTEXTS[tense] || TENSE_CONTEXTS.presente;
    const subject = normalizeSubject(template.pre);

    variants[tense] = {
      pre: cleanPre(typeof context.pre === "function" ? context.pre(subject, template) : subject),
      post: cleanPost(context.post ? context.post(template.post, template) : template.post),
      tr: context.tr ? context.tr(template.tr, template) : template.tr,
      trEn: context.trEn ? context.trEn(template.trEn, template) : template.trEn,
      trPt: context.trPt ? context.trPt(template.trPt, template) : template.trPt,
    };

    return variants;
  }, {});
}

function normalizeSubject(pre) {
  return cleanPre(pre)
    .replace(/^Cada mañana,\s*/i, "")
    .replace(/^Cada semana,\s*/i, "")
    .replace(/^Todos los días,\s*/i, "")
    .replace(/^Por la mañana,\s*/i, "")
    .replace(/^Hoy,\s*/i, "")
    .replace(/^Esta noche,\s*/i, "")
    .replace(/^Esta tarde,\s*/i, "")
    .replace(/^Mañana,\s*/i, "")
    .replace(/^El próximo verano,\s*/i, "")
    .replace(/^El próximo año,\s*/i, "")
    .replace(/\bsiempre\b/gi, "")
    .replace(/\btodavía no\b/gi, "no")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanPre(pre) {
  return String(pre || "").replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}

function cleanPost(post) {
  return String(post || "")
    .replace(/\bcada semana\b/gi, "")
    .replace(/\bcada día\b/gi, "")
    .replace(/\btodos los días\b/gi, "")
    .replace(/\btodos los domingos\b/gi, "")
    .replace(/\btodos los veranos\b/gi, "")
    .replace(/\blos sábados por la mañana\b/gi, "")
    .replace(/\blos fines de semana\b/gi, "")
    .replace(/\bel fin de semana\b/gi, "")
    .replace(/\bpor las noches\b/gi, "")
    .replace(/\besta noche\b/gi, "")
    .replace(/\besta tarde\b/gi, "")
    .replace(/\bmañana\b/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function imperativePre(template) {
  if (template.pronoun === "nosotros") return "Vamos,";
  if (template.pronoun === "ellos" || template.pronoun === "él") {
    return `Que ${lowerFirst(normalizeSubject(template.pre))}`;
  }
  return "Por favor,";
}

function lowerFirst(text) {
  const value = cleanPre(text);
  if (/^(yo|tú|él|ella|nosotros|vosotros|ellos|ellas)\b/i.test(value)) return value.toLowerCase();
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function adaptTranslationTime(text, lang, tense) {
  const cleaned = cleanTranslation(text, lang);
  if (tense === "imperativo") return cleaned;
  const prefix = {
    fr: {
      indefinido: "Hier, ",
      imperfecto: "Avant, ",
      perfecto: "Cette semaine, ",
      pluscuamperfecto: "Avant d'arriver, ",
      futuro: "Demain, ",
      futuro_perifrastico: "Cet après-midi, ",
      condicional: "Avec plus de temps, ",
      subjuntivo: "Il est possible que ",
      subjuntivo_imperfecto: "Si ",
      imperativo: "",
    },
    en: {
      indefinido: "Yesterday, ",
      imperfecto: "Before, ",
      perfecto: "This week, ",
      pluscuamperfecto: "Before arriving, ",
      futuro: "Tomorrow, ",
      futuro_perifrastico: "This afternoon, ",
      condicional: "With more time, ",
      subjuntivo: "It is possible that ",
      subjuntivo_imperfecto: "If ",
      imperativo: "",
    },
    pt: {
      indefinido: "Ontem, ",
      imperfecto: "Antes, ",
      perfecto: "Esta semana, ",
      pluscuamperfecto: "Antes de chegar, ",
      futuro: "Amanhã, ",
      futuro_perifrastico: "Esta tarde, ",
      condicional: "Com mais tempo, ",
      subjuntivo: "É possível que ",
      subjuntivo_imperfecto: "Se ",
      imperativo: "",
    },
  };
  const suffix = tense === "subjuntivo_imperfecto"
    ? {fr:" ce serait différent.", en:" it would be different.", pt:" seria diferente."}[lang]
    : "";
  return `${prefix[lang][tense] || ""}${lowerFirstTranslation(stripFinalPunctuation(cleaned), lang)}${suffix}`;
}

function cleanTranslation(text, lang) {
  const patterns = {
    fr: [
      /^Chaque matin,\s*/i,
      /^Tous les matins,\s*/i,
      /^Tous les jours,\s*/i,
      /^Cette semaine,\s*/i,
      /^Aujourd'hui,\s*/i,
      /^Ce soir,\s*/i,
      /^Cet après-midi,\s*/i,
      /^Demain,\s*/i,
    ],
    en: [
      /^Every morning,\s*/i,
      /^Every day,\s*/i,
      /^This week,\s*/i,
      /^Today,\s*/i,
      /^Tonight,\s*/i,
      /^This afternoon,\s*/i,
      /^Tomorrow,\s*/i,
    ],
    pt: [
      /^Todas as manhãs,\s*/i,
      /^Todos os dias,\s*/i,
      /^Esta semana,\s*/i,
      /^Hoje,\s*/i,
      /^Esta noite,\s*/i,
      /^Esta tarde,\s*/i,
      /^Amanhã,\s*/i,
    ],
  };

  return (patterns[lang] || []).reduce((value, pattern) => value.replace(pattern, ""), String(text || ""))
    .replace(/\s+/g, " ")
    .trim();
}

function stripFinalPunctuation(text) {
  return String(text || "").replace(/[.!?¡¿]+$/g, "").trim();
}

function lowerFirstTranslation(text, lang) {
  const value = cleanPre(text);
  if (lang === "en" && /^I\b/.test(value)) return value;
  return lowerFirst(value);
}
